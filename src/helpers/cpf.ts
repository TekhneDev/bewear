export const isValidCpf = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) {
    return false;
  }
  const calculateCheckDigit = (length: number) => {
    const sum = digits
      .slice(0, length)
      .split("")
      .reduce(
        (acc, digit, index) => acc + Number(digit) * (length + 1 - index),
        0,
      );
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };
  return (
    calculateCheckDigit(9) === Number(digits[9]) &&
    calculateCheckDigit(10) === Number(digits[10])
  );
};
