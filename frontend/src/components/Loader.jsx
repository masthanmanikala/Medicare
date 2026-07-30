import React from 'react';

const Loader = ({ fullScreen = true }) => {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-16 h-16">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        {/* Inner Heartbeat Wave Vector (Cross) */}
        <div className="absolute inset-2 rounded-full border-4 border-accent/20 border-b-accent animate-spin-slow"></div>
      </div>
      <p className="text-slate-500 font-medium font-poppins animate-pulse text-sm dark:text-slate-400">
        Loading Medicare...
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
        {loaderContent}
      </div>
    );
  }

  return <div className="py-12 flex justify-center">{loaderContent}</div>;
};

export default Loader;
