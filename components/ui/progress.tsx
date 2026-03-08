import React from "react";

interface ProgressProps {
  value: number;
  max?: number;
}

export const Progress: React.FC<ProgressProps> = ({ value, max = 100 }) => {
  return (
    <div className="w-full h-2 bg-gray-200 rounded">
      <div
        className="h-2 bg-indigo-500 rounded"
        style={{ width: `${Math.min(value, max)}%` }}
      />
    </div>
  );
};
