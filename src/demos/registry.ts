import type { ComponentType } from "react";
import { LoginForm } from "./LoginForm";
import { ProductCard } from "./ProductCard";
import { NavBar } from "./NavBar";

export interface DemoEntry {
  id: string;
  name: string;
  Component: ComponentType;
}

/**
 * The "component library" this tool audits. In a real team setting this
 * registry would point at the actual shared component library instead of
 * these three intentionally-flawed demos.
 */
export const registry: DemoEntry[] = [
  { id: "login-form", name: "Login form", Component: LoginForm },
  { id: "product-card", name: "Product card", Component: ProductCard },
  { id: "nav-bar", name: "Nav bar", Component: NavBar },
];
