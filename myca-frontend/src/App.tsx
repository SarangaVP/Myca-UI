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























import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Plan from "./pages/Plan";
import Focus from "./pages/Focus";
import Sidebar from "./components/Sidebar";
import { BASE_URL } from "./config";

const App: React.FC = () => {
  const carryPreviousDay = async (token: string) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const formattedYesterday = yesterday.toISOString().split("T")[0];

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

      if (!response.ok) {
        throw new Error(`carryPreviousDay HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error in carryPreviousDay:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("AUTH_TOKEN");
    if (token) {
      carryPreviousDay(token);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

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


