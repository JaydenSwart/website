const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Path to the user details file
const userDetailsPath = path.join(__dirname, 'userDetails.json');

// Admin email
const ADMIN_EMAIL = 'jaydenswart048@gmail.com';

app.use(bodyParser.json());

// Load user details from the file
function loadUserDetails() {
    if (!fs.existsSync(userDetailsPath)) {
        fs.writeFileSync(userDetailsPath, JSON.stringify([]));
    }
    const data = fs.readFileSync(userDetailsPath);
    return JSON.parse(data);
}

// Save user details to the file
function saveUserDetails(users) {
    fs.writeFileSync(userDetailsPath, JSON.stringify(users, null, 2));
}

// Signup endpoint
app.post('/signup', (req, res) => {
    const { email, password, alias } = req.body;

    if (!email || !password || !alias) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const users = loadUserDetails();

    // Check if the alias contains "Admin" and the email is not the admin email
    if (alias.toLowerCase().includes('admin') && email !== ADMIN_EMAIL) {
        return res.status(400).json({ error: 'Only the admin can use aliases containing "Admin".' });
    }

    // Check if the alias is already in use
    if (users.some(user => user.alias === alias)) {
        return res.status(400).json({ error: 'Alias is already in use. Please choose a different alias.' });
    }

    // Check if the email is already registered
    if (users.some(user => user.email === email)) {
        return res.status(400).json({ error: 'Email is already registered.' });
    }

    // Add the new user
    users.push({ email, password, alias });
    saveUserDetails(users);

    res.status(201).json({ message: 'Account created successfully!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
