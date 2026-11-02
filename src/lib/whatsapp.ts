import { WA_NUMBER } from "../data/data";

export const openWhatsApp = (text: string) =>
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");

/** At least 9 digits, so Israeli mobile and landline numbers pass. */
export const validPhone = (p: string) => p.replace(/\D/g, "").length >= 9;
