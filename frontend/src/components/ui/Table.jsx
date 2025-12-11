import React from "react";

/**
 * Table Component - Reusable data table with consistent styling
 * 
 * @param {Object} props
 * @param {Array} props.columns - Column definitions [{key, label, align?, className?}]
 * @param {Array} props.data - Data array
 * @param {Function} props.renderRow - Function to render each row (item, index) => ReactNode
 * @param {string} props.emptyMessage - Message when no data
 * @param {string} props.className - Additional CSS classes
 */
export default function Table({
    columns = [],
    data = [],
    renderRow,
    emptyMessage = "Tidak ada data.",
    className = "",
}) {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                    <tr>
                        {columns.map((col, idx) => (
                            <th
                                key={col.key || idx}
                                className={`px-4 py-2 ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""} ${col.className || ""}`}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="text-center py-4 text-gray-400"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr
                                key={item.id || index}
                                className="border-b hover:bg-gray-50 transition-colors"
                            >
                                {renderRow(item, index)}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
