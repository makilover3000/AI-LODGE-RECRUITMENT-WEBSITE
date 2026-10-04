/**
 * Programme-wide facts shared across the landing page and lodge pages.
 * Change a date or the application link here once — every section picks it up.
 */

export const APPLY_URL = "https://forms.gle/ZU3dx3i3fioxkvjv8";

/** when the new cohort's lodge details (focus, captains, weekly trail) go live */
export const LODGE_REVEAL = "26 Oct";

/** the cohort the 7 original lodges ran in (shown on their pages as "Past lodge · …") */
export const PAST_COHORT_LABEL = "Fall 2026";

export type KeyDate = {
  day: string; // "05"
  month: string; // "Oct"
  year?: string;
  label: string;
  note: string;
  /** the date applicants must act by — gets the emphasised "Deadline" treatment */
  deadline?: boolean;
};

/** application timeline, in chronological order */
export const KEY_DATES: KeyDate[] = [
  {
    day: "05",
    month: "Oct",
    label: "Applications open",
    note: "The form goes live — get your application in early.",
  },
  {
    day: "26",
    month: "Oct",
    label: "Lodges revealed · interviews begin",
    note: "Full lodge details drop and the first interviews start.",
  },
  {
    day: "16",
    month: "Nov",
    label: "Applications close",
    note: "Last call — submit before the form closes.",
    deadline: true,
  },
  {
    day: "24",
    month: "Dec",
    year: "2026",
    label: "Interviews end",
    note: "Final interviews wrap up; results follow after.",
  },
];
