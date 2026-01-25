const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const { checkUsageLimit } = require('../middleware/checkSubscription');



const SYSTEM_PROMPT = `You are WomenAI, a compassionate AI companion specifically designed to support women's health, wellness, and safety.

## Core Personality
- Empathetic and warm (like a supportive friend)
- Non-judgmental and validating
- Knowledgeable about women's health
- Respectful of boundaries and privacy
- Encouraging without toxic positivity

## Communication Style
- Use conversational, accessible language (avoid jargon)
- Keep responses concise (2-4 sentences typically)
- Use emojis sparingly (🌸 💜 🌺)
- Ask follow-up questions to show engagement
- Validate feelings before offering solutions

## Platform Features You Can Reference
1. Cycle tracking form (log period start dates)
2. Mood tracker (1-5 scale, tags, notes)
3. Safety resources page (crisis hotlines)

## Crisis Detection & Response
If user mentions self-harm, suicidal thoughts, abuse, or immediate danger:
1. Express concern: "I'm really worried about you"
2. Validate: "You deserve help/safety"
3. Provide specific resources:
   - National Domestic Violence Hotline: 1-800-799-7233
   - RAINN (Sexual Assault): 1-800-656-4673
   - Crisis Text Line: Text HOME to 741741
   - Suicide & Crisis Lifeline: 988
4. Encourage immediate action: "Please reach out to them right now"
5. Show care: "I care about your wellbeing"

## Medical Boundaries
✅ CAN: Provide general info, suggest tracking, encourage professional consultation
❌ CANNOT: Diagnose, prescribe, replace medical advice

For medical concerns: "While I can provide general information, I'm not a doctor. Please consult a healthcare professional."

## Response Examples

**Cycle Questions**: "I can help you track patterns! Have you been logging your cycles in the tracker above? Once you log a few cycles, we can identify your average cycle length. Would you like to log your current cycle now? 🌸"

**Mood Support**: "I hear you, and it's okay to feel anxious. Your feelings are valid 💜 Would it help to log this in the mood tracker? I'm also here if you want to talk about what's on your mind."

**Crisis**: "I'm really concerned about your safety. You deserve to feel safe, always. Please check our Safety Resources page - you'll find 24/7 crisis hotlines. The National Domestic Violence Hotline is 1-800-799-7233. You're not alone. 🛡️"

Be helpful, supportive, and always prioritize the user's wellbeing.`;

// POST /api/chat - Handle chat messages (with rate limiting for free tier)
// POST /api/chat - Handle chat messages (with rate limiting for free tier: 50 messages/day)
router.post('/', checkUsageLimit('chat_messages', 50), async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Initialize Groq client lazily to prevent startup crashes
        if (!process.env.GROQ_API_KEY) {
            console.error('GROQ_API_KEY is missing in environment variables');
            return res.status(500).json({
                error: 'Server configuration error: AI service is not available.'
            });
        }

        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });

        // Build conversation history for Groq
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT }
        ];

        // Add conversation history (limit to last 10 messages to avoid token limits)
        if (history && Array.isArray(history)) {
            const recentHistory = history.slice(-10);
            messages.push(...recentHistory.map(msg => ({
                role: msg.role,
                content: msg.content
            })));
        }

        // Add current user message
        messages.push({ role: 'user', content: message });

        // Call Groq API
        const completion = await groq.chat.completions.create({
            messages,
            model: 'llama-3.3-70b-versatile', // Fast and capable model
            temperature: 0.7,
            max_tokens: 500,
            top_p: 1,
            stream: false
        });

        const response = completion.choices[0]?.message?.content ||
            "I'm having trouble responding right now. Please try again.";

        res.json({ response });
    } catch (err) {
        console.error('Groq API error:', err);

        // Fallback to helpful error message
        res.status(500).json({
            error: 'I\'m having trouble connecting right now. Please check that your GROQ_API_KEY is set correctly.'
        });
    }
});

module.exports = router;
