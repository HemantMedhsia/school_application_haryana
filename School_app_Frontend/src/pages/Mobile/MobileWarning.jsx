// MobileWarning.js
import React from "react";

const MobileWarning = () => (
  <div style={styles.overlay}>
    <div style={styles.messageBox}>
      <h2>Please Use Desktop Mode</h2>
      <p>This application is best viewed on a desktop device. Please switch to a larger screen for the best experience.</p>
    </div>
  </div>
);

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  messageBox: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    maxWidth: "400px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
};

export default MobileWarning;
