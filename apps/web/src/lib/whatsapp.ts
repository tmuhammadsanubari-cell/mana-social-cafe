// BR-03: tautan WhatsApp memakai nomor pengaturan situs dan menyebut outlet serta asalnya.
export function generalMessage(outletName: string): string {
  return `Halo ${outletName}, saya ingin bertanya. (dari website)`;
}

export function whatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
