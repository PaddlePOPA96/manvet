import React from "react";

/**
 * Badge Component - Status indicator with color variants
 * 
 * @param {Object} props
 * @param {'success' | 'warning' | 'danger' | 'info'} props.variant - Color variant
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} props.className - Additional CSS classes
 */
export default function Badge({ variant = "info", children, className = "" }) {
    const variantClasses = {
        success: "bg-green-100 text-green-700",
        warning: "bg-orange-100 text-orange-700",
        danger: "bg-red-100 text-red-700",
        info: "bg-blue-100 text-blue-700",
    };

    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${variantClasses[variant]} ${className}`}
        >
            {children}
        </span>
    );
}
