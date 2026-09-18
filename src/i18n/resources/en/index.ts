import { accessibility } from "./accessibility";
import { auth } from "./auth";
import { chat } from "./chat";
import { common } from "./common";
import { footer } from "./footer";
import { hero } from "./hero";
import { nav } from "./nav";
import { sections } from "./sections";

/** English is the completeness baseline — every other locale is compiler-checked against this exact shape (see each locale's `index.ts`). */
export const en = {
  common,
  nav,
  footer,
  hero,
  sections,
  chat,
  accessibility,
  auth,
};
