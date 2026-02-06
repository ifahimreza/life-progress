type GoogleButtonProps = {
  onClick: () => void;
  label?: string;
  fullWidth?: boolean;
  size?: "sm" | "md";
  className?: string;
  disabled?: boolean;
};

export default function GoogleButton({
  onClick,
  label = "Continue with Google",
  fullWidth = true,
  size = "md",
  className = "",
  disabled = false
}: GoogleButtonProps) {
  const sizeClasses =
    size === "sm"
      ? "px-4 py-2 text-xs"
      : "px-4 py-3 text-sm";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white font-semibold text-neutral-800 shadow-sm transition hover:border-neutral-400 hover:shadow-md focus-visible:outline-none focus-brand disabled:cursor-not-allowed disabled:opacity-50 ${
        fullWidth ? "w-full" : ""
      } ${sizeClasses} ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className="h-4 w-4"
      >
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.73 1.37 9.22 3.61l6.88-6.88C36.01 2.69 30.48 0 24 0 14.62 0 6.51 5.39 2.56 13.25l7.98 6.2C12.43 13.09 17.77 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.98 24.55c0-1.57-.14-3.09-.41-4.55H24v9.02h12.95c-.56 2.97-2.22 5.48-4.71 7.18l7.2 5.59C43.55 37.65 46.98 31.67 46.98 24.55z"
        />
        <path
          fill="#FBBC05"
          d="M10.54 28.45c-.55-1.64-.86-3.39-.86-5.2s.31-3.56.86-5.2l-7.98-6.2C.92 15.37 0 19.04 0 23.25s.92 7.88 2.56 11.4l7.98-6.2z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.9-5.81l-7.2-5.59c-2.01 1.35-4.59 2.15-8.7 2.15-6.23 0-11.57-3.59-13.46-8.75l-7.98 6.2C6.51 42.61 14.62 48 24 48z"
        />
      </svg>
      <span>{label}</span>
    </button>
  );
}
