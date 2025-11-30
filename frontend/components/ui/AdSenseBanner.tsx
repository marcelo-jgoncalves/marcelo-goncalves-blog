import React from 'react';

export default function AdSenseBanner() {
  return (
    // Removidas as bordas (borderTop/borderBottom). Mantido apenas o padding para respiro.
    <section style={{ padding: '40px 0' }}>
      <div className="container">
        <div className="adsense-placeholder">
          [ADSENSE LEADERBOARD]
        </div>
      </div>
    </section>
  );
}