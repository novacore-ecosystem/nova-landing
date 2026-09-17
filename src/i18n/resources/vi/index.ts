import type { en } from "../en";
import { accessibility } from "./accessibility";
import { chat } from "./chat";
import { common } from "./common";
import { footer } from "./footer";
import { hero } from "./hero";
import { nav } from "./nav";
import { sections } from "./sections";

export const vi = {
  common,
  nav,
  footer,
  hero,
  sections,
  chat,
  accessibility,
} satisfies typeof en;
