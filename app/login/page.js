'use client'
import React, { useState, useEffect } from 'react';
import { verifyToken } from '../api/auth';


export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('jwt_');

    if (token) {
      const userId = verifyToken(token);
      if (userId) {
        window.location.href = "/"; // Redirect to home page if token is valid
      } else {
        localStorage.removeItem('jwt_'); // Remove invalid token from local storage
      }
    }
  }, []); // If the user is authenticated, redirect to home

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        alert('Login successful!'); 
        localStorage.setItem('jwt_', data.token); // Save the token to browser
        window.location.href = "/message"; 

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
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" style={styles.label}>Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} required /><br />
          <label htmlFor="password" style={styles.label}>Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} style={styles.input} required /><br />
          <button type="submit" style={styles.logoutButton}>Login</button>
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
        height: '100vh', 
      },
      formContainer: {
        width: '300px', 
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
  