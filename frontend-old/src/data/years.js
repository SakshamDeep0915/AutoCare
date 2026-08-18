const currentYear = new Date().getFullYear();

export const years = Array.from(
  { length: currentYear - 1999 },
  (_, i) => currentYear - i
);