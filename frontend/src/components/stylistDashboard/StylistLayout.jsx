import React from "react";
import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import StylistHeader from "./StylistHeader";
import StylistSidebar from "./StylistSidebar";

/** TODO: Replace with real AuthContext/Redux */
function useFakeAuth() {
  return { isAuthed: true, role: "STYLIST" };
}

const StylistLayout = ({ title, subtitle, children }) => {
  const { isAuthed, role } = useFakeAuth();
  const location = useLocation();

  if (!isAuthed) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role !== "STYLIST") return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <StylistSidebar />
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <StylistHeader title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto">
          <div className="w-full p-6">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

StylistLayout.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
};

export default StylistLayout;
