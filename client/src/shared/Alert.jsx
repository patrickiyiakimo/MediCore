const VARIANT_CLASSES = {
  info: "alert-info",
  error: "alert-error",
  success: "alert-success",
  warning: "alert-warning",
};

export default function Alert({ variant = "info", children }) {
  if (!children) return null;
  const className = VARIANT_CLASSES[variant] || VARIANT_CLASSES.info;
  return (
    <div className={`alert ${className}`} role="alert">
      {children}
    </div>
  );
}