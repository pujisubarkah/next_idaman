import React from 'react';

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="text-white text-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-4 mb-4"
          style={{ borderTopColor: '#3781c7' }}
        ></div>
        <p>Tunggu sebentar...</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
