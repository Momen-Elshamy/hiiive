// Alt text for the images the About blocks ship with, in each language.
//
// A block uses it when the editor left its alt field empty and the block
// still shows that image, so German pages get German alts without every page
// storing its own copy. An alt typed in the editor always wins; a replaced
// image with no alt typed gets none. The page's language reaches the blocks
// as puck.metadata.locale (set by the page route's <Render metadata>).
//
// Dependency-free: imported by blocks that also load in the client editor.
import { DEFAULT_LOCALE } from "@/lib/locales";

const ALTS = {
  "/img/about-hero.jpg": {
    en: "Glowing yellow light trail looping through a dark 3D ribbon",
    de: "Leuchtende gelbe Lichtspur, die sich durch ein dunkles 3D-Band windet",
  },
  "/img/about-flywheel.png": {
    en: "Flywheel diagram: AI Lab and AI Engineering as two connected loops",
    de: "Flywheel-Diagramm: AI Lab und AI Engineering als zwei verbundene Kreisläufe",
  },
  "/img/about-office.jpg": {
    en: "The hiiive team laughing around a table in the Berlin-Spandau office",
    de: "Das hiiive-Team lacht gemeinsam an einem Tisch im Büro in Berlin-Spandau",
  },
};

/** The alt for an image: the editor's `alt`, else the shipped one for `src` in the page's locale. */
export function imageAlt(src, alt, puck) {
  if (alt) return alt;
  const known = ALTS[src];
  if (!known) return "";
  return known[puck?.metadata?.locale] || known[DEFAULT_LOCALE];
}
