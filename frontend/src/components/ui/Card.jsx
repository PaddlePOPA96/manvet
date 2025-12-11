import React from "react";

/**
 * Card Component - Container with consistent styling
 * 
 * @param {Object} props
 * @param {string} props.title - Optional card title
 * @param {React.ReactNode} props.children - Card content
 * @param {React.ReactNode} props.actions - Optional header actions (buttons, etc.)
 * @param {string} props.className - Additional CSS classes
 */
export default function Card({ title, children, actions, className = "" }) {
    return (
        <div className={`bg-white rounded-lg shadow border border-gray-200 p-4 ${className}`}>
            {(title || actions) && (
                <div className="flex justify-between items-center mb-4">
                    {title && (
                        <h2 className="text-xl font-bold text-gray-700">
                            {title}
                        </h2>
                    )}
                    {actions && <div className="flex gap-2">{actions}</div>}
                </div>
            )}
            {children}
        </div>
    );
}
