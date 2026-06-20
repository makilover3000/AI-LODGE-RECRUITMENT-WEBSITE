/**
 * Site-wide constants & external links.
 * TODO(confirm): swap these placeholder URLs for the real ones before launch.
 */
export const BIA_URL = "https://smubia.org"; // parent SMU BIA site (past projects)
export const APPLY_URL = "#apply"; // replace with the live application form link

export const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#timeline", label: "Timeline" },
  { href: "#why", label: "Why join" },
  { href: "#lodges", label: "Lodges" },
  { href: "#apply", label: "Apply" },
] as const;

export const APPLICATION_DATES = {
  open: "13 July",
  deadline: "2 Aug, 23:59",
  results: "11 Aug",
} as const;
