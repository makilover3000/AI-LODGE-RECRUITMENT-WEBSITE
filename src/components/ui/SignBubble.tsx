/** Teal poster "signboard" speech bubble — irregular clip-path, inset border, offset shadow, tail. */

const SHAPE =
  "polygon(2% 8%, 7% 0, 42% 4%, 72% 0, 97% 5%, 100% 34%, 99% 72%, 100% 95%, 68% 98%, 38% 100%, 9% 96%, 0% 68%, 1% 34%)";

export default function SignBubble({
  children,
  className = "",
  tail = "bl",
}: {
  children: React.ReactNode;
  className?: string;
  tail?: "bl" | "br" | "none";
}) {
  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ filter: "drop-shadow(4px 5px 0 rgba(13,111,98,0.4))" }}
    >
      <div
        className="px-6 py-4 text-lg font-semibold leading-[1.05] text-cream-50"
        style={{
          clipPath: SHAPE,
          background: "var(--color-teal-deep)",
          boxShadow:
            "inset 0 0 0 3px var(--color-teal), inset 0 0 0 6px rgba(94,186,171,0.4)",
        }}
      >
        {children}
      </div>
      {tail !== "none" && (
        <span
          aria-hidden
          className={`absolute -bottom-3 h-6 w-6 ${tail === "bl" ? "left-7" : "right-7"}`}
          style={{
            background: "var(--color-teal-deep)",
            clipPath:
              tail === "bl"
                ? "polygon(0 0, 100% 0, 18% 100%)"
                : "polygon(0 0, 100% 0, 82% 100%)",
          }}
        />
      )}
    </div>
  );
}
