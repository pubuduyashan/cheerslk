const LKR_SYMBOL = 'Rs.';

export function formatLKR(amount: number): string {
  return `${LKR_SYMBOL} ${amount.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function parseLKR(formatted: string): number {
  return parseFloat(formatted.replace(/[^0-9.-]/g, ''));
}

export { LKR_SYMBOL };
