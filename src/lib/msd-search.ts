import ar40501Data from '@/lib/ar40501-data.json';

export interface MSDSection {
  chapter: number;
  section: string;
  title: string;
  content: string;
  body_system: string;
  standard_type: string;
}

export interface MSDSearchFilters {
  chapter?: number;
  bodySystem?: string;
  standardType?: string;
}

export interface MSDSearchResult extends MSDSection {
  score: number;
}

const sections: MSDSection[] = ar40501Data as MSDSection[];

// All unique body systems for filter dropdowns
export const BODY_SYSTEMS = [
  'Aircrew', 'Cardiovascular', 'Dental', 'Dermatologic', 'Ears/Hearing',
  'Endocrine', 'Eyes/Vision', 'Gastrointestinal', 'General', 'Genitourinary',
  'Hematologic', 'Mental Health', 'Musculoskeletal', 'Neurological',
  'Oncologic', 'Other', 'Respiratory',
] as const;

export const STANDARD_TYPES = [
  { value: 'general', label: 'General' },
  { value: 'accession', label: 'Accession (Ch 2)' },
  { value: 'retention', label: 'Retention (Ch 3)' },
  { value: 'aircrew', label: 'Aircrew (Ch 4)' },
  { value: 'special', label: 'Special Duty (Ch 5)' },
  { value: 'army_spec', label: 'Army Special (Ch 6)' },
  { value: 'other', label: 'Other' },
] as const;

export const CHAPTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

/**
 * Tokenize a query into individual search terms, lowercased.
 */
function tokenize(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

/**
 * Score a section against search terms. Higher = more relevant.
 * Title matches weighted 3x, content matches weighted 1x.
 */
function scoreSection(section: MSDSection, terms: string[]): number {
  if (terms.length === 0) return 0;

  const titleLower = section.title.toLowerCase();
  const contentLower = section.content.toLowerCase();
  let score = 0;

  for (const term of terms) {
    // Title match (high weight)
    if (titleLower.includes(term)) {
      score += 3;
      // Exact title word match bonus
      if (titleLower.split(/\s+/).some(w => w === term)) {
        score += 2;
      }
    }
    // Content match
    if (contentLower.includes(term)) {
      score += 1;
      // Count occurrences (capped)
      const occurrences = contentLower.split(term).length - 1;
      score += Math.min(occurrences * 0.2, 2);
    }
  }

  // Bonus for matching all terms
  const allInTitle = terms.every(t => titleLower.includes(t));
  const allInContent = terms.every(t => contentLower.includes(t));
  if (allInTitle) score += 5;
  if (allInContent) score += 2;

  return score;
}

/**
 * Search all AR 40-501 sections by query and optional filters.
 * Returns matching sections ranked by relevance.
 */
export function searchStandards(
  query: string,
  filters?: MSDSearchFilters
): MSDSearchResult[] {
  let results = sections;

  // Apply filters first
  if (filters?.chapter) {
    results = results.filter(s => s.chapter === filters.chapter);
  }
  if (filters?.bodySystem) {
    results = results.filter(s => s.body_system === filters.bodySystem);
  }
  if (filters?.standardType) {
    results = results.filter(s => s.standard_type === filters.standardType);
  }

  const terms = tokenize(query);

  if (terms.length === 0) {
    // No query — return filtered results in document order
    return results.map(s => ({ ...s, score: 0 }));
  }

  // Score and filter
  const scored = results
    .map(s => ({ ...s, score: scoreSection(s, terms) }))
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored;
}

/**
 * Search Chapter 3 (retention standards) specifically for a condition.
 */
export function getRetentionStandards(condition: string): MSDSearchResult[] {
  return searchStandards(condition, { chapter: 3 });
}

/**
 * Search Chapters 4-6 (aircrew/special duty standards) for a condition.
 */
export function getAircrewStandards(condition: string): MSDSearchResult[] {
  const terms = tokenize(condition);
  if (terms.length === 0) return [];

  const aircrewSections = sections.filter(s => s.chapter >= 4 && s.chapter <= 6);

  return aircrewSections
    .map(s => ({ ...s, score: scoreSection(s, terms) }))
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);
}
