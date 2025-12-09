import { collections, addDoc, serverTimestamp } from "../firebase";

// Daftar produk default untuk seeding awal Firestore
export const DEFAULT_PRODUCTS = [
  { name: "CG Basic", price: 55000, cost: 35000 },
  { name: "CG MOM", price: 60000, cost: 40000 },
  { name: "CG ESSENTIALS", price: 65000, cost: 45000 },
  { name: "CG COLLABERRY", price: 70000, cost: 50000 },
  { name: "CG TUMMY", price: 65000, cost: 45000 },
  { name: "CG URIGOEL", price: 75000, cost: 55000 },
  { name: "Chubby Balme Fungee", price: 45000, cost: 25000 },
  { name: "GOAT UP 30 Pouch", price: 35000, cost: 20000 },
  { name: "GOAT UP 90g JAR", price: 85000, cost: 60000 },
  { name: "FP Milk Cleanser 60ml", price: 40000, cost: 25000 },
  { name: "FP Milk Cleanser 100ml", price: 65000, cost: 45000 },
  { name: "FP Powder - 25g", price: 30000, cost: 15000 },
  { name: "Nyang-Nyang Spray", price: 50000, cost: 30000 },
  { name: "BD BASIC", price: 55000, cost: 35000 },
  { name: "BD ESSENTIAL", price: 65000, cost: 45000 },
  { name: "BD COLLABERRY", price: 70000, cost: 50000 },
  { name: "BD TUMMY", price: 65000, cost: 45000 },
  { name: "BD URIGOEL", price: 75000, cost: 55000 },
  { name: "HAIRBALL HERO 50G", price: 90000, cost: 65000 },
  { name: "Hairball hero 100 G", price: 160000, cost: 110000 }
];

// Fungsi seeding: panggil ini sekali (misalnya dari App) saat koleksi products masih kosong
export async function seedDefaultProducts() {
  await Promise.all(
    DEFAULT_PRODUCTS.map((p, index) => {
      const productId =
        p.productId || `P${String(index + 1).padStart(3, "0")}`;

      return addDoc(collections.products(), {
        name: p.name,
        price: p.price,
        cost: p.cost,

        // Field tambahan untuk kebutuhan inventori
        productId, // id product
        productType: p.productType || "default", // type product
        photoUrl: p.photoUrl || "", // foto product (URL)
        productionPrice: p.cost, // harga produksi
        salePrice: p.price, // harga jual
        condition: p.condition || "BAIK", // kondisi barang
        batch: p.batch || "", // batch
        stock: p.stock ?? 0, // stok awal (stok detail tetap dihitung dari transaksi)

        createdAt: serverTimestamp()
      });
    })
  );
}

