export function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function truncateHtmlOld(html, maxLength = 100) {
  if (!html) return "";

  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, "");

  // Decode common HTML entities
  const temp = document.createElement("textarea");
  temp.innerHTML = text;

  const decodedText = temp.value.trim();

  if (decodedText.length <= maxLength) {
    return decodedText;
  }

  return decodedText.substring(0, maxLength).trim() + "...";
}
export function truncateHtml(html, maxLength = 100) {
  if (!html) return "";

  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, "");

  // Remove extra whitespace
  const cleanText = text.replace(/\s+/g, " ").trim();

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  return cleanText.substring(0, maxLength).trim() + "...";
}