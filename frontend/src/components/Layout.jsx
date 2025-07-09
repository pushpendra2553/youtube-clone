// frontend/src/components/Layout.jsx
// ----------------------------------------------------------
// Main layout wrapper for the application
// Features:
// - Includes Sidebar component
// - Adjusts main content area based on sidebar toggle state
// Redux slice used: uiSlice (to manage sidebar state)
// Props:
// - children: React elements to be rendered inside the layout
// ----------------------------------------------------------

import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  // ----------------------------------------------------------
  // Access sidebar open/close state from Redux
  // ----------------------------------------------------------
  const { isSidebarOpen } = useSelector((state) => state.ui);

  // ----------------------------------------------------------
  // Layout UI
  // ----------------------------------------------------------
  return (
    <div>
      <div className="flex">
        {/* Sidebar always rendered, visibility controlled via CSS */}
        <Sidebar />

        {/* Main content area with dynamic margin */}
        <main
          className={`
            flex-1 min-h-screen p-4 mt-16 transition-all duration-300
            ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}
          `}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
