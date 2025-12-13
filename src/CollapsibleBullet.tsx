import React, { useState, ReactNode } from 'react';

interface CollapsibleBulletProps {
  text: string;
  children?: ReactNode;
}

export const CollapsibleBullet: React.FC<CollapsibleBulletProps> = ({ text, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = children !== undefined && children !== null;

  const handleToggle = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div style={{ paddingLeft: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {hasChildren && (
          <span
            onClick={handleToggle}
            style={{ cursor: 'pointer', marginRight: '8px', userSelect: 'none' }}
          >
            {isOpen ? '▼' : '▶'}
          </span>
        )}
        <span>• {text}</span>
      </div>
      {hasChildren && isOpen && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
};

