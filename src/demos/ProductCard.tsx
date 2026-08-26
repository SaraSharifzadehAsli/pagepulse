const PLACEHOLDER_PHOTO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='120'%3E%3Crect width='160' height='120' fill='%23e2e2e2'/%3E%3C/svg%3E";

/**
 * Seeded issues (on purpose, for the auditor to catch):
 * 1. Product photo <img> has no alt attribute         -> axe "image-alt"
 * 2. Icon-only "favorite" button has no accessible name -> axe "button-name"
 * 3. Icon-only "view details" link has no accessible name -> axe "link-name"
 */
export function ProductCard() {
  return (
    <div className="demo product-card">
      <img src={PLACEHOLDER_PHOTO} width={160} height={120} />
      <h3>Wireless Headphones</h3>
      <p className="price">$59.00</p>
      <button className="icon-button" onClick={() => {}}>
        <span className="icon icon-heart" />
      </button>
      <a href="#" className="icon-link">
        <span className="icon icon-arrow" />
      </a>
    </div>
  );
}
