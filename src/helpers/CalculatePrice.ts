export const calculatePrice = (options: { discount?: number; price: number }): number => {
  if (options.discount) {
    const porcent: number = (options.price * options.discount) / 100;
    return Number((options.price - porcent).toFixed(2));
  }

  return options.price;
};
