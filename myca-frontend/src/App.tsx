// src/App.tsx
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import Plan from "./pages/Plan";
// import Focus from "./pages/Focus";
// import Sidebar from "./components/Sidebar";

// const App: React.FC = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<Navigate to="/login" />} />
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/register" element={<RegisterPage />} />
//       <Route
//         path="/plan"
//         element={
//           <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8f9fa" }}>
//             <Sidebar />
//             <Plan />
//           </div>
//         }
//       />
//       <Route
//         path="/focus"
//         element={
//           <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8f9fa" }}>
//             <Sidebar />
//             <Focus/>
//           </div>
//         }
//       />
//     </Routes>
//   );
// };

// export default App;
















import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Plan from "./pages/Plan";
import Focus from "./pages/Focus";
import Sidebar from "./components/Sidebar";
import { BASE_URL } from "./config";

const App: React.FC = () => {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem("AUTH_TOKEN"));

  const carryPreviousDay = async (token: string) => {
    console.log("Starting carryPreviousDay with token:", token);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const formattedYesterday = yesterday.toISOString().split("T")[0];
    console.log("Sending request for date:", formattedYesterday);

    try {
      const response = await fetch(`${BASE_URL}/carryPreviousDay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ date: formattedYesterday }),
      });
      console.log("Got response with status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`carryPreviousDay HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }
      console.log("carryPreviousDay succeeded!");
    } catch (error) {
      console.error("Error in carryPreviousDay:", error);
    }
  };

  // Run on reload and token change
  useEffect(() => {
    console.log("App useEffect running, checking token...");
    const token = localStorage.getItem("AUTH_TOKEN");
    if (token) {
      // Run carryPreviousDay on every reload or token update, even if token "matches"
      carryPreviousDay(token);
      if (token !== authToken) {
        setAuthToken(token); // Update state if token changed (e.g., new expiration)
      }
    } else if (authToken) {
      setAuthToken(null); // Clear state if token is gone (logout)
    }
  }, [authToken]);

  // Watch localStorage for login/token changes
  useEffect(() => {
    const checkToken = () => {
      const newToken = localStorage.getItem("AUTH_TOKEN");
      if (newToken !== authToken) {
        setAuthToken(newToken); // Trigger first useEffect on token change
      }
    };
    const interval = setInterval(checkToken, 500);
    return () => clearInterval(interval);
  }, [authToken]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/plan"
        element={
          <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8f9fa" }}>
            <Sidebar />
            <Plan />
          </div>
        }
      />
      <Route
        path="/focus"
        element={
          <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8f9fa" }}>
            <Sidebar />
            <Focus />
          </div>
        }
      />
    </Routes>
  );
};

export default App;

// // src/App.tsx
// import React from "react";
// import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import Plan from "./pages/Plan";
// import Sidebar from "./components/Sidebar";
// import { getAuthToken } from "./utils/auth";
// import { useEffect } from "react";

// // ProtectedRoute component to guard authenticated routes
// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const navigate = useNavigate();
//   const token = getAuthToken();

//   useEffect(() => {
//     if (!token) {
//       console.error("No token found. Redirecting to login.");
//       navigate("/login");
//     }
//   }, [token, navigate]);

//   return token ? <>{children}</> : null;
// };

// const App: React.FC = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<Navigate to="/login" />} />
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/register" element={<RegisterPage />} />
//       <Route
//         path="/plan"
//         element={
//           <ProtectedRoute>
//             <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8f9fa" }}>
//               <Sidebar />
//               <Plan />
//             </div>
//           </ProtectedRoute>
//         }
//       />
//     </Routes>
//   );
// };

// export default App;


