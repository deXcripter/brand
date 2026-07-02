export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer mono">
      <p>Johnpaul Nnaji © {year} — built line by line.</p>
    </footer>
  );
}
