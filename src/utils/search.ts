/**
 * Client-side search shared by the blog index and the destinations grid.
 * Both render their cards at build time with a `data-search` haystack, so
 * searching is pure DOM filtering: no fetch, no framework.
 */

// Below this length the query is treated as empty: too short to be useful.
const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

export interface SearchEntry {
  node: HTMLElement;
  name: string;
  haystack: string;
}

// Lowercase + strip accents.
function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

export function tokenize(query: string) {
  return normalize(query).split(/\s+/).filter(Boolean);
}

// Index the cards once: `data-search` is the haystack, the optional `data-name`
// is there for callers that want to rank by it.
export function buildSearchIndex(nodes: HTMLElement[]): SearchEntry[] {
  return nodes.map(node => ({
    node,
    name: normalize(node.dataset.name || ''),
    haystack: normalize(node.dataset.search || ''),
  }));
}

// Every token must appear somewhere in the searchable text. Matches come back
// in index order; ranking, if any, is the caller's job.
export function searchEntries(index: SearchEntry[], query: string) {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  return index.filter(entry =>
    tokens.every(token => entry.haystack.includes(token))
  );
}

// Reflect the active query in the URL (?q=) without adding history entries,
// so searches are shareable and survive a reload.
export function syncSearchParam(query: string | null) {
  const url = new URL(window.location.href);
  if (query) url.searchParams.set('q', query);
  else url.searchParams.delete('q');
  window.history.replaceState({}, '', url);
}

interface SearchInputHandlers {
  onSearch: (query: string) => void;
  onClear: () => void;
}

/**
 * Wire up a search input: debounced live search while typing, immediate search
 * on Enter or on the button, `?q=` kept in sync, and the initial query read
 * back from the URL on load.
 */
export function initSearchInput(
  input: HTMLInputElement,
  button: HTMLElement | null,
  { onSearch, onClear }: SearchInputHandlers
) {
  let searchTimeout: ReturnType<typeof setTimeout>;

  function run(query: string) {
    if (query.length >= MIN_QUERY_LENGTH) {
      onSearch(query);
      syncSearchParam(query);
    } else {
      onClear();
      syncSearchParam(null);
    }
  }

  // Debounced live search as the user types.
  input.addEventListener('input', () => {
    const query = input.value.trim();
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => run(query), DEBOUNCE_MS);
  });

  // "Buscar" button + Enter run the search immediately (skip the debounce).
  const submitSearch = () => {
    clearTimeout(searchTimeout);
    run(input.value.trim());
    input.focus();
  };
  if (button) button.addEventListener('click', submitSearch);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitSearch();
    }
  });

  // Pre-fill and run search from the ?q= URL parameter
  const initialQuery = new URLSearchParams(window.location.search)
    .get('q')
    ?.trim();
  if (initialQuery && initialQuery.length >= MIN_QUERY_LENGTH) {
    input.value = initialQuery;
    run(initialQuery);
  }
}
