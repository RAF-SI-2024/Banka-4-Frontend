/**
 * Formats a card number by showing the first 4 digits, last 4 digits, and masking the rest in between.
 * @param cardNumber - The card number to format.
 * @returns The formatted card number.
 */
export function formatCardNumber(cardNumber: string): string {
  const firstFour = cardNumber.slice(0, 4);
  const lastFour = cardNumber.slice(-4);
  const masked = '********';

  return `${firstFour}${masked}${lastFour}`;
}
