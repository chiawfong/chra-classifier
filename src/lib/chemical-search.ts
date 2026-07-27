import type { Chemical } from "./classification/types";
import { searchByCAS, searchByName } from "./pubchem";

const CAS_REGEX = /^\d{2,7}-\d{2}-\d$/;

let localDb: Chemical[] | null = null;

async function getLocalDb(): Promise<Chemical[]> {
  if (localDb) return localDb;
  try {
    const data = await import("./chemicals-db.json");
    localDb = data.default as Chemical[];
    return localDb;
  } catch {
    localDb = [];
    return [];
  }
}

export async function searchChemical(query: string): Promise<Chemical | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const db = await getLocalDb();

  if (CAS_REGEX.test(trimmed)) {
    const local = db.find((c) => c.cas === trimmed);
    if (local) return local;
    return searchByCAS(trimmed);
  }

  const lowerQuery = trimmed.toLowerCase();
  const local = db.find(
    (c) =>
      c.name.toLowerCase() === lowerQuery ||
      c.aliases.some((a) => a.toLowerCase() === lowerQuery)
  );
  if (local) return local;

  const partialMatches = db.filter(
    (c) =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.aliases.some((a) => a.toLowerCase().includes(lowerQuery))
  );
  if (partialMatches.length === 1) return partialMatches[0];

  return searchByName(trimmed);
}

export async function searchChemicalSuggestions(
  query: string
): Promise<Chemical[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const db = await getLocalDb();
  const lowerQuery = trimmed.toLowerCase();

  const matches = db.filter(
    (c) =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.cas.includes(trimmed) ||
      c.aliases.some((a) => a.toLowerCase().includes(lowerQuery))
  );

  return matches.slice(0, 10);
}
