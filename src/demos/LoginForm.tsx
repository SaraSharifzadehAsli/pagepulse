const PLACEHOLDER_LOGO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23ddd'/%3E%3C/svg%3E";

/**
 * Seeded issues (on purpose, for the auditor to catch):
 * 1. Logo <img> has no alt attribute            -> axe "image-alt"
 * 2. Email input has no associated label         -> axe "label"
 * 3. Submit button text is near-invisible        -> axe "color-contrast"
 */
export function LoginForm() {
  return (
    <form className="demo login-form" onSubmit={(e) => e.preventDefault()}>
      <img src={PLACEHOLDER_LOGO} width={40} height={40} />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button type="submit" style={{ color: "#d9d9d9", background: "#ffffff", border: "1px solid #eee" }}>
        Sign in
      </button>
    </form>
  );
}
