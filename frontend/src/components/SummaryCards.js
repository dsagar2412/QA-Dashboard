import React from 'react';

const SummaryCards = ({ summary }) => {
  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
      <div style={{ background: '#e6ffed', padding: '1rem', borderRadius: '8px', flex: 1 }}>
        <strong>✅ Passed:</strong> {summary.Passed || 0}
      </div>
      <div style={{ background: '#ffe6e6', padding: '1rem', borderRadius: '8px', flex: 1 }}>
        <strong>❌ Failed:</strong> {summary.Failed || 0}
      </div>
      <div style={{ background: '#fef5e6', padding: '1rem', borderRadius: '8px', flex: 1 }}>
        <strong>⛔ Blocked:</strong> {summary.Blocked || 0}
      </div>
    </div>
  );
};

export default SummaryCards;