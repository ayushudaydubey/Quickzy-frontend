import React from 'react';

const sizeMap = {
  xs: { dims: 'w-4 h-4', border: 'border-2' },
  sm: { dims: 'w-6 h-6', border: 'border-2' },
  md: { dims: 'w-12 h-12', border: 'border-4' },
  lg: { dims: 'w-16 h-16', border: 'border-4' },
};

const Loader = ({ size = 'md', text = '', overlay = false, inline = false }) => {
  const s = sizeMap[size] || sizeMap.md;

  const spinner = (
    <div
      className={`${s.dims} ${s.border} rounded-full border-gray-300 border-t-white animate-spin`}>
      <span className="sr-only">Loading</span>
    </div>
  );

  if (inline) {
    return (
      <span className="inline-flex items-center gap-2">
        {spinner}
        {text ? <span className="text-sm text-gray-200">{text}</span> : null}
      </span>
    );
  }

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-center gap-3">
          {spinner}
          {text ? <div className="text-sm text-gray-200">{text}</div> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {spinner}
      {text ? <div className="mt-3 text-sm text-gray-500">{text}</div> : null}
    </div>
  );
};

export default Loader;
