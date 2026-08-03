export function TravellerAvatar({
  emoji,
  accent,
  size = 44,
  label,
}: {
  emoji: string;
  accent: string;
  size?: number;
  label: string;
}) {
  return (
    <span
      role="img"
      aria-label={label}
      className="inline-flex shrink-0 items-center justify-center rounded-full border-2 border-white shadow-[0_4px_14px_rgba(22,22,42,0.12)]"
      style={{
        width: size,
        height: size,
        background: accent,
        fontSize: size * 0.48,
        lineHeight: 1,
      }}
    >
      {emoji}
    </span>
  );
}
