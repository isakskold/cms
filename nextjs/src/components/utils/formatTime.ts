const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return date
    .toLocaleString("sv-SE", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Ensures 24-hour format
    })
    .replace(",", ""); // Removes unnecessary comma
};

export default formatDateTime;
