import React, { useState } from "react";

export default function RREF() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(null);
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

  const isIntegerMatrix = (matrix) => {
    return matrix.every((row) => row.every((val) => Number.isInteger(val)));
  };

  const roundToNearestIntegerMatrix = (matrix) =>
    matrix.map((row) => row.map((val) => Math.round(val)));

  const computeRREF = (matrix) => {
    const m = matrix.map((row) => [...row]);
    const rowCount = m.length;
    const colCount = m[0].length;

    let lead = 0;
    for (let r = 0; r < rowCount; r++) {
      if (lead >= colCount) return m;
      let i = r;
      while (m[i][lead] === 0) {
        i++;
        if (i === rowCount) {
          i = r;
          lead++;
          if (lead === colCount) return m;
        }
      }

      [m[i], m[r]] = [m[r], m[i]];

      const lv = m[r][lead];
      for (let j = 0; j < colCount; j++) m[r][j] /= lv;

      for (let i = 0; i < rowCount; i++) {
        if (i !== r) {
          const lv = m[i][lead];
          for (let j = 0; j < colCount; j++) {
            m[i][j] -= lv * m[r][j];
          }
        }
      }
      lead++;
    }

    return roundToNearestIntegerMatrix(m);
  };

  const handleSubmit = () => {
    const matrix = parseMatrix(input);
    if (!matrix || matrix.some((row) => row.length !== matrix[0].length)) {
      setError("Invalid matrix input. Ensure all rows have the same number of numbers.");
      setOutput(null);
      return;
    }

    const rref = computeRREF(matrix);
    setError("");
    setOutput(rref);
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
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>RREF Calculator</h1>
        <label style={styles.label}>
          Enter your matrix (one row per line, numbers separated by spaces):
        </label>
        <textarea
          style={styles.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="1 2 3\n4 5 6\n7 8 9"
        />
        {error && <div style={styles.error}>{error}</div>}
        <button style={styles.button} onClick={handleSubmit}>
          Compute RREF
        </button>

        {output && (
          <table style={styles.table}>
            <tbody>
              {output.map((row, i) => (
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
        )}
      </div>
    </div>
  );
}
