"use client";

import dynamic from "next/dynamic";
import styles from "./rich-text-field.module.css";

/**
 * The rich text field for Puck blocks, loaded only when the editor shows it.
 * Blocks importing RichTextField directly pulled BlockNote, Mantine and
 * ProseMirror (about 0.5 MB gzipped, plus their CSS) into every public page.
 */
export const LazyRichTextField = dynamic(() => import("./RichTextField.jsx").then((m) => m.RichTextField), {
  ssr: false,
  loading: () => <div className={styles.editorRoot} />,
});
