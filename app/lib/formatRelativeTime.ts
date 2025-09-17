export function formatRelativeTime(iso: string, now = new Date()): string {
  const d = new Date(iso);
  const diffMs = now.getTime() - d.getTime();
  const min = Math.floor(diffMs / 60000);
  const hr = Math.floor(min / 60);

  const sameDay = now.toDateString() === d.toDateString();
  if (sameDay) {
    if (hr >= 1) return `${hr}時間前`;
    if (min >= 1) return `${min}分前`;
    return "たった今";
  }
  const y = new Date(now); y.setDate(now.getDate() - 1);
  if (y.toDateString() === d.toDateString()) return "昨日";
  return formatYmd(iso);
}

export function formatYmd(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}年${m}月${day}日`;
}
