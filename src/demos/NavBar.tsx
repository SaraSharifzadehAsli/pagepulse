/**
 * Seeded issues (on purpose, for the auditor to catch):
 * 1. Two icon-only links share the same id="nav-item" -> axe "duplicate-id"
 * 2 & 3. Both icon-only links have no accessible name  -> axe "link-name"
 */
export function NavBar() {
  return (
    <nav className="demo nav-bar">
      <a href="#" id="nav-item" className="icon-link">
        <span className="icon icon-home" />
      </a>
      <a href="#" id="nav-item" className="icon-link">
        <span className="icon icon-search" />
      </a>
      <a href="#" className="text-link">
        Pricing
      </a>
    </nav>
  );
}
