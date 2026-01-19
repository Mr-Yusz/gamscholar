export function formatGmd(amountGmd: number) {
  return new Intl.NumberFormat("en-GM", {
    style: "currency",
    currency: "GMD",
    maximumFractionDigits: 0,
  }).format(amountGmd);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}
