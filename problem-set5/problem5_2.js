const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createClient } = require('redis'); // Updated Redis import

const app = express();
app.use(express.json());
const PORT = 3000;

// Initializing the Redis client
const redisClient = createClient();

// Handle Redis errors
redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Connect to Redis
async function connectRedis() {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.log('Error connecting to Redis:', error);
    }
}

// Connect to Redis at the beginning of the server start
connectRedis();

// JWT secret
const JWT_SECRET = 'secret_key_bro';

// Register a new user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user already exists in Redis
        const existingUser = await redisClient.get(username);
        
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists',
            });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store user in Redis (using username as the key and hashed password as value)
        await redisClient.set(username, hashedPassword);

        return res.status(201).json({
            message: 'User stored successfully',
        });
    } catch (err) {
        console.log('Error during registration:', err);
        return res.status(500).json({
            message: 'Error registering user',
        });
    }
});

// Login an existing user
app.post('/login', async (req, res) => {
    const {username, password} = req.body;
     try {
        //check if user exists or not
        const existingUser = await redisClient.get(username);
        if(!existingUser){
            return res.status(404).json({
                message: 'user not found'
            })
        }

        //compare password with hashed password
        const isMatch = await bcrypt.compare(password, existingUser)
        if(!isMatch){
            return res.status(404).json({
                message: 'incorrect password'
            })
        }

        //generate jwt token
        const token = jwt.sign({username}, JWT_SECRET, {expiresIn: '1h'});
        return res.status(200).json({
            message: 'login successful',
            token,
        });

     } catch (error) {
        console.log('Error during login:', err);
        return res.status(500).json({
            message: 'Error logging in',
        });
     }
});

//middleware to verify token
const vreifyToken = (req,res,next)=>{
    const token = req.header('Authorization')?.split(' ')[1];

    if(!token){
        return res.status(403).json({
            message: 'token not provided'
        })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log('Token verification error:', err);
        return res.status(401).json({
            message: 'Invalid or expired token',
        });
    }
}

// Dashboard route (for testing purposes, you can add more functionality here)
app.get('/dashboard', vreifyToken, (req, res) => {
    res.send(`Welcome to your dashboard, ${req.user.username}!`);
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`App running on port: ${PORT}`);
});
