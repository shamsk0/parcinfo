import { createContext, useContext, useState } from "react";

// Mot de passe admin simple, pour une démo uniquement.
// À remplacer par un vrai backend d'authentification (JWT) plus tard.
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // On relit sessionStorage au démarrage pour garder l'état admin
  // si l'utilisateur recharge la page (mais pas après fermeture du navigateur).
  const [isAdmin, setIsAdmin] = useState(
    sessionStorage.getItem("parcinfo_isAdmin") === "true",
  );

  function loginAsAdmin(password) {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      sessionStorage.setItem("parcinfo_isAdmin", "true");
      return true;
    }
    return false;
  }

  function continueAsGuest() {
    setIsAdmin(false);
    sessionStorage.removeItem("parcinfo_isAdmin");
  }

  function logout() {
    setIsAdmin(false);
    sessionStorage.removeItem("parcinfo_isAdmin");
  }

  return (
    <AuthContext.Provider
      value={{ isAdmin, loginAsAdmin, continueAsGuest, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook à utiliser dans tes composants : const { isAdmin } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur de <AuthProvider>",
    );
  }
  return context;
}
