const { execSync } = require('child_process');
const path = require('path');

const scripts = [
    'create_users_table.js',
    'create_cycles_table.js',
    'create_additional_tables.js'
];

console.log('Starting Database Initialization...');

try {
    for (const script of scripts) {
        console.log(`\n--- Running ${script} ---`);
        const scriptPath = path.join(__dirname, script);
        execSync(`node ${scriptPath}`, { stdio: 'inherit' });
    }
    console.log('\n✅ Database initialized successfully.');
} catch (error) {
    console.error('\n❌ Failed to initialize database.');
    process.exit(1);
}
