


// // import React, { useEffect, useState } from "react";
// // import { Routes, Route, Navigate } from "react-router-dom";
// // import LoginPage from "./pages/LoginPage";
// // import RegisterPage from "./pages/RegisterPage";
// // import Plan from "./pages/Plan";
// // import Focus from "./pages/Focus";
// // import Journal from "./pages/Journal";
// // import Sidebar from "./components/Sidebar";
// // import { BASE_URL } from "./config";

// // const App: React.FC = () => {
// //   const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem("AUTH_TOKEN"));

// //   const carryPreviousDay = async (token: string) => {
// //     console.log("Starting carryPreviousDay with token:", token);
// //     const today = new Date();
// //     const yesterday = new Date(today);
// //     yesterday.setDate(today.getDate() - 1);
// //     const formattedYesterday = yesterday.toISOString().split("T")[0];
// //     console.log("Sending request for date:", formattedYesterday);

// //     try {
// //       const response = await fetch(`${BASE_URL}/carryPreviousDay`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         credentials: "include",
// //         body: JSON.stringify({ date: formattedYesterday }),
// //       });
// //       console.log("Got response with status:", response.status);
// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         console.error("carryPreviousDay failed with status:", response.status, "Details:", errorText);
// //         throw new Error(`carryPreviousDay HTTP error! Status: ${response.status}, Details: ${errorText}`);
// //       }
// //       console.log("carryPreviousDay succeeded!");
// //     } catch (error) {
// //       console.error("Error in carryPreviousDay:", error);
// //     }
// //   };

// //   useEffect(() => {
// //     console.log("App useEffect running, checking token...");
// //     const token = localStorage.getItem("AUTH_TOKEN");
// //     if (token) {
// //       carryPreviousDay(token);
// //       if (token !== authToken) {
// //         setAuthToken(token);
// //       }
// //     } else if (authToken) {
// //       setAuthToken(null);
// //     }
// //   }, [authToken]);

// //   useEffect(() => {
// //     const checkToken = () => {
// //       const newToken = localStorage.getItem("AUTH_TOKEN");
// //       if (newToken !== authToken) {
// //         setAuthToken(newToken);
// //       }
// //     };
// //     const interval = setInterval(checkToken, 500);
// //     return () => clearInterval(interval);
// //   }, [authToken]);

// //   return (
// //     <Routes>
// //       <Route path="/" element={<Navigate to="/login" />} />
// //       <Route path="/login" element={<LoginPage />} />
// //       <Route path="/register" element={<RegisterPage />} />
// //       <Route
// //         path="/plan"
// //         element={
// //           <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8f9fa" }}>
// //             <Sidebar />
// //             <Plan />
// //           </div>
// //         }
// //       />
// //       <Route
// //         path="/focus"
// //         element={
// //           <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8f9fa" }}>
// //             <Sidebar />
// //             <Focus />
// //           </div>
// //         }
// //       />
// //       <Route
// //         path="/journal"
// //         element={
// //           <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8f9fa" }}>
// //             <Sidebar />
// //             <Journal />
// //           </div>
// //         }
// //       />
// //     </Routes>
// //   );
// // };

// // export default App;










// import React, { useEffect, useState } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import Plan from "./pages/Plan";
// import Focus from "./pages/Focus";
// import Journal from "./pages/Journal";
// import Life from "./pages/Life"
// import Year from "./pages/Year";
// import Month from "./pages/Month";
// import Week from "./pages/Week";
// import { SidebarProvider, Sidebar, useSidebar } from "./components/Sidebar"; // Import from Sidebar
// import { BASE_URL } from "./config";

// const App: React.FC = () => {
//   const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem("AUTH_TOKEN"));

//   const carryPreviousDay = async (token: string) => {
//     console.log("Starting carryPreviousDay with token:", token);
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(today.getDate() - 1);
//     const formattedYesterday = yesterday.toISOString().split("T")[0];
//     console.log("Sending request for date:", formattedYesterday);

//     try {
//       const response = await fetch(`${BASE_URL}/carryPreviousDay`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({ date: formattedYesterday }),
//       });
//       console.log("Got response with status:", response.status);
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("carryPreviousDay failed with status:", response.status, "Details:", errorText);
//         throw new Error(`carryPreviousDay HTTP error! Status: ${response.status}, Details: ${errorText}`);
//       }
//       console.log("carryPreviousDay succeeded!");
//     } catch (error) {
//       console.error("Error in carryPreviousDay:", error);
//     }
//   };

//   useEffect(() => {
//     console.log("App useEffect running, checking token...");
//     const token = localStorage.getItem("AUTH_TOKEN");
//     if (token) {
//       carryPreviousDay(token);
//       if (token !== authToken) {
//         setAuthToken(token);
//       }
//     } else if (authToken) {
//       setAuthToken(null);
//     }
//   }, [authToken]);

//   useEffect(() => {
//     const checkToken = () => {
//       const newToken = localStorage.getItem("AUTH_TOKEN");
//       if (newToken !== authToken) {
//         setAuthToken(newToken);
//       }
//     };
//     const interval = setInterval(checkToken, 500);
//     return () => clearInterval(interval);
//   }, [authToken]);

//   return (
//     <SidebarProvider>
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route
//           path="/plan"
//           element={
//             <AuthenticatedLayout>
//               <Plan />
//             </AuthenticatedLayout>
//           }
//         />
//         <Route
//           path="/focus"
//           element={
//             <AuthenticatedLayout>
//               <Focus />
//             </AuthenticatedLayout>
//           }
//         />
//         <Route
//           path="/journal"
//           element={
//             <AuthenticatedLayout>
//               <Journal />
//             </AuthenticatedLayout>
//           }
//         />
//         <Route
//           path="/life"
//           element={
//             <AuthenticatedLayout>
//               <Life />
//             </AuthenticatedLayout>
//           }
//         />
//         <Route
//           path="/year"
//           element={
//             <AuthenticatedLayout>
//               <Year />
//             </AuthenticatedLayout>
//           }
//         />
//         <Route
//           path="/month"
//           element={
//             <AuthenticatedLayout>
//               <Month />
//             </AuthenticatedLayout>
//           }
//         /><Route
//         path="/week"
//         element={
//           <AuthenticatedLayout>
//             <Week />
//           </AuthenticatedLayout>
//         }
//       />

//       </Routes>
//     </SidebarProvider>
//   );
// };

// // Layout Component for Authenticated Routes
// const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isCollapsed } = useSidebar();

//   return (
//     <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8f9fa" }}>
//       <Sidebar />
//       <main
//         style={{
//           marginLeft: isCollapsed ? "60px" : "250px",
//           width: isCollapsed ? "calc(100% - 60px)" : "calc(100% - 250px)",
//           transition: "margin-left 0.3s ease-in-out, width 0.3s ease-in-out",
//           padding: "20px",
//           overflowY: "auto", // Scroll if content overflows
//         }}
//       >
//         {children}
//       </main>
//     </div>
//   );
// };

// export default App;
















// src/App.tsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Plan from "./pages/Plan";
import Focus from "./pages/Focus";
import Journal from "./pages/Journal";
import Life from "./pages/Life";
import Year from "./pages/Year";
import Month from "./pages/Month";
import Week from "./pages/Week";
import { SidebarProvider, Sidebar, useSidebar } from "./components/Sidebar";
import { BASE_URL } from "./config";
import "./App.css";

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
        console.error("carryPreviousDay failed with status:", response.status, "Details:", errorText);
        throw new Error(`carryPreviousDay HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }
      console.log("carryPreviousDay succeeded!");
    } catch (error) {
      console.error("Error in carryPreviousDay:", error);
    }
  };

  useEffect(() => {
    console.log("App useEffect running, checking token...");
    const token = localStorage.getItem("AUTH_TOKEN");
    if (token) {
      carryPreviousDay(token);
      if (token !== authToken) {
        setAuthToken(token);
      }
    } else if (authToken) {
      setAuthToken(null);
    }
  }, [authToken]);

  useEffect(() => {
    const checkToken = () => {
      const newToken = localStorage.getItem("AUTH_TOKEN");
      if (newToken !== authToken) {
        setAuthToken(newToken);
      }
    };
    const interval = setInterval(checkToken, 500);
    return () => clearInterval(interval);
  }, [authToken]);

  return (
    <SidebarProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/plan"
          element={
            <AuthenticatedLayout>
              <Plan />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/focus"
          element={
            <AuthenticatedLayout>
              <Focus />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/journal"
          element={
            <AuthenticatedLayout>
              <Journal />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/life"
          element={
            <AuthenticatedLayout>
              <Life />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/year"
          element={
            <AuthenticatedLayout>
              <Year />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/month"
          element={
            <AuthenticatedLayout>
              <Month />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/week"
          element={
            <AuthenticatedLayout>
              <Week />
            </AuthenticatedLayout>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </SidebarProvider>
  );
};

// Layout Component for Authenticated Routes
const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="layout-container">
      <Sidebar />
      <main
        style={{
          marginLeft: isCollapsed ? "60px" : "250px", // Match the sidebar's collapsed/expanded width
          width: isCollapsed ? "calc(100% - 60px)" : "calc(100% - 250px)",
          transition: "margin-left 0.3s ease-in-out, width 0.3s ease-in-out",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default App;