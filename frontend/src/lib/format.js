const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export const money = (value) => currency.format(value);

export const today = () => new Date().toLocaleDateString('en-CA');

export const thisMonth = () => today().slice(0, 7);

export const shiftMonth = (month, step) => {
  const [year, index] = month.split('-').map(Number);
  return new Date(Date.UTC(year, index - 1 + step, 1)).toISOString().slice(0, 7);
};

export const monthName = (month) =>
  new Date(`${month}-01T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

export const shortDate = (value) =>
  new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
