export default function Card({ title, children, actions }) {
  return (
    <section className="card">
      {(title || actions) && (
        <header className="card__header">
          {title && <h2 className="card__title">{title}</h2>}
          {actions}
        </header>
      )}
      <div className="card__body">{children}</div>
    </section>
  );
}