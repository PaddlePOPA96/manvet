import React from "react";
import { Search } from "lucide-react";

/**
 * SearchInput Component - Input field with search icon
 * 
 * @param {Object} props
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional CSS classes
 */
export default function SearchInput({
    value,
    onChange,
    placeholder = "Cari...",
    className = "",
    ...props
}) {
    return (
        <div className={`relative ${className}`}>
            <Search
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
            />
            <input
                type="text"
                className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...props}
            />
        </div>
    );
}
