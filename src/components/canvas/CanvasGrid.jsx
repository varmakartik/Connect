import React from "react";

const CanvasGrid = ({ children, isDarkMode = true }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      {children}
    </div>
  );
};

export default React.memo(CanvasGrid);
