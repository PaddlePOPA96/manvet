import React from "react";

export default function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`w-full border rounded px-2 py-2 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

