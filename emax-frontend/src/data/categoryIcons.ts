/**
 * Emoji / icon mapping for categories displayed on the landing page.
 * Each category name lowercased maps to an icon string.
 */
export const CATEGORY_ICONS: Record<string, string> = {
  phones: "📱",
  laptops: "💻",
  gaming: "🎮",
  audio: "🎧",
  networking: "📡",
  tvs: "📺",
  televisions: "📺",
  accessories: "⌚",
  "smart home": "🏠",
  computers: "🖥️",
  tablets: "📟",
  cameras: "📷",
  printers: "🖨️",
  software: "💿",
  wearables: "⌚",
  headphones: "🎧",
  speakers: "🔊",
  monitors: "🖥️",
  keyboards: "⌨️",
  mice: "🖱️",
  storage: "💾",
  components: "🔧",
};

export function getCategoryIcon(name: string): string {
  return CATEGORY_ICONS[name.toLowerCase()] || "📦";
}

