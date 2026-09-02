import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const Dashboard = () => {
  const navigate = useNavigate();

  // const handleLogout = () => {
  //   sessionStorage.removeItem("isAuthenticated");
  //   navigate("/");
  // };

  return (
    <div className="d-flex align-items-center justify-content-center h-100">
      <h1 className="m-0 fs-4">Welcome to Dashboard</h1>
    </div>
  );
};

export default Dashboard;
