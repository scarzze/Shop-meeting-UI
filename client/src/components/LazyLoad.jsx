import React, { Suspense } from 'react';

const LazyLoad = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default LazyLoad;
