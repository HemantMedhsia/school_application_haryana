import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <div className="error-emoji text-gray-900 ">(⊙_⊙;)</div>
      <h1 className="error-title">404 - Page Not Found</h1>
      <p className="error-message">
        Oops! It seems you've found a page that doesn't exist.
        <br />
        Don't worry, it's probably just lost in the internet abyss.
      </p>
      <button onClick={() => navigate("/")} className="error-button">
        Take Me Home
      </button>
    </div>
  );
};

export default ErrorPage;
