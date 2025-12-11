import React from "react";
import { X } from "lucide-react";

/**
 * Modal Component - Dialog overlay with centered content
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {'sm' | 'md' | 'lg'} props.size - Modal size
 * @param {boolean} props.showCloseButton - Show X button in header
 */
export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    showCloseButton = true,
}) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-2xl",
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-lg p-6 w-full ${sizeClasses[size]} shadow-xl`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    {title && (
                        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
                    )}
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div>{children}</div>
            </div>
        </div>
    );
}
