// import React, { CSSProperties, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Sidebar: React.FC = () => {
//   const navigate = useNavigate();
//   const [activeItem, setActiveItem] = useState<string>("Plan"); 

//   const handleLogout = () => {
//     localStorage.removeItem("AUTH_TOKEN");
//     navigate("/login");
//   };

//   const navigateTo = (item: string, path: string) => {
//     setActiveItem(item); 
//     navigate(path);      
//   };

//   return (
//     <div style={sidebarStyle}>
//       <h1 style={titleStyle}>Myca</h1>
//       <ul style={{ listStyle: "none", padding: "0", flexGrow: 1 }}>
//         <li style={sectionTitleStyle}>Perform</li>
//         <li
//           style={menuItemStyle(activeItem === "Plan")}
//           onClick={() => navigateTo("Plan", "/plan")}
//         >
//           Plan
//         </li>
//         <li
//           style={menuItemStyle(activeItem === "Focus")}
//           onClick={() => navigateTo("Focus", "/focus")}
//         >
//           Focus
//         </li>
//         <li
//           style={menuItemStyle(activeItem === "Journal")}
//           onClick={() => navigateTo("Journal", "/journal")}
//         >
//           Journal
//         </li>

//         <li style={sectionTitleStyle}>Envision</li>
//         <li style={menuItemStyle(activeItem === "Week")}>Week 🔒</li>
//         <li style={menuItemStyle(activeItem === "Month")}>Month 🔒</li>
//         <li style={menuItemStyle(activeItem === "Year")}>Year 🔒</li>
//         <li style={menuItemStyle(activeItem === "Life")}>Life 🔒</li>

//         <li style={sectionTitleStyle}>Improve</li>
//         <li style={menuItemStyle(activeItem === "Insights")}>Insights 🔒</li>
//         <li style={menuItemStyle(activeItem === "Rituals")}>Rituals 🔒</li>
//         <li style={menuItemStyle(activeItem === "Wall")}>Wall 🔒</li>
//       </ul>

//       <button onClick={handleLogout} style={logoutButtonStyle}>
//         Logout
//       </button>
//     </div>
//   );
// };

// const sidebarStyle: CSSProperties = {
//   width: "250px",
//   backgroundColor: "#f8f9fa",
//   color: "#333",
//   padding: "20px",
//   display: "flex",
//   flexDirection: "column",
//   height: "100vh",
//   boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
//   fontFamily: "Poppins, sans-serif",
//   justifyContent: "space-between",
// };

// const titleStyle: CSSProperties = {
//   fontSize: "22px",
//   fontWeight: "bold",
//   marginBottom: "20px",
// };

// const sectionTitleStyle: CSSProperties = {
//   fontWeight: "bold",
//   fontSize: "14px",
//   marginTop: "15px",
//   marginBottom: "10px",
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
//   transform: isActive ? "scale(1.05)" : "scale(1)",
// });

// const logoutButtonStyle: CSSProperties = {
//   backgroundColor: "#dc3545",
//   color: "white",
//   padding: "12px",
//   borderRadius: "12px",
//   border: "none",
//   fontSize: "16px",
//   fontWeight: "500",
//   cursor: "pointer",
//   marginTop: "auto",
//   textAlign: "center",
//   transition: "background 0.3s, transform 0.2s",
//   fontFamily: "Poppins, sans-serif",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
// };

// export default Sidebar;










import React, { CSSProperties, useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaCalendar, FaBullseye, FaBook, FaLock } from "react-icons/fa";
import "./Sidebar.css";

// Create Context for Sidebar State
interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Hook to use Sidebar Context
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// Sidebar Provider Component
export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Sidebar Component
export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<string>("Plan");
  const { isCollapsed, toggleSidebar } = useSidebar();

  const handleLogout = () => {
    localStorage.removeItem("AUTH_TOKEN");
    navigate("/login");
  };

  const navigateTo = (item: string, path: string) => {
    setActiveItem(item);
    navigate(path);
  };

  return (
    <div style={sidebarStyle(isCollapsed)} className="sidebar">
      {/* Toggle Button */}
      <button onClick={toggleSidebar} style={toggleButtonStyle}>
        {isCollapsed ? <FaBars /> : <FaTimes />}
      </button>

      {/* Sidebar Content */}
      {!isCollapsed && (
        <>
          <h1 style={titleStyle}>Myca</h1>
          <ul style={{ listStyle: "none", padding: "0", flexGrow: 1 }}>
            <li style={sectionTitleStyle}>Perform</li>
            <li
              style={menuItemStyle(activeItem === "Plan")}
              onClick={() => navigateTo("Plan", "/plan")}
              className="sidebar-menu-item"
            >
              <FaCalendar style={iconStyle} /> Plan
            </li>
            <li
              style={menuItemStyle(activeItem === "Focus")}
              onClick={() => navigateTo("Focus", "/focus")}
              className="sidebar-menu-item"
            >
              <FaBullseye style={iconStyle} /> Focus
            </li>
            <li
              style={menuItemStyle(activeItem === "Journal")}
              onClick={() => navigateTo("Journal", "/journal")}
              className="sidebar-menu-item"
            >
              <FaBook style={iconStyle} /> Journal
            </li>

            <li style={sectionTitleStyle}>Envision</li>
            <li style={menuItemStyle(activeItem === "Week")} className="sidebar-menu-item">
              <FaCalendar style={iconStyle} /> Week <FaLock style={lockIconStyle} />
            </li>
            <li style={menuItemStyle(activeItem === "Month")} className="sidebar-menu-item">
              <FaCalendar style={iconStyle} /> Month <FaLock style={lockIconStyle} />
            </li>
            <li style={menuItemStyle(activeItem === "Year")} className="sidebar-menu-item">
              <FaCalendar style={iconStyle} /> Year <FaLock style={lockIconStyle} />
            </li>
            <li style={menuItemStyle(activeItem === "Life")} className="sidebar-menu-item">
              <FaCalendar style={iconStyle} /> Life <FaLock style={lockIconStyle} />
            </li>

            <li style={sectionTitleStyle}>Improve</li>
            <li style={menuItemStyle(activeItem === "Insights")} className="sidebar-menu-item">
              <FaBullseye style={iconStyle} /> Insights <FaLock style={lockIconStyle} />
            </li>
            <li style={menuItemStyle(activeItem === "Rituals")} className="sidebar-menu-item">
              <FaBook style={iconStyle} /> Rituals <FaLock style={lockIconStyle} />
            </li>
            <li style={menuItemStyle(activeItem === "Wall")} className="sidebar-menu-item">
              <FaBook style={iconStyle} /> Wall <FaLock style={lockIconStyle} />
            </li>
          </ul>

          <button onClick={handleLogout} style={logoutButtonStyle}>
            Logout
          </button>
        </>
      )}
    </div>
  );
};

// Styles
const sidebarStyle = (isCollapsed: boolean): CSSProperties => ({
  width: isCollapsed ? "60px" : "250px",
  backgroundColor: "#e9ecef", // Light gray background
  color: "#333",
  padding: isCollapsed ? "10px" : "20px",
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
  fontFamily: "Poppins, sans-serif",
  transition: "width 0.3s ease-in-out",
  position: "fixed",
  zIndex: 1000,
  overflowX: "hidden",
});

const toggleButtonStyle: CSSProperties = {
  backgroundColor: "transparent",
  color: "#333",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
  padding: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  top: "10px",
  right: "10px",
};

const titleStyle: CSSProperties = {
  fontSize: "24px",
  fontWeight: "700",
  marginBottom: "30px",
  textAlign: "center",
  color: "#333",
  letterSpacing: "1px",
};

const sectionTitleStyle: CSSProperties = {
  fontWeight: "600",
  fontSize: "14px",
  marginTop: "20px",
  marginBottom: "10px",
  color: "#666",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const menuItemStyle = (isActive: boolean): CSSProperties => ({
  padding: "12px 15px",
  backgroundColor: isActive ? "#007bff" : "transparent",
  color: isActive ? "#fff" : "#333",
  borderRadius: "12px",
  textAlign: "left" as const,
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "500",
  transition: "background 0.3s, transform 0.2s, padding-left 0.2s",
  marginBottom: "8px",
  fontFamily: "Poppins, sans-serif",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  boxShadow: isActive ? "0px 4px 8px rgba(0, 0, 0, 0.1)" : "none",
  transform: isActive ? "translateX(5px)" : "translateX(0)",
});

const iconStyle: CSSProperties = {
  marginRight: "10px",
};

const lockIconStyle: CSSProperties = {
  marginLeft: "auto",
  fontSize: "12px",
  opacity: 0.7,
};

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
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
};
