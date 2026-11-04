export const formatAddress = (address: {
  recipientName: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}) => {
  const streetLine = [address.street, address.number, address.complement]
    .filter(Boolean)
    .join(", ");
  return `${address.recipientName} • ${streetLine}, ${address.neighborhood}, ${address.city} - ${address.state} • CEP: ${address.zipCode}`;
};
