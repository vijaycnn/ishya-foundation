export default function media(asset) {
  if (asset == null) return asset;
  if (typeof asset === "string") return asset;

  const seen = new Set();
  let current = asset;

  while (current && typeof current === "object" && !seen.has(current)) {
    seen.add(current);
    if (typeof current.src === "string") return current.src;
    if (typeof current.href === "string") return current.href;
    if (typeof current.default === "string") return current.default;

    if (current.src && typeof current.src === "object") {
      current = current.src;
      continue;
    }
    if (current.default && typeof current.default === "object") {
      current = current.default;
      continue;
    }
    break;
  }

  return typeof current === "string" ? current : "";
}
