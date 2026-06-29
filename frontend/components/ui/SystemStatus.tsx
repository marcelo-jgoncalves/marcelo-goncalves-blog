/* frontend/components/ui/SystemStatus.tsx */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeBranch, faServer, faGlobe, faBolt } from '@fortawesome/free-solid-svg-icons';
import './SystemStatus.css';

export default function SystemStatus() {
  return (
    <aside className="system-status-box" aria-labelledby="system-status-heading">
      <div className="system-status-header">
        <h4 id="system-status-heading" className="system-status-title">System Status</h4>
        <div className="system-status-dot-container" aria-hidden="true">
          <span className="system-status-dot"></span>
        </div>
        <span className="sr-only">System is Online</span>
      </div>

      <dl className="system-status-list">
        <div className="system-status-row">
          <dt className="system-status-group">
            <FontAwesomeIcon icon={faCodeBranch} className="system-status-icon-version" aria-hidden="true" />
            <span>Version</span>
          </dt>
          <dd className="system-status-value-bold">v1.2.0</dd>
        </div>

        <div className="system-status-row">
          <dt className="system-status-group">
            <FontAwesomeIcon icon={faServer} className="system-status-icon-env" aria-hidden="true" />
            <span>Env</span>
          </dt>
          <dd>
            <span className="system-status-env-tag">Production</span>
          </dd>
        </div>

        <div className="system-status-row">
          <dt className="system-status-group">
            <FontAwesomeIcon icon={faGlobe} className="system-status-icon-region" aria-hidden="true" />
            <span>Region</span>
          </dt>
          <dd className="system-status-value-normal">us-east-1</dd>
        </div>

        <div className="system-status-row">
          <dt className="system-status-group">
            <FontAwesomeIcon icon={faBolt} className="system-status-icon-uptime" aria-hidden="true" />
            <span>Uptime</span>
          </dt>
          <dd className="system-status-value-bold">99.99%</dd>
        </div>
      </dl>
    </aside>
  );
}