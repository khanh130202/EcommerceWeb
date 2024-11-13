export default {
  format(input: any, fix: number) {
    return input
      ? Number(Number(input).toFixed(fix ?? 0)).toLocaleString()
      : null;
  },
  increaseNumber(num: string, totalLength: number) {
    return String(num).padStart(totalLength, '0');
  },
  formatCurrency(amount: any, locale = 'vi-VN', currency = 'VND') {
    const numericAmount = Number(amount);
  
    if (isNaN(numericAmount)) {
      throw "N/A";
    }
  
    return numericAmount.toLocaleString(locale, { style: 'currency', currency: currency });
  },
  formatNumberWithDots(num: any) {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
};
