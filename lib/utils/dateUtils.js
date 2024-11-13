export function isExpired(date) {
  const now = new Date();
  const expirationDate = new Date(date);
  expirationDate.setDate(expirationDate.getDate() + 30);

  return now > expirationDate;
}
