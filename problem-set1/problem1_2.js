const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

let urlDatabase = {};

// Function to generate a random string
const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8); //doesnt include 8th number
    //0.123456 = 0.w31hsq = w31hsq
};

// POST route to shorten a URL
app.post('/shorten', (req, res) => {
    const longURL = req.body.longURL;

    // if no url provided
    if (!longURL) {
        return res.status(400).json({
            error: 'long url required'
        });
    }

    // Generate a unique code
    let shortCode = generateShortCode();

    // To ensure the code is unique, check if it is in the local database
    while (urlDatabase[shortCode]) {
        shortCode = generateShortCode(); //call again
    }

    // Store long URL with their short code
    urlDatabase[shortCode] = longURL;
    //shortCode is the key and longURL is the value in that key
    console.log(urlDatabase)

    // Send the result
    res.json({
        shortURL: `http://localhost:${PORT}/${shortCode}`, // Corrected from `shortcode` to `shortCode`
        longURL: longURL,
    });
});

// GET route to redirect to the original URL
app.get('/:shortCode', (req, res) => {
    const shortCode = req.params.shortCode; 
    const longURL = urlDatabase[shortCode];

    if (longURL) {
        return res.status(200).json(longURL); // Redirect to the long URL
        
    } else {
        return res.status(404).json({ error: 'Shortcode not found' }); // Handle 404 error
    }
});

app.listen(PORT, () => {
    console.log(`Your server is running on port: ${PORT}`);
});
