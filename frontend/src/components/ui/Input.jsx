import React from "react";

export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full border rounded px-2 py-2 text-sm bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-100 disabled:text-gray-400 ${className}`}
      {...props}
    />
  );
}

