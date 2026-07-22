import React from "react";

const CanvasGrid = ({ children, isDarkMode = true }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {children}
    </div>
  );
};

export default React.memo(CanvasGrid);
