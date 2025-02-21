// import React, { CSSProperties } from "react";

// const Sidebar: React.FC = () => {
//   return (
//     <div style={sidebarStyle}>
//       <h1 style={titleStyle}>Myca</h1>
//       <ul style={{ listStyle: "none", padding: "0" }}>
//         <li style={sectionTitleStyle}>Perform</li>
//         <li style={menuItemStyle(true)}>Plan</li>
//         <li style={menuItemStyle(false)}>Focus</li>
//         <li style={menuItemStyle(false)}>Journal</li>

//         <li style={sectionTitleStyle}>Envision</li>
//         <li style={menuItemStyle(false)}>Week 🔒</li>
//         <li style={menuItemStyle(false)}>Month 🔒</li>
//         <li style={menuItemStyle(false)}>Year 🔒</li>
//         <li style={menuItemStyle(false)}>Life 🔒</li>

//         <li style={sectionTitleStyle}>Improve</li>
//         <li style={menuItemStyle(false)}>Insights 🔒</li>
//         <li style={menuItemStyle(false)}>Rituals 🔒</li>
//         <li style={menuItemStyle(false)}>Wall 🔒</li>
//       </ul>
//     </div>
//   );
// };

// // Styling Constants
// const sidebarStyle: CSSProperties = {
//   width: "250px",
//   backgroundColor: "#f8f9fa",
//   color: "#333",
//   padding: "20px",
//   display: "flex",
//   flexDirection: "column",
//   height: "100vh",
//   boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
//   fontFamily: "Poppins, sans-serif"
// };

// const titleStyle: CSSProperties = {
//   fontSize: "22px",
//   fontWeight: "bold",
//   marginBottom: "20px"
// };

// const sectionTitleStyle: CSSProperties = {
//   fontWeight: "bold",
//   fontSize: "14px",
//   marginTop: "15px",
//   marginBottom: "10px"
// };

// const menuItemStyle = (isActive: boolean): CSSProperties => ({
//   padding: "12px",
//   backgroundColor: isActive ? "#6C63FF" : "#e0e0e0",
//   color: isActive ? "white" : "#333",
//   borderRadius: "12px",
//   textAlign: "center" as CSSProperties["textAlign"], 
//   cursor: "pointer",
//   fontSize: "16px",
//   fontWeight: "500",
//   transition: "background 0.3s, transform 0.2s",
//   marginBottom: "8px",
//   fontFamily: "Poppins, sans-serif",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   boxShadow: isActive ? "0px 4px 6px rgba(0, 0, 0, 0.1)" : "none",
//   transform: isActive ? "scale(1.05)" : "scale(1)"
// });

// export default Sidebar;



import React, { CSSProperties } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Sidebar: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation

  // 🔹 Logout Function
  const handleLogout = () => {
    localStorage.removeItem("AUTH_TOKEN"); // Clear auth token
    navigate("/login"); // Redirect to login page
  };

  return (
    <div style={sidebarStyle}>
      <h1 style={titleStyle}>Myca</h1>
      <ul style={{ listStyle: "none", padding: "0", flexGrow: 1 }}>
        <li style={sectionTitleStyle}>Perform</li>
        <li style={menuItemStyle(true)}>Plan</li>
        <li style={menuItemStyle(false)}>Focus</li>
        <li style={menuItemStyle(false)}>Journal</li>

        <li style={sectionTitleStyle}>Envision</li>
        <li style={menuItemStyle(false)}>Week 🔒</li>
        <li style={menuItemStyle(false)}>Month 🔒</li>
        <li style={menuItemStyle(false)}>Year 🔒</li>
        <li style={menuItemStyle(false)}>Life 🔒</li>

        <li style={sectionTitleStyle}>Improve</li>
        <li style={menuItemStyle(false)}>Insights 🔒</li>
        <li style={menuItemStyle(false)}>Rituals 🔒</li>
        <li style={menuItemStyle(false)}>Wall 🔒</li>
      </ul>

      {/* 🔹 Logout Button at the Bottom */}
      <button onClick={handleLogout} style={logoutButtonStyle}>
        Logout
      </button>
    </div>
  );
};

// 🔹 Styling Constants
const sidebarStyle: CSSProperties = {
  width: "250px",
  backgroundColor: "#f8f9fa",
  color: "#333",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
  fontFamily: "Poppins, sans-serif",
  justifyContent: "space-between", // Ensures Logout stays at the bottom
};

const titleStyle: CSSProperties = {
  fontSize: "22px",
  fontWeight: "bold",
  marginBottom: "20px",
};

const sectionTitleStyle: CSSProperties = {
  fontWeight: "bold",
  fontSize: "14px",
  marginTop: "15px",
  marginBottom: "10px",
};

const menuItemStyle = (isActive: boolean): CSSProperties => ({
  padding: "12px",
  backgroundColor: isActive ? "#6C63FF" : "#e0e0e0",
  color: isActive ? "white" : "#333",
  borderRadius: "12px",
  textAlign: "center" as CSSProperties["textAlign"],
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "500",
  transition: "background 0.3s, transform 0.2s",
  marginBottom: "8px",
  fontFamily: "Poppins, sans-serif",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: isActive ? "0px 4px 6px rgba(0, 0, 0, 0.1)" : "none",
  transform: isActive ? "scale(1.05)" : "scale(1)",
});

// 🔹 Logout Button Style
const logoutButtonStyle: CSSProperties = {
  backgroundColor: "#dc3545",
  color: "white",
  padding: "12px",
  borderRadius: "12px",
  border: "none",
  fontSize: "16px",
  fontWeight: "500",
  cursor: "pointer",
  marginTop: "auto",
  textAlign: "center",
  transition: "background 0.3s, transform 0.2s",
  fontFamily: "Poppins, sans-serif",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
};

export default Sidebar;
