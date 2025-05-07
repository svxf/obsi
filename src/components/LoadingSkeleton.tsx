import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-[#1e1e1e] text-[#dcddde] overflow-hidden">
      {/* Toolbar Skeleton */}
      <div className="flex items-center p-1 border-b border-[#333] bg-[#1e1e1e]">
        <div className="flex items-center space-x-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-8 h-8 rounded bg-[#2a2a2a] animate-pulse" />
          ))}
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Skeleton */}
        <div className="w-60 border-r border-[#333]">
          <div className="p-2 border-b border-[#333]">
            <div className="h-6 w-24 bg-[#2a2a2a] rounded animate-pulse" />
          </div>
          <div className="p-2 border-b border-[#333]">
            <div className="h-8 w-full bg-[#2a2a2a] rounded animate-pulse" />
          </div>
          <div className="p-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-6 w-full bg-[#2a2a2a] rounded animate-pulse mb-2" />
            ))}
          </div>
        </div>
        
        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab Bar Skeleton */}
          <div className="flex items-center p-1 border-b border-[#333] bg-[#1e1e1e]">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 w-32 bg-[#2a2a2a] rounded animate-pulse mx-1" />
            ))}
          </div>
          
          {/* Editor Skeleton */}
          <div className="flex-1 p-4">
            <div className="h-8 w-3/4 bg-[#2a2a2a] rounded animate-pulse mb-4" />
            <div className="h-4 w-full bg-[#2a2a2a] rounded animate-pulse mb-2" />
            <div className="h-4 w-5/6 bg-[#2a2a2a] rounded animate-pulse mb-2" />
            <div className="h-4 w-4/6 bg-[#2a2a2a] rounded animate-pulse mb-4" />
            <div className="h-8 w-1/2 bg-[#2a2a2a] rounded animate-pulse mb-4" />
            <div className="h-4 w-full bg-[#2a2a2a] rounded animate-pulse mb-2" />
            <div className="h-4 w-5/6 bg-[#2a2a2a] rounded animate-pulse mb-2" />
            <div className="h-4 w-4/6 bg-[#2a2a2a] rounded animate-pulse" />
          </div>
        </div>
        
        {/* Right Sidebar Skeleton */}
        <div className="w-60 border-l border-[#333]">
          <div className="p-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-6 w-full bg-[#2a2a2a] rounded animate-pulse mb-2" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton; 