import React from "react";
import { Link, NavLink } from "react-router-dom";

export function Home() {
return (
    <div className="home-container">
        <div className="home-header">
            <h1>פלטפורמת הודעות</h1>
            <p>אפליקציה לניהול לוח מודעות לכלל המגמות, המבחנים, והודעות כלליות</p>
            <NavLink
                className="login-link"
                to="/login"
                style={({ isActive }) => ({
                    fontWeight: isActive ? "bold" : "normal",
                })}
            >
                כניסה למערכת
            </NavLink>
        </div>
        <div className="home-screens">
            <Link to="/screen1" className="screen-link">
                <div className="screen-preview-wrapper">
                    <iframe
                        src="/screen1"
                        title="Screen 1"
                        className="screen-preview"
                        style={{ pointerEvents: "none" }}
                    ></iframe>
                </div>
            </Link>
            <Link to="/screen2" className="screen-link">
                <div className="screen-preview-wrapper">
                    <iframe
                        src="/screen2"
                        title="Screen 2"
                        className="screen-preview"
                        style={{ pointerEvents: "none" }}
                    ></iframe>
                </div>
            </Link>
            <Link to="/screen3" className="screen-link">
                <div className="screen-preview-wrapper">
                    <iframe
                        src="/screen3"
                        title="Screen 3"
                        className="screen-preview"
                        style={{ pointerEvents: "none" }}
                    ></iframe>
                </div>
            </Link>
        </div>
    </div>
);
}
