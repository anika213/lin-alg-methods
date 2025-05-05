import React, { useState } from "react";
import * as numeric from "numeric";

export default function Eigen() {
  const [input, setInput] = useState("");
  const [eigenvalues, setEigenvalues] = useState(null);
  const [error, setError] = useState("");

  const parseMatrix = (str) => {
    try {
      const rows = str
        .trim()
        .split("\n")
        .map((row) =>
          row
            .trim()
            .split(/\s+/)
            .map((num) => parseFloat(num))
        );
      if (
        rows.length === 0 ||
        rows.some(
          (row) => row.length === 0 || row.some((val) => isNaN(val))
        )
      ) {
        return null;
      }
      return rows;
    } catch {
      return null;
    }
  };

  const isSquare = (matrix) =>
    matrix && matrix.length > 0 && matrix.every((r) => r.length === matrix.length);

  const computeEigenvalues = (matrix) => {
    try {
      const eg = numeric.eig(matrix);
      if (!eg.lambda || !Array.isArray(eg.lambda.x)) {
        throw new Error("unexpected eig result");
      }
      const realParts = eg.lambda.x;
      const imagParts = Array.isArray(eg.lambda.y)
        ? eg.lambda.y
        : Array(realParts.length).fill(0);

      const eps = 1e-10;
      if (imagParts.some((im) => Math.abs(im) >= eps)) {
        return null;
      }

      // round each real eigenvalue to 2 decimal places
      return realParts.map((v) => Math.round(v * 100) / 100);
    } catch (e) {
      console.error("Eigen computation error:", e);
      return "error";
    }
  };

  const handleSubmit = () => {
    const M = parseMatrix(input);
    if (!M) {
      setError("Please enter a valid numeric matrix.");
      setEigenvalues(null);
      return;
    }
    if (!isSquare(M)) {
      setError("Matrix must be square (n × n).");
      setEigenvalues(null);
      return;
    }

    const vals = computeEigenvalues(M);
    if (vals === "error") {
      setError("Error computing eigenvalues. Check the matrix entries.");
      setEigenvalues(null);
      return;
    }
    if (vals === null) {
      setError("Some eigenvalues are not real—aborting.");
      setEigenvalues(null);
      return;
    }

    setError("");
    setEigenvalues(vals);
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f4f4f9",
      fontFamily: "Arial, sans-serif",
      padding: "2rem",
    },
    card: {
      backgroundColor: "#fff",
      padding: "2rem",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      maxWidth: "700px",
      width: "100%",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      textAlign: "center",
      color: "#333",
    },
    label: {
      marginBottom: "0.5rem",
      color: "#555",
    },
    textarea: {
      width: "100%",
      height: "150px",
      padding: "0.75rem",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontFamily: "monospace",
      fontSize: "0.9rem",
      resize: "none",
      marginBottom: "1rem",
    },
    button: {
      padding: "10px 20px",
      fontSize: "1rem",
      color: "#fff",
      backgroundColor: "#007BFF",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginTop: "1rem",
    },
    error: {
      color: "red",
      marginTop: "0.5rem",
    },
    sectionTitle: {
      fontWeight: "bold",
      marginTop: "1.5rem",
      marginBottom: "0.5rem",
      fontSize: "1.1rem",
      color: "#333",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Eigenvalues</h1>

        <label style={styles.label}>
          Enter a square matrix (rows by newline, values by space):
        </label>
        <textarea
          style={styles.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {error && <div style={styles.error}>{error}</div>}

        <button style={styles.button} onClick={handleSubmit}>
          Compute Eigenvalues
        </button>

        {eigenvalues && (
          <>
            <div style={styles.sectionTitle}>Eigenvalues:</div>
            <p>{eigenvalues.join(", ")}</p>
          </>
        )}
      </div>
    </div>
  );
}
