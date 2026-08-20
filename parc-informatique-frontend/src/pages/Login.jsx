import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login({ onEnter }) {
  const { loginAsAdmin, continueAsGuest } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showAdminForm, setShowAdminForm] = useState(false);

  function handleGuestClick() {
    continueAsGuest();
    onEnter();
  }

  function handleAdminSubmit(e) {
    e.preventDefault();
    const success = loginAsAdmin(password);
    if (success) {
      onEnter();
    } else {
      setError("Mot de passe incorrect");
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>ParcInfo</h1>
        <p style={styles.subtitle}>Gestion de parc informatique</p>

        {!showAdminForm ? (
          <div style={styles.buttonGroup}>
            <button style={styles.guestButton} onClick={handleGuestClick}>
              Continuer en invité
            </button>
            <button
              style={styles.adminLinkButton}
              onClick={() => setShowAdminForm(true)}
            >
              Connexion admin
            </button>
          </div>
        ) : (
          <form onSubmit={handleAdminSubmit} style={styles.form}>
            <input
              type="password"
              placeholder="Mot de passe admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              autoFocus
            />
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" style={styles.submitButton}>
              Se connecter
            </button>
            <button
              type="button"
              style={styles.backButton}
              onClick={() => {
                setShowAdminForm(false);
                setError("");
              }}
            >
              Retour
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    padding: "2.5rem",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    width: "320px",
    textAlign: "center",
  },
  title: {
    margin: 0,
    fontSize: "1.75rem",
  },
  subtitle: {
    color: "#666",
    marginTop: "0.25rem",
    marginBottom: "2rem",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  guestButton: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer",
  },
  adminLinkButton: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "transparent",
    color: "#333",
    fontSize: "0.9rem",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "1rem",
  },
  error: {
    color: "#dc2626",
    fontSize: "0.85rem",
    margin: 0,
  },
  submitButton: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer",
  },
  backButton: {
    padding: "0.5rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "transparent",
    color: "#666",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
};
