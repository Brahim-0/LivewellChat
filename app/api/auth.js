const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import supabase from './db'; // Adjust the path accordingly


const tokenSecret = '7dijsabnfiu4uibirwb34uib3ubf'; //secret key

// Function to hash password
export async function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

// Function to generate JWT token
export function generateToken(userId) {
    return jwt.sign({ userId }, tokenSecret, { expiresIn: '1h' }); // Token expires in 1 hour
}

export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, tokenSecret);
        return decoded.userId; // Return the user ID if the token is valid
    } catch (error) {
        console.error('Error verifying token:', error);
        return null; // Return null if token is invalid or expired
    }
}

export function setJwtCookie(token, daysToExpire) {
    var expires = "";
    if (daysToExpire) {
        var date = new Date();
        date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = "jwtToken=" + token + expires + "; path=/";
}


