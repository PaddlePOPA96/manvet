import React from "react";
import { Filter } from "lucide-react";

/**
 * FilterBar Component - Container for filter controls
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Filter inputs/controls
 * @param {string} props.title - Optional filter bar title
 * @param {string} props.className - Additional CSS classes
 */
export default function FilterBar({ children, title = "Filter", className = "" }) {
    return (
        <div className={`bg-gray-50 rounded-lg border border-gray-200 p-4 ${className}`}>
            <div className="flex items-center gap-2 mb-3">
                <Filter size={16} className="text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {children}
            </div>
        </div>
    );
}
