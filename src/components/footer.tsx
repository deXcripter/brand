export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer mono">
      <p>Johnpaul Nnaji © {year}</p>
    </footer>
  );
}
