export interface CollegeDirectoryEntry {
  readonly abbr: string;
  readonly name: string;
}

export const ZPPSU_COLLEGES: ReadonlyArray<CollegeDirectoryEntry> = [
  { abbr: 'CTE', name: 'College of Teacher Education' },
  { abbr: 'CPES', name: 'College of Physical Education and Sports' },
  { abbr: 'CME', name: 'College of Maritime Education' },
  { abbr: 'CICS', name: 'College of Information and Computing Sciences' },
  { abbr: 'CET', name: 'College of Engineering and Technology' },
  { abbr: 'CAHSS', name: 'College of Arts, Humanities, and Social Sciences' },
  { abbr: 'SBA', name: 'School of Business Administration' },
  { abbr: 'PNP', name: 'Pre-Baccalaureate / Non-Degree Programs' },
];

/**
 * Resolves a comma-separated list of college acronyms or full names into
 * all equivalent Prisma match values (both full name and acronym) and human-readable labels.
 */
export const resolveCollegeFilters = (
  rawColleges: unknown
): {
  readonly matchValues: string[];
  readonly displayLabels: string[];
  readonly isAllSelected: boolean;
} => {
  if (!rawColleges) {
    return { matchValues: [], displayLabels: ['All Colleges'], isAllSelected: true };
  }

  const rawList = Array.isArray(rawColleges)
    ? rawColleges.flatMap((v) => String(v).split(','))
    : String(rawColleges).split(',');

  const tokens = rawList.map((t) => t.trim()).filter(Boolean);
  if (tokens.length === 0 || tokens.some((t) => t.toLowerCase() === 'all')) {
    return { matchValues: [], displayLabels: ['All Colleges'], isAllSelected: true };
  }

  const matchSet = new Set<string>();
  const labelSet = new Set<string>();

  for (const token of tokens) {
    const lower = token.toLowerCase();
    const matched = ZPPSU_COLLEGES.find(
      (c) => c.abbr.toLowerCase() === lower || c.name.toLowerCase() === lower
    );

    if (matched) {
      matchSet.add(matched.name);
      matchSet.add(matched.abbr);
      labelSet.add(matched.abbr);
    } else {
      matchSet.add(token);
      labelSet.add(token);
    }
  }

  return {
    matchValues: Array.from(matchSet),
    displayLabels: Array.from(labelSet),
    isAllSelected: false,
  };
};
