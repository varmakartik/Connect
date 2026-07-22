import React from "react";

const CanvasGrid = ({ children, isDarkMode = true }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {children}
    </div>
  );
};

export default React.memo(CanvasGrid);
