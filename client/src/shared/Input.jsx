export default function Input({
  label,
  type = "text",
  error,
  helper,
  ...props
}) {
  return (
    <div className="field">
      {label && <label className="field__label">{label}</label>}
      <input className="field__input" type={type} {...props} />
      {error ? (
        <span className="field__error">{error}</span>
      ) : (
        helper && <span className="field__helper">{helper}</span>
      )}
    </div>
  );
}