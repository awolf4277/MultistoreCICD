// src/components/TopDashboard.tsx
import React from "react";

interface TopDashboardProps {
  modeLabel: string;
  cartCount: number;
}

const TopDashboard: React.FC<TopDashboardProps> = ({ modeLabel, cartCount }) => {
  return (
    <header className="top-dashboard">
      <div className="top-dashboard-left">
        <div className="top-dashboard-status-row">
          <span className="top-dashboard-status-light" />
          <span className="top-dashboard-status-text">
            SYSTEM STATUS: <strong>GREEN</strong> · All services operational
          </span>
        </div>
        <div className="top-dashboard-subtext">
          FRONT-END: <strong>FULLY OPERATIONAL</strong> · Local build · Your code
        </div>
      </div>

      <div className="top-dashboard-right">
        <span className="top-dashboard-meta">
          MODE: <strong>{modeLabel}</strong>
        </span>
        <span className="top-dashboard-meta">
          Cart · <strong>{cartCount}</strong>
        </span>
      </div>
    </header>
  );
};

export default TopDashboard;
