// BR-02: "Rp28.000" tanpa desimal; tanpa harga "Tanya barista". Tidak menambah pajak atau layanan.
const THOUSANDS = /\B(?=(\d{3})+(?!\d))/g;

export function formatPrice(priceIdr: number | null): string {
  if (priceIdr === null) return "Tanya barista";
  return `Rp${String(priceIdr).replace(THOUSANDS, ".")}`;
}
