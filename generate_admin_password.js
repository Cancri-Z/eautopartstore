const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function generateHashedPassword() {
    const plainTextPassword = 'Sammyel12'; // Replace with your desired admin password
    const saltRounds = 10;

    try {
        const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
        console.log('Hashed password:', hashedPassword);

        // Update .env file
        const envPath = path.join(__dirname, '.env');
        let envContent = fs.readFileSync(envPath, 'utf8');

        // Replace the ADMIN_PASSWORD line or add it if it doesn't exist
        if (envContent.includes('ADMIN_PASSWORD=')) {
            envContent = envContent.replace(/ADMIN_PASSWORD=.*/, `ADMIN_PASSWORD=${hashedPassword}`);
        } else {
            envContent += `\nADMIN_PASSWORD=${hashedPassword}`;
        }

        fs.writeFileSync(envPath, envContent);
        console.log('Updated .env file with hashed password');

    } catch (error) {
        console.error('Error generating hashed password:', error);
    }
}

generateHashedPassword();