# Groq API Setup for WomenAI

## Getting Your API Key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key

## Configuration

Add your Groq API key to the backend `.env` file:

```bash
# /home/alan/home_ai/projects/WomenAI/backend/.env
GROQ_API_KEY=gsk_your_actual_api_key_here
```

## Restart Backend

After adding the key, restart the backend server:

```bash
cd /home/alan/home_ai/projects/WomenAI/backend
pkill -f "node index.js"
node index.js
```

## Model Used

- **Model**: `llama-3.3-70b-versatile`
- **Temperature**: 0.7 (balanced creativity)
- **Max Tokens**: 500 (concise responses)

## System Prompt

The AI is configured with a comprehensive system prompt that makes it:
- Empathetic and supportive
- Knowledgeable about women's health
- Aware of the platform's features (cycle tracking, mood logging, safety resources)
- Safety-conscious (provides crisis resources when needed)
