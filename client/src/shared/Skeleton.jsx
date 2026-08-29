export default function Skeleton({ rows = 3 }) {
  return (
    <div className="skeleton" role="status" aria-label="Loading content">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="skeleton__row" />
      ))}
    </div>
  );
}