export default function StatCard({ label, value, note, icon }) {
  return (
    <article className="stat-card">
      <div className="stat-top"><span className="stat-label">{label}</span><span className="stat-icon" aria-hidden="true">{icon}</span></div>
      <strong className="stat-value">{value}</strong>
      <span className="stat-note">{note}</span>
    </article>
  );
}
