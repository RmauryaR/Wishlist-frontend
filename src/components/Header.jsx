import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <div className="app-header">
      <div className="app-meta">
        <p>
          <strong>Address:</strong> 123 Main Street, New Delhi
        </p>
        <p>
          <strong>Created by:</strong> Rahul Maurya
        </p>
      </div>
    </div>
  );
}
