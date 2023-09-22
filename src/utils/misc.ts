export const truncateAddress = (address: string, chars = 4) => {
  return `${address.slice(0, 2 + chars)}...${address.slice(-chars)}`;
};