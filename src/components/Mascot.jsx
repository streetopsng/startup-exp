import React from 'react';

export default function Mascot({ variant = 'm-purple', className = '' }) {
  return (
    <div className={`mascot ${variant} ${className}`}>
      <div className="eyes">
        <div className="eye" />
        <div className="eye" />
      </div>
      <div className="mouth" />
    </div>
  );
}
