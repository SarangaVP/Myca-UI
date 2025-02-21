// src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Plan from "./pages/Plan";
import Sidebar from "./components/Sidebar";

const App: React.FC = () => {
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


