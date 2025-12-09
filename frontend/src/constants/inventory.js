/**
 * Semua konstanta yang berhubungan dengan inventory / stok.
 *
 * Catatan:
 * - Simpan teks kondisi hanya di sini supaya mudah di‑update
 *   kalau ada perubahan istilah.
 * - Gunakan array yang sudah dibekukan (Object.freeze)
 *   agar tidak diubah secara tidak sengaja di komponen lain.
 */

/**
 * Kondisi transaksi OUT yang dianggap penjualan
 * (dipakai untuk hitung omzet & profit).
 */
export const SALE_CONDITIONS = Object.freeze([
  "SALE",
  "Reseller",
  "Consignment (titip jual)"
]);

/**
 * Semua kondisi yang mungkin untuk transaksi barang keluar (OUT),
 * termasuk penjualan dan non‑penjualan (waste, promo, dsb).
 */
export const CONDITIONS_OUT = Object.freeze([
  "SALE",
  "Consignment (titip jual)",
  "Reseller",
  "Defects / Cacat Produksi",
  "Kadaluarsa",
  "Marketing (free product)",
  "Loyalty Program"
]);

/**
 * Semua kondisi yang mungkin untuk transaksi barang masuk (IN).
 */
export const CONDITIONS_IN = Object.freeze([
  "Barang Diterima dari Produksi",
  "Retur Barang Rusak Karena Pengiriman",
  "Return Barang (masih bisa digunakan)",
  "Barang Rusak Karena Penyimpanan",
  "Defects / Cacat Produksi (Temuan Gudang)",
  "Barang Kadaluarsa (Temuan Gudang)"
]);

