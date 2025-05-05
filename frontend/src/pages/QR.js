import React, { useState } from "react";

export default function QRFactorization() {
  const [input, setInput] = useState("");
  const [Q, setQ] = useState(null);
  const [R, setR] = useState(null);
  const [error, setError] = useState("");

  const parseMatrix = (str) => {
    try {
      return str
        .trim()
        .split("\n")
        .map((row) =>
          row
            .trim()
            .split(/\s+/)
            .map((num) => parseFloat(num))
        );
    } catch {
      return null;
    }
  };

  const transpose = (m) => m[0].map((_, i) => m.map((row) => row[i]));

  const dot = (v1, v2) => v1.reduce((sum, val, i) => sum + val * v2[i], 0);

  const scalarMultiply = (v, s) => v.map((x) => x * s);

  const subtract = (v1, v2) => v1.map((x, i) => x - v2[i]);

  const norm = (v) => Math.sqrt(dot(v, v));

  const gramSchmidt = (A) => {
    const n = A.length;
    const m = A[0].length;
    const Q = [];
    const R = Array.from({ length: m }, () => Array(m).fill(0));

    for (let j = 0; j < m; j++) {
      let v = A.map((row) => row[j]);
      for (let i = 0; i < j; i++) {
        const qi = Q.map((row) => row[i]);
        const rij = dot(qi, v);
        R[i][j] = rij;
        v = subtract(v, scalarMultiply(qi, rij));
      }
      const rjj = norm(v);
      R[j][j] = rjj;
      const qj = scalarMultiply(v, 1 / rjj);
      if (Q.length === 0) {
        for (let i = 0; i < n; i++) Q.push([qj[i]]);
      } else {
        for (let i = 0; i < n; i++) Q[i].push(qj[i]);
      }
    }

    return { Q: Q.map((row) => row.map((x) => Math.round(x))), R: R.map((row) => row.map((x) => Math.round(x))) };
  };

  const handleSubmit = () => {
    const matrix = parseMatrix(input);
    if (
      !matrix ||
      matrix.some((row) => row.length !== matrix[0].length) ||
      matrix.length < matrix[0].length
    ) {
      setError(
        "Invalid matrix input. Make sure all rows have the same number of elements and there are at least as many rows as columns."
      );
      setQ(null);
      setR(null);
      return;
    }

    const { Q, R } = gramSchmidt(matrix);
    setError("");
    setQ(Q);
    setR(R);
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
    table: {
      width: "100%",
      marginTop: "1.5rem",
      borderCollapse: "collapse",
    },
    cell: {
      border: "1px solid #ccc",
      padding: "0.5rem",
      textAlign: "right",
      fontFamily: "monospace",
    },
    sectionTitle: {
      fontWeight: "bold",
      marginTop: "1.5rem",
      marginBottom: "0.5rem",
      fontSize: "1.1rem",
      color: "#333",
    },
  };

  const renderMatrix = (matrix) => (
    <table style={styles.table}>
      <tbody>
        {matrix.map((row, i) => (
          <tr key={i}>
            {row.map((val, j) => (
              <td key={j} style={styles.cell}>
                {val}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>QR Factorization</h1>
        <label style={styles.label}>
          Enter your matrix (one row per line, numbers separated by spaces):
        </label>
        <textarea
          style={styles.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {error && <div style={styles.error}>{error}</div>}
        <button style={styles.button} onClick={handleSubmit}>
          Compute QR
        </button>

        {Q && R && (
          <>
            <div style={styles.sectionTitle}>Q Matrix:</div>
            {renderMatrix(Q)}
            <div style={styles.sectionTitle}>R Matrix:</div>
            {renderMatrix(R)}
          </>
        )}
      </div>
    </div>
  );
}
