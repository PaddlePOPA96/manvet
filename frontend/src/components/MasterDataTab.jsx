import React, { useState } from "react";
import { Tags, Weight, Plus, Trash2, Edit2, Save, X } from "lucide-react";
import Input from "./ui/Input";

export default function MasterDataTab({
    categories = [],
    units = [],
    onUpdateCategories, // Legacy for local state (or wrapper)
    onUpdateUnits,      // Legacy for local state
    onAddCategory,      // New API
    onDeleteCategory,   // New API
    onEditCategory      // New API (optional)
}) {
    const [activeSubTab, setActiveSubTab] = useState("categories");

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4 border-b border-gray-200 pb-2 mb-4">
                <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSubTab === "categories"
                        ? "bg-teal-50 text-teal-700 font-bold"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        }`}
                    onClick={() => setActiveSubTab("categories")}
                >
                    <Tags size={16} /> Kategori Produk
                </button>
                <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSubTab === "units"
                        ? "bg-teal-50 text-teal-700 font-bold"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        }`}
                    onClick={() => setActiveSubTab("units")}
                >
                    <Weight size={16} /> Satuan (Units)
                </button>
            </div>

            {activeSubTab === "categories" && (
                <MasterCrud
                    title="Kategori Produk"
                    data={categories}
                    placeholder="Nama Kategori (misal: Makanan, Obat, Aksesoris)"
                    onUpdate={onUpdateCategories} // Fallback
                    onAdd={onAddCategory}
                    onDelete={onDeleteCategory}
                    onEdit={onEditCategory}
                />
            )}

            {activeSubTab === "units" && (
                <MasterCrud
                    title="Satuan Unit"
                    data={units}
                    placeholder="Nama Satuan (misal: Pcs, Box, Botol, Kg)"
                    onUpdate={onUpdateUnits}
                />
            )}
        </div>
    );
}

function MasterCrud({ title, data, placeholder, onUpdate, onAdd, onDelete, onEdit }) {
    const [newItem, setNewItem] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editValue, setEditValue] = useState("");

    const handleAddSubmit = (e) => {
        e.preventDefault();
        if (!newItem.trim()) return;
        if (onAdd) {
            onAdd(newItem.trim());
        } else if (onUpdate) {
            onUpdate([...data, newItem.trim()]);
        }
        setNewItem("");
    };

    const handleDeleteClick = (index) => {
        if (window.confirm("Hapus item ini?")) {
            if (onDelete) {
                onDelete(data[index]); // Pass value or ID
            } else if (onUpdate) {
                const updated = data.filter((_, i) => i !== index);
                onUpdate(updated);
            }
        }
    };

    const startEdit = (index) => {
        setEditingIndex(index);
        setEditValue(data[index]);
    };

    const saveEdit = (index) => {
        if (!editValue.trim()) return;
        if (onEdit) {
            onEdit(data[index], editValue.trim());
        } else if (onUpdate) {
            const updated = [...data];
            updated[index] = editValue.trim();
            onUpdate(updated);
        }
        setEditingIndex(null);
    };

    return (
        <div className="bg-white rounded-lg shadow border p-6 max-w-2xl">
            <h3 className="font-bold text-gray-700 mb-4">{title}</h3>

            <form onSubmit={handleAddSubmit} className="flex gap-2 mb-6">
                <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1"
                />
                <button
                    type="submit"
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-teal-700 flex items-center gap-2"
                >
                    <Plus size={16} /> Tambah
                </button>
            </form>

            {data.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-lg dashed border-2 border-gray-200">
                    Belum ada data {title.toLowerCase()}.
                </div>
            ) : (
                <div className="space-y-2">
                    {data.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors"
                        >
                            {editingIndex === idx ? (
                                <div className="flex-1 flex items-center gap-2 mr-2">
                                    <Input
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="w-full text-sm py-1"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => saveEdit(idx)}
                                        className="text-green-600 p-1 hover:bg-green-50 rounded"
                                    >
                                        <Save size={16} />
                                    </button>
                                    <button
                                        onClick={() => setEditingIndex(null)}
                                        className="text-gray-500 p-1 hover:bg-gray-200 rounded"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <span className="font-medium text-gray-700 text-sm">
                                    {item}
                                </span>
                            )}

                            {editingIndex !== idx && (
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => startEdit(idx)}
                                        className="text-blue-500 p-1.5 hover:bg-blue-50 rounded transition-colors"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(idx)}
                                        className="text-red-500 p-1.5 hover:bg-red-50 rounded transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
