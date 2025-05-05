import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();

    function GoToRREF() {
        navigate('/rref');
    }

    function GotoQR() {
        navigate('/qr');
    }

    function GotoEigen() {
        navigate('/eigen');
    }
    function GotoChangeOfBase() {
        navigate('/changeofbase');
    }
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Welcome to Linear Algebra Explorer</h1>
            <p style={styles.subtitle}>
                Dive into the world of matrices, vectors, and transformations!
            </p>
            <button style ={styles.button} onClick={GoToRREF}>RREF</button>
            <br></br>
            <button style ={styles.button} onClick={GotoQR}>QR</button>
            <br></br>
            <button style ={styles.button} onClick={GotoEigen}>Eigen</button>
            <br></br>
            <button style ={styles.button} onClick={GotoChangeOfBase}>Change of Basis</button>
        </div>

        

        
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f9',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '3rem',
        color: '#333',
    },
    subtitle: {
        fontSize: '1.5rem',
        color: '#555',
        margin: '20px 0',
    },
    button: {
        padding: '10px 20px',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#007BFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default Landing;