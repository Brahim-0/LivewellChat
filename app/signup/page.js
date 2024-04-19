'use client'

import React, { useState, useEffect } from 'react';
import { verifyToken } from '../api/auth';

export default function SignupForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
        role: 'patient' // Default role is patient
    });

    useEffect(() => {
        const token = localStorage.getItem('jwt_');
        if (token) {
            const userId = verifyToken(token);
            if (userId) {
                window.location.href = "/"; 
            } else {
                localStorage.removeItem('jwt_'); 
            }
        }
    }, []); //if the user is authenticated, redirect to home

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? (checked ? 'doctor' : 'patient') : value;

        setFormData({ ...formData, [name]: val });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                alert('Signup successful!'); 
                window.location.href = "/login"; 
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div style={styles.container}>
          <div style={styles.formContainer}>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
              <label htmlFor="email" style={styles.label}>Email:</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} required /><br />
              <label htmlFor="username" style={styles.label}>Username:</label>
              <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} style={styles.input} required /><br />
              <label htmlFor="password" style={styles.label}>Password:</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} style={styles.input} required /><br />
              <label htmlFor="role" style={styles.label}>
                <input type="checkbox" id="role" name="role" checked={formData.role === 'doctor'} onChange={handleChange} />
                I am a doctor
              </label><br />
              <button type="submit" style={styles.signUpButton}>Sign Up</button>
            </form>
          </div>
        </div>
      );
};


const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', // Adjust as needed
    },
    formContainer: {
      width: '300px', // Adjust as needed
    },
    label: {
      marginBottom: '5px',
      display: 'block',
    },
    input: {
      marginBottom: '10px',
      width: '100%',
      padding: '5px',
      boxSizing: 'border-box',
    },
    signUpButton: {
      padding: '8px 16px',
      background: '#ff6347',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      outline: 'none',
    },
    logoutButton: {
        padding: '8px 16px',
        background: '#ff6347',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        outline: 'none',
        marginBottom: "10px",
        marginLeft: "10px"
      },
  };
