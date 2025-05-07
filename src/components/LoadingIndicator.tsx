import React from 'react';

interface LoadingIndicatorProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  };

  return (
    <div className={`inline-block ${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full border-2 border-gray-300 border-t-[#a47ddc] rounded-full animate-spin" />
    </div>
  );
};

export default LoadingIndicator; 