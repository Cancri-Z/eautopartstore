// utils/userUtils.js
const fs = require('fs');
const path = require('path');

function getUsersFromFile() {
    try {
        const usersFilePath = path.join(__dirname, '..', 'json_folder', 'users.json');
        if (fs.existsSync(usersFilePath)) {
            const data = fs.readFileSync(usersFilePath, 'utf8');
            return JSON.parse(data);
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error reading user data from file:', error);
        return [];
    }
}

function addUserToFile(userData) {
    try {
        const usersFilePath = path.join(__dirname, '..', 'json_folder', 'users.json');
        let users = getUsersFromFile();
        users.push(userData);
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error writing user data to file:', error);
    }
}

module.exports = { getUsersFromFile, addUserToFile };