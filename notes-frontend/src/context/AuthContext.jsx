
import { useState } from "react";
import { AuthContext } from "./AuthContext.js";

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  );

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };