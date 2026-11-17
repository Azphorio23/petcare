export default function EstadoBadge({ estado }) {
  return <span className={`pc-estado pc-estado-${estado.toLowerCase()}`}>{estado}</span>;
}
