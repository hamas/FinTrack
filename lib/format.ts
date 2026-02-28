export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    signDisplay: 'never',
  }).format(Math.abs(amount));
};

export const formatCurrencyWithSign = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    signDisplay: 'always',
  }).format(amount);
};
