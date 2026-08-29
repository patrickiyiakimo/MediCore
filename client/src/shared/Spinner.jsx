export default function Spinner({ size = "md", label = "Loading..." }) {
  return (
    <div className={`spinner spinner-${size}`} role="status" aria-label={label}>
      <span className="spinner__circle" aria-hidden="true" />
      <span className="spinner__label">{label}</span>
    </div>
  );
}