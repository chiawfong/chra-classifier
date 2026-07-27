import type {
  MixtureIngredient,
  ClassificationResult,
  ProofStep,
  PhysicalForm,
} from "./types";

interface ConcentrationLimitRule {
  hazardClass: string;
  ingredientCode: string;
  limitPercent: number;
  resultCategory: string;
  resultHCode: string;
  signalWord: "Danger" | "Warning";
  pictogram: string;
  reference: string;
  tableRef: string;
}

const CONCENTRATION_LIMIT_RULES: ConcentrationLimitRule[] = [
  // Skin Corrosion / Irritation
  {
    hazardClass: "Skin Corrosion/Irritation",
    ingredientCode: "Skin Corr. 1A",
    limitPercent: 1,
    resultCategory: "Category 1",
    resultHCode: "H314",
    signalWord: "Danger",
    pictogram: "corrosion",
    reference: "ICOP Part 2, Section 2.5.2",
    tableRef: "Table 2.30",
  },
  {
    hazardClass: "Skin Corrosion/Irritation",
    ingredientCode: "Skin Corr. 1B",
    limitPercent: 1,
    resultCategory: "Category 1",
    resultHCode: "H314",
    signalWord: "Danger",
    pictogram: "corrosion",
    reference: "ICOP Part 2, Section 2.5.2",
    tableRef: "Table 2.30",
  },
  {
    hazardClass: "Skin Corrosion/Irritation",
    ingredientCode: "Skin Corr. 1C",
    limitPercent: 1,
    resultCategory: "Category 1",
    resultHCode: "H314",
    signalWord: "Danger",
    pictogram: "corrosion",
    reference: "ICOP Part 2, Section 2.5.2",
    tableRef: "Table 2.30",
  },
  {
    hazardClass: "Skin Corrosion/Irritation",
    ingredientCode: "Skin Irrit. 2",
    limitPercent: 10,
    resultCategory: "Category 2",
    resultHCode: "H315",
    signalWord: "Warning",
    pictogram: "exclamation-mark",
    reference: "ICOP Part 2, Section 2.5.2",
    tableRef: "Table 2.30",
  },
  // Serious Eye Damage / Eye Irritation
  {
    hazardClass: "Serious Eye Damage/Eye Irritation",
    ingredientCode: "Eye Dam. 1",
    limitPercent: 3,
    resultCategory: "Category 1",
    resultHCode: "H318",
    signalWord: "Danger",
    pictogram: "corrosion",
    reference: "ICOP Part 2, Section 2.5.3",
    tableRef: "Table 2.35",
  },
  {
    hazardClass: "Serious Eye Damage/Eye Irritation",
    ingredientCode: "Eye Irrit. 2",
    limitPercent: 10,
    resultCategory: "Category 2",
    resultHCode: "H319",
    signalWord: "Warning",
    pictogram: "exclamation-mark",
    reference: "ICOP Part 2, Section 2.5.3",
    tableRef: "Table 2.35",
  },
  // Respiratory Sensitization
  {
    hazardClass: "Respiratory Sensitization",
    ingredientCode: "Resp. Sens. 1",
    limitPercent: 0.1,
    resultCategory: "Category 1",
    resultHCode: "H334",
    signalWord: "Danger",
    pictogram: "health-hazard",
    reference: "ICOP Part 2, Section 2.5.4",
    tableRef: "Table 2.39",
  },
  // Skin Sensitization
  {
    hazardClass: "Skin Sensitization",
    ingredientCode: "Skin Sens. 1",
    limitPercent: 1,
    resultCategory: "Category 1",
    resultHCode: "H317",
    signalWord: "Warning",
    pictogram: "exclamation-mark",
    reference: "ICOP Part 2, Section 2.5.5",
    tableRef: "Table 2.42",
  },
  // Germ Cell Mutagenicity
  {
    hazardClass: "Germ Cell Mutagenicity",
    ingredientCode: "Muta. 1A",
    limitPercent: 0.1,
    resultCategory: "Category 1",
    resultHCode: "H340",
    signalWord: "Danger",
    pictogram: "health-hazard",
    reference: "ICOP Part 2, Section 2.5.6",
    tableRef: "Table 2.45",
  },
  {
    hazardClass: "Germ Cell Mutagenicity",
    ingredientCode: "Muta. 1B",
    limitPercent: 0.1,
    resultCategory: "Category 1",
    resultHCode: "H340",
    signalWord: "Danger",
    pictogram: "health-hazard",
    reference: "ICOP Part 2, Section 2.5.6",
    tableRef: "Table 2.45",
  },
  {
    hazardClass: "Germ Cell Mutagenicity",
    ingredientCode: "Muta. 2",
    limitPercent: 1,
    resultCategory: "Category 2",
    resultHCode: "H341",
    signalWord: "Warning",
    pictogram: "health-hazard",
    reference: "ICOP Part 2, Section 2.5.6",
    tableRef: "Table 2.45",
  },
  // Carcinogenicity
  {
    hazardClass: "Carcinogenicity",
    ingredientCode: "Carc. 1A",
    limitPercent: 0.1,
    resultCategory: "Category 1A",
    resultHCode: "H350",
    signalWord: "Danger",
    pictogram: "health-hazard",
    reference: "ICOP Part 2, Section 2.5.7",
    tableRef: "Table 2.48",
  },
  {
    hazardClass: "Carcinogenicity",
    ingredientCode: "Carc. 1B",
    limitPercent: 0.1,
    resultCategory: "Category 1B",
    resultHCode: "H350",
    signalWord: "Danger",
    pictogram: "health-hazard",
    reference: "ICOP Part 2, Section 2.5.7",
    tableRef: "Table 2.48",
  },
  {
    hazardClass: "Carcinogenicity",
    ingredientCode: "Carc. 2",
    limitPercent: 1,
    resultCategory: "Category 2",
    resultHCode: "H351",
    signalWord: "Warning",
    pictogram: "health-hazard",
    reference: "ICOP Part 2, Section 2.5.7",
    tableRef: "Table 2.48",
  },
  // Reproductive Toxicity
  {
    hazardClass: "Reproductive Toxicity",
    ingredientCode: "Repr. 1A",
    limitPercent: 0.1,
    resultCategory: "Category 1A",
    resultHCode: "H360",
    signalWord: "Danger",
    pictogram: "health-hazard",
    reference: "ICOP Part 2, Section 2.5.8",
    tableRef: "Table 2.52",
  },
  {
    hazardClass: "Reproductive Toxicity",
    ingredientCode: "Repr. 1B",
    limitPercent: 0.1,
    resultCategory: "Category 1B",
    resultHCode: "H360",
    signalWord: "Danger",
    pictogram: "health-hazard",
    reference: "ICOP Part 2, Section 2.5.8",
    tableRef: "Table 2.52",
  },
  {
    hazardClass: "Reproductive Toxicity",
    ingredientCode: "Repr. 2",
    limitPercent: 1,
    resultCategory: "Category 2",
    resultHCode: "H361",
    signalWord: "Warning",
    pictogram: "health-hazard",
    reference: "ICOP Part 2, Section 2.5.8",
    tableRef: "Table 2.52",
  },
  {
    hazardClass: "Reproductive Toxicity (Lactation)",
    ingredientCode: "Lact.",
    limitPercent: 0.1,
    resultCategory: "Additional category",
    resultHCode: "H362",
    signalWord: "Warning",
    pictogram: "health-hazard",
    reference: "ICOP Part 2, Section 2.5.8",
    tableRef: "Table 2.52",
  },
  // STOT-SE
  {
    hazardClass: "STOT - Single Exposure",
    ingredientCode: "STOT SE 1",
    limitPercent: 1,
    resultCategory: "Category 1",
    resultHCode: "H370",
    signalWord: "Danger",
    pictogram: "health-hazard",
    reference: "ICOP Part 2, Section 2.5.9",
    tableRef: "Table 2.56",
  },
  {
    hazardClass: "STOT - Single Exposure",
    ingredientCode: "STOT SE 2",
    limitPercent: 10,
    resultCategory: "Category 2",
    resultHCode: "H371",
    signalWord: "Warning",
    pictogram: "health-hazard",
    reference: "ICOP Part 2, Section 2.5.9",
    tableRef: "Table 2.56",
  },
  {
    hazardClass: "STOT - Single Exposure",
    ingredientCode: "STOT SE 3",
    limitPercent: 20,
    resultCategory: "Category 3",
    resultHCode: "H335",
    signalWord: "Warning",
    pictogram: "exclamation-mark",
    reference: "ICOP Part 2, Section 2.5.9",
    tableRef: "Table 2.56",
  },
  // STOT-RE
  {
    hazardClass: "STOT - Repeated Exposure",
    ingredientCode: "STOT RE 1",
    limitPercent: 1,
    resultCategory: "Category 1",
    resultHCode: "H372",
    signalWord: "Danger",
    pictogram: "health-hazard",
    reference: "ICOP Part 2, Section 2.5.10",
    tableRef: "Table 2.61",
  },
  {
    hazardClass: "STOT - Repeated Exposure",
    ingredientCode: "STOT RE 2",
    limitPercent: 10,
    resultCategory: "Category 2",
    resultHCode: "H373",
    signalWord: "Warning",
    pictogram: "health-hazard",
    reference: "ICOP Part 2, Section 2.5.10",
    tableRef: "Table 2.61",
  },
  // Aspiration Hazard
  {
    hazardClass: "Aspiration Hazard",
    ingredientCode: "Asp. Haz.",
    limitPercent: 10,
    resultCategory: "Category 1",
    resultHCode: "H304",
    signalWord: "Danger",
    pictogram: "health-hazard",
    reference: "ICOP Part 2, Section 2.5.11",
    tableRef: "",
  },
];

export function classifyByConcentrationLimits(
  ingredients: MixtureIngredient[],
  physicalForm: PhysicalForm = "liquid",
): ClassificationResult[] {
  const results: ClassificationResult[] = [];
  const classifiedHazards = new Set<string>();

  for (const rule of CONCENTRATION_LIMIT_RULES) {
    if (classifiedHazards.has(rule.hazardClass + "|" + rule.resultCategory)) continue;

    if (rule.hazardClass === "Aspiration Hazard" && physicalForm !== "liquid") continue;

    const matchingIngredients: { name: string; concentration: number; code: string }[] = [];
    let totalConcentration = 0;

    for (const ing of ingredients) {
      for (const cls of ing.chemical.classifications) {
        if (cls.code.startsWith(rule.ingredientCode) || cls.code === rule.ingredientCode) {
          matchingIngredients.push({
            name: ing.chemical.name,
            concentration: ing.concentration,
            code: cls.code,
          });
          totalConcentration += ing.concentration;
          break;
        }
      }
    }

    if (totalConcentration >= rule.limitPercent) {
      const tableNote = rule.tableRef ? ` (${rule.tableRef})` : "";
      const steps: ProofStep[] = [
        {
          description: `Check concentration limits for ${rule.hazardClass}${tableNote}`,
        },
      ];

      for (const mi of matchingIngredients) {
        steps.push({
          description: `${mi.name}: Ci = ${mi.concentration}%, classified as ${mi.code}`,
        });
      }

      const isAdditivity = needsAdditivity(rule.hazardClass);

      steps.push({
        description: isAdditivity
          ? `Sum of ${rule.ingredientCode} ingredients`
          : `Check against concentration limit${rule.tableRef ? ` from ${rule.tableRef}` : ""}`,
        calculation: `${totalConcentration.toFixed(1)}% ≥ ${rule.limitPercent}% (limit${rule.tableRef ? ` per ${rule.tableRef}` : ""})`,
        result: `Mixture classified as ${rule.hazardClass} ${rule.resultCategory} (${rule.resultHCode})`,
      });

      const refParts = [rule.reference];
      if (rule.tableRef) refParts.push(rule.tableRef);

      results.push({
        hazardClass: rule.hazardClass,
        category: rule.resultCategory,
        hCode: rule.resultHCode,
        signalWord: rule.signalWord,
        pictogram: rule.pictogram,
        proof: {
          method: `Concentration Limit Method`,
          steps,
          conclusion: `Mixture classified as ${rule.hazardClass} ${rule.resultCategory} - ${rule.resultHCode}`,
          reference: refParts.join(", "),
        },
      });

      classifiedHazards.add(rule.hazardClass + "|" + rule.resultCategory);
    }
  }

  return deduplicateByHazardClass(results);
}

function needsAdditivity(hazardClass: string): boolean {
  return ["Skin Corrosion/Irritation", "Serious Eye Damage/Eye Irritation"].includes(hazardClass);
}

function deduplicateByHazardClass(results: ClassificationResult[]): ClassificationResult[] {
  const byClass = new Map<string, ClassificationResult>();

  for (const r of results) {
    const existing = byClass.get(r.hazardClass);
    if (!existing || isMorSevere(r.category, existing.category)) {
      byClass.set(r.hazardClass, r);
    }
  }

  return Array.from(byClass.values());
}

function isMorSevere(a: string, b: string): boolean {
  const severityOrder = [
    "Category 1A", "Category 1B", "Category 1C", "Category 1",
    "Category 2", "Category 3", "Additional category",
  ];
  const idxA = severityOrder.indexOf(a);
  const idxB = severityOrder.indexOf(b);
  if (idxA === -1) return false;
  if (idxB === -1) return true;
  return idxA < idxB;
}
