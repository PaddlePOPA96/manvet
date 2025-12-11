import React from "react";

/**
 * Button Component - Enhanced with icon support and variants
 * 
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'danger' | 'ghost'} props.variant - Button style variant
 * @param {'sm' | 'md' | 'lg'} props.size - Button size
 * @param {React.ReactNode} props.icon - Optional icon element
 * @param {'left' | 'right'} props.iconPosition - Icon position relative to text
 * @param {React.ReactNode} props.children - Button text/content
 * @param {boolean} props.disabled - Disabled state
 * @param {Function} props.onClick - Click handler
 * @param {'button' | 'submit'} props.type - Button type
 * @param {string} props.className - Additional CSS classes
 */
export default function Button({
    variant = "primary",
    size = "md",
    icon,
    iconPosition = "left",
    children,
    disabled = false,
    onClick,
    type = "button",
    className = "",
    ...props
}) {
    const variantClasses = {
        primary: "bg-teal-600 text-white hover:bg-teal-700",
        secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
        danger: "bg-red-600 text-white hover:bg-red-700",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
    };

    const sizeClasses = {
        sm: "px-2 py-1 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        rounded-lg font-semibold
        flex items-center gap-2
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
            {...props}
        >
            {icon && iconPosition === "left" && icon}
            {children}
            {icon && iconPosition === "right" && icon}
        </button>
    );
}
