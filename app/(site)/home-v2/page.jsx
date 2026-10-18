import { permanentRedirect } from "next/navigation";

// The new home was built here as a prototype; it is the home page now.
export default function HomeV2Page() {
  permanentRedirect("/");
}
