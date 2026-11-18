import { decode } from "he";

export function formatDate(date) {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    });
}

export function truncateHtml(html, maxLength = 100) {
    if (!html) return "";

    // Decode HTML entities
    let text = decode(String(html));

    // Remove HTML tags
    text = text.replace(/<[^>]*>/g, " ");

    // Decode entities again
    text = decode(text);

    // Normalize whitespace
    const cleanText = text
        .replace(/[\s\u00A0]+/g, " ")
        .trim();

    if (cleanText.length <= maxLength) {
        return cleanText;
    }

    return cleanText.substring(0, maxLength).trim() + "...";
}