import React, { useState } from "react";
import { Store, Printer, Save } from "lucide-react";
import Input from "./ui/Input";

export default function SettingsTab() {
    const [storeSettings, setStoreSettings] = useState({
        storeName: "Vetpicurean Pet Shop",
        storeAddress: "Jl. Contoh Raya No. 123, Jakarta Selatan",
        storePhone: "0812-3499-1234",
        taxRate: 11,
        footerMessage: "Terima kasih telah berbelanja!",
        printerIp: "192.168.1.200"
    });

    const handleChange = (field, value) => {
        setStoreSettings((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        // Save to localStorage or Backend
        localStorage.setItem("vet_store_settings", JSON.stringify(storeSettings));
        alert("Pengaturan berhasil disimpan.");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Store size={24} className="text-teal-600" /> Pengaturan Toko
                </h2>
                <button
                    onClick={handleSave}
                    className="bg-teal-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-teal-700 flex items-center gap-2 shadow-lg shadow-teal-600/20"
                >
                    <Save size={16} /> Simpan Perubahan
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informasi Toko */}
                <div className="bg-white rounded-lg shadow border p-6">
                    <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">
                        Identitas Toko (Struk)
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">
                                Nama Toko
                            </label>
                            <Input
                                value={storeSettings.storeName}
                                onChange={(e) => handleChange("storeName", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">
                                Alamat Toko
                            </label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                rows={3}
                                value={storeSettings.storeAddress}
                                onChange={(e) => handleChange("storeAddress", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">
                                Nomor Telepon
                            </label>
                            <Input
                                value={storeSettings.storePhone}
                                onChange={(e) => handleChange("storePhone", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">
                                Pesan Footer Struk
                            </label>
                            <Input
                                value={storeSettings.footerMessage}
                                onChange={(e) =>
                                    handleChange("footerMessage", e.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Konfigurasi Lainnya */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow border p-6">
                        <h3 className="font-bold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
                            <Printer size={18} /> Konfigurasi Hardware & Keuangan
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">
                                    PPN / Pajak (%)
                                </label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        value={storeSettings.taxRate}
                                        onChange={(e) => handleChange("taxRate", e.target.value)}
                                        className="pr-8"
                                    />
                                    <span className="absolute right-3 top-2.5 text-xs text-gray-500 font-bold">
                                        %
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">
                                    IP Printer Thermal (Network)
                                </label>
                                <Input
                                    value={storeSettings.printerIp}
                                    onChange={(e) => handleChange("printerIp", e.target.value)}
                                    placeholder="192.168.x.x"
                                />
                                <p className="text-[10px] text-gray-400 mt-1">
                                    Biarkan kosong jika menggunakan USB / Bluetooth via Mobile.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
