export function isBdPhone(input: string) {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("880") && digits.length === 13) {
    digits = digits.slice(2);
  }
  return /^01[3-9]\d{8}$/.test(digits);
}
