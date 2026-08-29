export default function Button({
  type = "button",
  variant = "primary",
  loading = false,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      disabled={loading}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}