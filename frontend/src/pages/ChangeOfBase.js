import React, { useState } from "react";
import * as numeric from "numeric";

export default function ChangeOfBase() {
  const [basisA, setBasisA] = useState("");
  const [basisB, setBasisB] = useState("");
  const [P, setP] = useState(null);   // A→B
  const [Q, setQ] = useState(null);   // B→A
  const [error, setError] = useState("");

  /* ---------- helpers ---------- */
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

  const isSquare = (M) => Array.isArray(M) && M.length && M.length === M[0].length;
  const isInvertible = (M) => Math.abs(numeric.det(M)) > 1e-10;

  const renderMatrix = (M) => (
    <table style={styles.table}>
      <tbody>
        {M.map((row, i) => (
          <tr key={i}>
            {row.map((v, j) => (
              <td key={j} style={styles.cell}>
                {Number(v.toFixed(6))}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  /* ---------- main handler ---------- */
  const handleCompute = () => {
    const A = parseMatrix(basisA);
    const B = parseMatrix(basisB);

    if (!A || !B || !isSquare(A) || !isSquare(B) || A.length !== B.length) {
      setError("Both inputs must be the same‑size square matrices.");
      setP(null);
      setQ(null);
      return;
    }
    if (!isInvertible(A) || !isInvertible(B)) {
      setError("One of the bases is not invertible (determinant ≈ 0).");
      setP(null);
      setQ(null);
      return;
    }

    try {
      const Binv = numeric.inv(B);
      const Ainverse = numeric.inv(A);
      const Pmat = numeric.dot(Binv, A); // A→B
      const Qmat = numeric.dot(Ainverse, B); // B→A

      setError("");
      setP(Pmat);
      setQ(Qmat);
    } catch (e) {
      console.error(e);
      setError("Numeric computation failed.");
      setP(null);
      setQ(null);
    }
  };

  /* ---------- styles ---------- */
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
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      maxWidth: "800px",
      width: "100%",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "1rem",
    },
    label: { marginTop: "1rem", marginBottom: "0.5rem", color: "#555" },
    textarea: {
      width: "100%",
      height: "120px",
      padding: "0.75rem",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontFamily: "monospace",
      fontSize: "0.9rem",
      resize: "none",
    },
    button: {
      marginTop: "1.5rem",
      padding: "10px 20px",
      fontSize: "1rem",
      color: "#fff",
      backgroundColor: "#007BFF",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    error: { color: "red", marginTop: "0.5rem" },
    sectionTitle: {
      fontWeight: "bold",
      marginTop: "1.5rem",
      marginBottom: "0.5rem",
      fontSize: "1.1rem",
      color: "#333",
    },
    table: {
      width: "100%",
      marginTop: "0.5rem",
      borderCollapse: "collapse",
    },
    cell: {
      border: "1px solid #ccc",
      padding: "0.4rem",
      textAlign: "right",
      fontFamily: "monospace",
    },
  };

  /* ---------- UI ---------- */
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Change‑of‑Basis Matrix Calculator</h1>

        <label style={styles.label}>
          Basis A (each column is a basis vector):
        </label>
        <textarea
          style={styles.textarea}
          value={basisA}
          onChange={(e) => setBasisA(e.target.value)}
        />

        <label style={styles.label}>
          Basis B (each column is a basis vector):
        </label>
        <textarea
          style={styles.textarea}
          value={basisB}
          onChange={(e) => setBasisB(e.target.value)}
        />

        {error && <div style={styles.error}>{error}</div>}

        <button style={styles.button} onClick={handleCompute}>
          Compute Change‑of‑Basis
        </button>

        {P && (
          <>
            <div style={styles.sectionTitle}>
              P = B<sup>‑1</sup>A (maps&nbsp;A&nbsp;→&nbsp;B)
            </div>
            {renderMatrix(P)}
          </>
        )}

        {Q && (
          <>
            <div style={styles.sectionTitle}>
              Q = A<sup>‑1</sup>B (maps&nbsp;B&nbsp;→&nbsp;A)
            </div>
            {renderMatrix(Q)}
          </>
        )}
      </div>
    </div>
  );
}
