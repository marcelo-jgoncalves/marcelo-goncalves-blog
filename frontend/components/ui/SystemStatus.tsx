/* frontend/components/ui/SystemStatus.tsx */

import './SystemStatus.css';

export default function SystemStatus() {
  return (
    <div className="op-widget">
      <div className="op-widget-header">
        <h4>System Status</h4>
        <span className="op-status-dot" aria-label="Status Online"></span>
      </div>
      <div className="op-status-list">
        <div>
          <span><i className="fas fa-code-branch" style={{ color: "var(--blue-600)" }}></i> Version</span>
          <strong>v1.2.0</strong>
        </div>
        <div>
          <span><i className="fas fa-server" style={{ color: "var(--aws-orange)" }}></i> Env</span>
          <span className="op-env-tag">Production</span>
        </div>
        <div>
          <span><i className="fas fa-globe" style={{ color: "var(--gray-text)" }}></i> Region</span>
          <span>us-east-1</span>
        </div>
        <div>
          <span><i className="fas fa-bolt" style={{ color: "#ecc94b" }}></i> Uptime</span>
          <strong>99.99%</strong>
        </div>
      </div>
    </div>
  );
}