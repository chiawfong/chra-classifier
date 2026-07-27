import type { Chemical, ChemicalClassification } from "./classification/types";

const PUBCHEM_BASE = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";
const PUBCHEM_VIEW = "https://pubchem.ncbi.nlm.nih.gov/rest/pug_view";

interface PubChemCompound {
  CID: number;
  MolecularFormula?: string;
  MolecularWeight?: string;
  IUPACName?: string;
}

interface PubChemGHSInfo {
  hCodes: string[];
  signalWord: string;
  classifications: string[];
}

export async function searchByCAS(cas: string): Promise<Chemical | null> {
  try {
    const cidRes = await fetch(
      `${PUBCHEM_BASE}/compound/name/${encodeURIComponent(cas)}/cids/JSON`
    );
    if (!cidRes.ok) return null;

    const cidData = await cidRes.json();
    const cid = cidData?.IdentifierList?.CID?.[0];
    if (!cid) return null;

    const [propData, ghsData] = await Promise.all([
      fetchProperties(cid),
      fetchGHSData(cid),
    ]);

    const name =
      propData?.IUPACName || cas;

    const synonyms = await fetchSynonyms(cid);

    const classifications: ChemicalClassification[] = [];
    if (ghsData) {
      for (const hCode of ghsData.hCodes) {
        const code = mapHCodeToClassification(hCode);
        if (code) {
          classifications.push({ code, hCode });
        }
      }
    }

    return {
      id: cid,
      name: synonyms[0] || name,
      aliases: synonyms.slice(1, 5),
      cas,
      classifications,
      signalWord: (ghsData?.signalWord as "Danger" | "Warning") || "",
      source: "PubChem",
      amended: false,
      notes: `Retrieved from PubChem (CID: ${cid})`,
    };
  } catch {
    return null;
  }
}

export async function searchByName(name: string): Promise<Chemical | null> {
  try {
    const cidRes = await fetch(
      `${PUBCHEM_BASE}/compound/name/${encodeURIComponent(name)}/cids/JSON`
    );
    if (!cidRes.ok) return null;

    const cidData = await cidRes.json();
    const cid = cidData?.IdentifierList?.CID?.[0];
    if (!cid) return null;

    const propData = await fetchProperties(cid);
    const ghsData = await fetchGHSData(cid);
    const synonyms = await fetchSynonyms(cid);

    const cas = await fetchCAS(cid);

    const classifications: ChemicalClassification[] = [];
    if (ghsData) {
      for (const hCode of ghsData.hCodes) {
        const code = mapHCodeToClassification(hCode);
        if (code) {
          classifications.push({ code, hCode });
        }
      }
    }

    return {
      id: cid,
      name: synonyms[0] || propData?.IUPACName || name,
      aliases: synonyms.slice(1, 5),
      cas: cas || "",
      classifications,
      signalWord: (ghsData?.signalWord as "Danger" | "Warning") || "",
      source: "PubChem",
      amended: false,
      notes: `Retrieved from PubChem (CID: ${cid})`,
    };
  } catch {
    return null;
  }
}

async function fetchProperties(
  cid: number
): Promise<PubChemCompound | null> {
  try {
    const res = await fetch(
      `${PUBCHEM_BASE}/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,IUPACName/JSON`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.PropertyTable?.Properties?.[0] || null;
  } catch {
    return null;
  }
}

async function fetchGHSData(cid: number): Promise<PubChemGHSInfo | null> {
  try {
    const res = await fetch(
      `${PUBCHEM_VIEW}/data/compound/${cid}/JSON?heading=GHS+Classification`
    );
    if (!res.ok) return null;
    const data = await res.json();

    const hCodes = new Set<string>();
    let signalWord = "";
    const classifications: string[] = [];

    const extractStrings = (obj: unknown): void => {
      if (!obj || typeof obj !== "object") return;
      if (Array.isArray(obj)) {
        for (const item of obj) extractStrings(item);
        return;
      }
      const record = obj as Record<string, unknown>;
      if (typeof record.String === "string") {
        const str = record.String;
        const hMatch = str.match(/H\d{3}/g);
        if (hMatch) {
          for (const h of hMatch) hCodes.add(h);
        }
        if (str === "Danger" || str === "Warning") {
          signalWord = str;
        }
      }
      for (const val of Object.values(record)) {
        extractStrings(val);
      }
    };

    extractStrings(data);

    return {
      hCodes: Array.from(hCodes),
      signalWord,
      classifications,
    };
  } catch {
    return null;
  }
}

async function fetchSynonyms(cid: number): Promise<string[]> {
  try {
    const res = await fetch(
      `${PUBCHEM_BASE}/compound/cid/${cid}/synonyms/JSON`
    );
    if (!res.ok) return [];
    const data = await res.json();
    const synonyms: string[] =
      data?.InformationList?.Information?.[0]?.Synonym || [];
    return synonyms.slice(0, 10);
  } catch {
    return [];
  }
}

async function fetchCAS(cid: number): Promise<string | null> {
  const synonyms = await fetchSynonyms(cid);
  const casPattern = /^\d{2,7}-\d{2}-\d$/;
  return synonyms.find((s) => casPattern.test(s)) || null;
}

function mapHCodeToClassification(hCode: string): string | null {
  const map: Record<string, string> = {
    H200: "Unst. Expl.",
    H201: "Expl. 1.1",
    H202: "Expl. 1.2",
    H203: "Expl. 1.3",
    H204: "Expl. 1.4",
    H205: "Expl. 1.5",
    H220: "Flam. Gas 1",
    H221: "Flam. Gas 2",
    H222: "Flam. Aerosol 1",
    H223: "Flam. Aerosol 2",
    H224: "Flam. Liq. 1",
    H225: "Flam. Liq. 2",
    H226: "Flam. Liq. 3",
    H228: "Flam. Sol. 1",
    H240: "Self-react. A",
    H241: "Self-react. B",
    H242: "Self-react. CD",
    H250: "Pyr. Liq. 1",
    H251: "Self-heat. 1",
    H252: "Self-heat. 2",
    H260: "Water-react. 1",
    H261: "Water-react. 2",
    H270: "Ox. Gas 1",
    H271: "Ox. Liq. 1",
    H272: "Ox. Liq. 2",
    H280: "Press. Gas",
    H281: "Press. Gas",
    H290: "Met. Corr. 1",
    H300: "Acute Tox. 1 (oral)",
    H301: "Acute Tox. 3 (oral)",
    H302: "Acute Tox. 4 (oral)",
    H304: "Asp. Haz.",
    H310: "Acute Tox. 1 (dermal)",
    H311: "Acute Tox. 3 (dermal)",
    H312: "Acute Tox. 4 (dermal)",
    H314: "Skin Corr. 1A",
    H315: "Skin Irrit. 2",
    H317: "Skin Sens. 1",
    H318: "Eye Dam. 1",
    H319: "Eye Irrit. 2",
    H330: "Acute Tox. 1 (inh)",
    H331: "Acute Tox. 3 (inh)",
    H332: "Acute Tox. 4 (inh)",
    H334: "Resp. Sens. 1",
    H335: "STOT SE 3",
    H336: "STOT SE 3",
    H340: "Muta. 1B",
    H341: "Muta. 2",
    H350: "Carc. 1B",
    H351: "Carc. 2",
    H360: "Repr. 1B",
    H361: "Repr. 2",
    H362: "Lact.",
    H370: "STOT SE 1",
    H371: "STOT SE 2",
    H372: "STOT RE 1",
    H373: "STOT RE 2",
    H400: "Aquatic Acute 1",
    H410: "Aquatic Chronic 1",
    H411: "Aquatic Chronic 2",
    H412: "Aquatic Chronic 3",
    H413: "Aquatic Chronic 4",
    H420: "Ozone 1",
  };
  return map[hCode] || null;
}
