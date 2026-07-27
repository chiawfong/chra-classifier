export type PhysicalForm = "liquid" | "solid" | "gas" | "aerosol";

export interface MixtureTestData {
  flashPoint?: number;
  boilingPoint?: number;
  burningRate?: number;
}

export interface Chemical {
  id: number;
  name: string;
  aliases: string[];
  cas: string;
  classifications: ChemicalClassification[];
  signalWord: "Danger" | "Warning" | "";
  source: "ICOP2014" | "ICOP2019" | "PubChem" | "Manual";
  amended: boolean;
  notes: string;
}

export interface ChemicalClassification {
  code: string;
  hCode: string;
  route?: string;
  targetOrgan?: string;
}

export interface MixtureIngredient {
  chemical: Chemical;
  concentration: number; // percentage (0-100)
  ateOral?: number;
  ateDermal?: number;
  ateInhalationGas?: number;
  ateInhalationVapour?: number;
  ateInhalationDust?: number;
}

export interface ClassificationResult {
  hazardClass: string;
  category: string;
  hCode: string;
  signalWord: "Danger" | "Warning" | "";
  pictogram: string;
  proof: ClassificationProof;
}

export interface ClassificationProof {
  method: string;
  formula?: string;
  steps: ProofStep[];
  conclusion: string;
  reference: string;
}

export interface ProofStep {
  description: string;
  calculation?: string;
  result?: string;
}

export interface MixtureClassificationOutput {
  ingredients: MixtureIngredient[];
  results: ClassificationResult[];
  warnings: string[];
  unknownPercentage: number;
  physicalForm: PhysicalForm;
}

export type ExposureRoute = "oral" | "dermal" | "inhalation_gas" | "inhalation_vapour" | "inhalation_dust";

export const ATE_CONVERSION_TABLE: Record<ExposureRoute, Record<number, number>> = {
  oral: { 1: 0.5, 2: 5, 3: 100, 4: 500 },
  dermal: { 1: 5, 2: 50, 3: 300, 4: 1100 },
  inhalation_gas: { 1: 10, 2: 100, 3: 700, 4: 4500 },
  inhalation_vapour: { 1: 0.05, 2: 0.5, 3: 3, 4: 11 },
  inhalation_dust: { 1: 0.005, 2: 0.05, 3: 0.5, 4: 1.5 },
};

export const ACUTE_TOXICITY_THRESHOLDS: Record<ExposureRoute, { cat1: number; cat2: number; cat3: number; cat4: number }> = {
  oral: { cat1: 5, cat2: 50, cat3: 300, cat4: 2000 },
  dermal: { cat1: 50, cat2: 200, cat3: 1000, cat4: 2000 },
  inhalation_gas: { cat1: 100, cat2: 500, cat3: 2500, cat4: 20000 },
  inhalation_vapour: { cat1: 0.5, cat2: 2.0, cat3: 10.0, cat4: 20.0 },
  inhalation_dust: { cat1: 0.05, cat2: 0.5, cat3: 1.0, cat4: 5.0 },
};

export const H_CODE_DESCRIPTIONS: Record<string, string> = {
  H200: "Unstable explosive",
  H201: "Explosive; mass explosion hazard",
  H202: "Explosive; severe projection hazard",
  H203: "Explosive; fire, blast or projection hazard",
  H204: "Fire or projection hazard",
  H205: "May mass explode in fire",
  H220: "Extremely flammable gas",
  H221: "Flammable gas",
  H222: "Extremely flammable aerosol",
  H223: "Flammable aerosol",
  H224: "Extremely flammable liquid and vapour",
  H225: "Highly flammable liquid and vapour",
  H226: "Flammable liquid and vapour",
  H228: "Flammable solid",
  H240: "Heating may cause explosion",
  H241: "Heating may cause fire or explosion",
  H242: "Heating may cause fire",
  H250: "Catches fire spontaneously if exposed to air",
  H251: "Self-heating; may catch fire",
  H252: "Self-heating in large quantities; may catch fire",
  H260: "In contact with water releases flammable gases which may ignite spontaneously",
  H261: "In contact with water releases flammable gases",
  H270: "May cause or intensify fire; oxidizer",
  H271: "May cause fire or explosion; strong oxidizer",
  H272: "May intensify fire; oxidizer",
  H280: "Contains gas under pressure; may explode if heated",
  H281: "Contains refrigerated gas; may cause cryogenic burns or injury",
  H290: "May be corrosive to metals",
  H300: "Fatal if swallowed",
  H301: "Toxic if swallowed",
  H302: "Harmful if swallowed",
  H304: "May be fatal if swallowed and enters airways",
  H310: "Fatal in contact with skin",
  H311: "Toxic in contact with skin",
  H312: "Harmful in contact with skin",
  H314: "Causes severe skin burns and eye damage",
  H315: "Causes skin irritation",
  H317: "May cause an allergic skin reaction",
  H318: "Causes serious eye damage",
  H319: "Causes serious eye irritation",
  H330: "Fatal if inhaled",
  H331: "Toxic if inhaled",
  H332: "Harmful if inhaled",
  H334: "May cause allergy or asthma symptoms or breathing difficulties if inhaled",
  H335: "May cause respiratory irritation",
  H336: "May cause drowsiness or dizziness",
  H340: "May cause genetic defects",
  H341: "Suspected of causing genetic defects",
  H350: "May cause cancer",
  H351: "Suspected of causing cancer",
  H360: "May damage fertility or the unborn child",
  H361: "Suspected of damaging fertility or the unborn child",
  H362: "May cause harm to breast-fed children",
  H370: "Causes damage to organs",
  H371: "May cause damage to organs",
  H372: "Causes damage to organs through prolonged or repeated exposure",
  H373: "May cause damage to organs through prolonged or repeated exposure",
  H400: "Very toxic to aquatic life",
  H410: "Very toxic to aquatic life with long lasting effects",
  H411: "Toxic to aquatic life with long lasting effects",
  H412: "Harmful to aquatic life with long lasting effects",
  H413: "May cause long lasting harmful effects to aquatic life",
  H420: "Harms public health and the environment by destroying ozone in the upper atmosphere",
};

export const PICTOGRAM_MAP: Record<string, string> = {
  "Flam.": "flame",
  "Self-react.": "flame",
  "Pyr.": "flame",
  "Self-heat.": "flame",
  "Water-react.": "flame",
  "Org. Perox.": "flame",
  "Ox.": "flame-over-circle",
  "Expl.": "exploding-bomb",
  "Unst. Expl.": "exploding-bomb",
  "Press. Gas": "gas-cylinder",
  "Met. Corr.": "corrosion",
  "Acute Tox. 1": "skull-crossbones",
  "Acute Tox. 2": "skull-crossbones",
  "Acute Tox. 3": "skull-crossbones",
  "Acute Tox. 4": "exclamation-mark",
  "Skin Corr.": "corrosion",
  "Eye Dam.": "corrosion",
  "Skin Irrit.": "exclamation-mark",
  "Eye Irrit.": "exclamation-mark",
  "Resp. Sens.": "health-hazard",
  "Skin Sens.": "exclamation-mark",
  "Muta.": "health-hazard",
  "Carc.": "health-hazard",
  "Repr.": "health-hazard",
  "STOT SE 1": "health-hazard",
  "STOT SE 2": "health-hazard",
  "STOT SE 3": "exclamation-mark",
  "STOT RE 1": "health-hazard",
  "STOT RE 2": "health-hazard",
  "Asp. Haz.": "health-hazard",
  "Aquatic": "environment",
  "Ozone": "exclamation-mark",
};
