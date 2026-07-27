import type {
  MixtureIngredient,
  ClassificationResult,
  ProofStep,
  PhysicalForm,
  MixtureTestData,
} from "./types";

interface PhysicalHazardRule {
  hazardClass: string;
  ingredientCode: string;
  limitPercent: number;
  resultCategory: string;
  resultHCode: string;
  signalWord: "Danger" | "Warning" | "";
  pictogram: string;
  reference: string;
  applicableForms?: PhysicalForm[];
}

const PHYSICAL_HAZARD_RULES: PhysicalHazardRule[] = [
  // Flammable Liquids
  {
    hazardClass: "Flammable Liquid",
    ingredientCode: "Flam. Liq. 1",
    limitPercent: 1,
    resultCategory: "Category 1",
    resultHCode: "H224",
    signalWord: "Danger",
    pictogram: "flame",
    reference: "ICOP Part 2, Section 2.4.6",
    applicableForms: ["liquid"],
  },
  {
    hazardClass: "Flammable Liquid",
    ingredientCode: "Flam. Liq. 2",
    limitPercent: 1,
    resultCategory: "Category 2",
    resultHCode: "H225",
    signalWord: "Danger",
    pictogram: "flame",
    reference: "ICOP Part 2, Section 2.4.6",
    applicableForms: ["liquid"],
  },
  {
    hazardClass: "Flammable Liquid",
    ingredientCode: "Flam. Liq. 3",
    limitPercent: 1,
    resultCategory: "Category 3",
    resultHCode: "H226",
    signalWord: "Warning",
    pictogram: "flame",
    reference: "ICOP Part 2, Section 2.4.6",
    applicableForms: ["liquid"],
  },
  // Flammable Solids
  {
    hazardClass: "Flammable Solid",
    ingredientCode: "Flam. Sol. 1",
    limitPercent: 1,
    resultCategory: "Category 1",
    resultHCode: "H228",
    signalWord: "Danger",
    pictogram: "flame",
    reference: "ICOP Part 2, Section 2.4.7",
    applicableForms: ["solid"],
  },
  {
    hazardClass: "Flammable Solid",
    ingredientCode: "Flam. Sol. 2",
    limitPercent: 1,
    resultCategory: "Category 2",
    resultHCode: "H228",
    signalWord: "Warning",
    pictogram: "flame",
    reference: "ICOP Part 2, Section 2.4.7",
    applicableForms: ["solid"],
  },
  // Flammable Gases
  {
    hazardClass: "Flammable Gas",
    ingredientCode: "Flam. Gas 1",
    limitPercent: 1,
    resultCategory: "Category 1",
    resultHCode: "H220",
    signalWord: "Danger",
    pictogram: "flame",
    reference: "ICOP Part 2, Section 2.4.2",
    applicableForms: ["gas"],
  },
  {
    hazardClass: "Flammable Gas",
    ingredientCode: "Flam. Gas 2",
    limitPercent: 1,
    resultCategory: "Category 2",
    resultHCode: "H221",
    signalWord: "Warning",
    pictogram: "flame",
    reference: "ICOP Part 2, Section 2.4.2",
    applicableForms: ["gas"],
  },
  // Flammable Aerosols
  {
    hazardClass: "Flammable Aerosol",
    ingredientCode: "Flam. Aerosol 1",
    limitPercent: 1,
    resultCategory: "Category 1",
    resultHCode: "H222",
    signalWord: "Danger",
    pictogram: "flame",
    reference: "ICOP Part 2, Section 2.4.3",
    applicableForms: ["aerosol"],
  },
  {
    hazardClass: "Flammable Aerosol",
    ingredientCode: "Flam. Aerosol 2",
    limitPercent: 1,
    resultCategory: "Category 2",
    resultHCode: "H223",
    signalWord: "Warning",
    pictogram: "flame",
    reference: "ICOP Part 2, Section 2.4.3",
    applicableForms: ["aerosol"],
  },
  // Oxidizing Liquids
  {
    hazardClass: "Oxidizing Liquid",
    ingredientCode: "Ox. Liq. 1",
    limitPercent: 1,
    resultCategory: "Category 1",
    resultHCode: "H271",
    signalWord: "Danger",
    pictogram: "flame-over-circle",
    reference: "ICOP Part 2, Section 2.4.13",
    applicableForms: ["liquid"],
  },
  {
    hazardClass: "Oxidizing Liquid",
    ingredientCode: "Ox. Liq. 2",
    limitPercent: 1,
    resultCategory: "Category 2",
    resultHCode: "H272",
    signalWord: "Danger",
    pictogram: "flame-over-circle",
    reference: "ICOP Part 2, Section 2.4.13",
    applicableForms: ["liquid"],
  },
  {
    hazardClass: "Oxidizing Liquid",
    ingredientCode: "Ox. Liq. 3",
    limitPercent: 1,
    resultCategory: "Category 3",
    resultHCode: "H272",
    signalWord: "Warning",
    pictogram: "flame-over-circle",
    reference: "ICOP Part 2, Section 2.4.13",
    applicableForms: ["liquid"],
  },
  // Oxidizing Solids
  {
    hazardClass: "Oxidizing Solid",
    ingredientCode: "Ox. Sol. 1",
    limitPercent: 1,
    resultCategory: "Category 1",
    resultHCode: "H271",
    signalWord: "Danger",
    pictogram: "flame-over-circle",
    reference: "ICOP Part 2, Section 2.4.14",
    applicableForms: ["solid"],
  },
  {
    hazardClass: "Oxidizing Solid",
    ingredientCode: "Ox. Sol. 2",
    limitPercent: 1,
    resultCategory: "Category 2",
    resultHCode: "H272",
    signalWord: "Danger",
    pictogram: "flame-over-circle",
    reference: "ICOP Part 2, Section 2.4.14",
    applicableForms: ["solid"],
  },
  {
    hazardClass: "Oxidizing Solid",
    ingredientCode: "Ox. Sol. 3",
    limitPercent: 1,
    resultCategory: "Category 3",
    resultHCode: "H272",
    signalWord: "Warning",
    pictogram: "flame-over-circle",
    reference: "ICOP Part 2, Section 2.4.14",
    applicableForms: ["solid"],
  },
  // Oxidizing Gases
  {
    hazardClass: "Oxidizing Gas",
    ingredientCode: "Ox. Gas 1",
    limitPercent: 1,
    resultCategory: "Category 1",
    resultHCode: "H270",
    signalWord: "Danger",
    pictogram: "flame-over-circle",
    reference: "ICOP Part 2, Section 2.4.4",
    applicableForms: ["gas"],
  },
  // Self-Reactive Substances
  {
    hazardClass: "Self-Reactive Substance",
    ingredientCode: "Self-react. A",
    limitPercent: 1,
    resultCategory: "Type A",
    resultHCode: "H240",
    signalWord: "Danger",
    pictogram: "exploding-bomb",
    reference: "ICOP Part 2, Section 2.4.8",
  },
  {
    hazardClass: "Self-Reactive Substance",
    ingredientCode: "Self-react. B",
    limitPercent: 1,
    resultCategory: "Type B",
    resultHCode: "H241",
    signalWord: "Danger",
    pictogram: "exploding-bomb",
    reference: "ICOP Part 2, Section 2.4.8",
  },
  {
    hazardClass: "Self-Reactive Substance",
    ingredientCode: "Self-react. C",
    limitPercent: 1,
    resultCategory: "Type C",
    resultHCode: "H242",
    signalWord: "Danger",
    pictogram: "flame",
    reference: "ICOP Part 2, Section 2.4.8",
  },
  {
    hazardClass: "Self-Reactive Substance",
    ingredientCode: "Self-react. D",
    limitPercent: 1,
    resultCategory: "Type D",
    resultHCode: "H242",
    signalWord: "Danger",
    pictogram: "flame",
    reference: "ICOP Part 2, Section 2.4.8",
  },
  // Pyrophoric Liquids/Solids
  {
    hazardClass: "Pyrophoric Liquid",
    ingredientCode: "Pyr. Liq. 1",
    limitPercent: 1,
    resultCategory: "Category 1",
    resultHCode: "H250",
    signalWord: "Danger",
    pictogram: "flame",
    reference: "ICOP Part 2, Section 2.4.9",
    applicableForms: ["liquid"],
  },
  {
    hazardClass: "Pyrophoric Solid",
    ingredientCode: "Pyr. Sol. 1",
    limitPercent: 1,
    resultCategory: "Category 1",
    resultHCode: "H250",
    signalWord: "Danger",
    pictogram: "flame",
    reference: "ICOP Part 2, Section 2.4.10",
    applicableForms: ["solid"],
  },
  // Self-Heating Substances
  {
    hazardClass: "Self-Heating Substance",
    ingredientCode: "Self-heat. 1",
    limitPercent: 1,
    resultCategory: "Category 1",
    resultHCode: "H251",
    signalWord: "Danger",
    pictogram: "flame",
    reference: "ICOP Part 2, Section 2.4.11",
  },
  {
    hazardClass: "Self-Heating Substance",
    ingredientCode: "Self-heat. 2",
    limitPercent: 1,
    resultCategory: "Category 2",
    resultHCode: "H252",
    signalWord: "Warning",
    pictogram: "flame",
    reference: "ICOP Part 2, Section 2.4.11",
  },
  // Water-Reactive Substances
  {
    hazardClass: "Water-Reactive Substance",
    ingredientCode: "Water-react. 1",
    limitPercent: 1,
    resultCategory: "Category 1",
    resultHCode: "H260",
    signalWord: "Danger",
    pictogram: "flame",
    reference: "ICOP Part 2, Section 2.4.12",
  },
  {
    hazardClass: "Water-Reactive Substance",
    ingredientCode: "Water-react. 2",
    limitPercent: 1,
    resultCategory: "Category 2",
    resultHCode: "H261",
    signalWord: "Danger",
    pictogram: "flame",
    reference: "ICOP Part 2, Section 2.4.12",
  },
  {
    hazardClass: "Water-Reactive Substance",
    ingredientCode: "Water-react. 3",
    limitPercent: 1,
    resultCategory: "Category 3",
    resultHCode: "H261",
    signalWord: "Warning",
    pictogram: "flame",
    reference: "ICOP Part 2, Section 2.4.12",
  },
  // Organic Peroxides
  {
    hazardClass: "Organic Peroxide",
    ingredientCode: "Org. Perox. A",
    limitPercent: 1,
    resultCategory: "Type A",
    resultHCode: "H240",
    signalWord: "Danger",
    pictogram: "exploding-bomb",
    reference: "ICOP Part 2, Section 2.4.15",
  },
  {
    hazardClass: "Organic Peroxide",
    ingredientCode: "Org. Perox. B",
    limitPercent: 1,
    resultCategory: "Type B",
    resultHCode: "H241",
    signalWord: "Danger",
    pictogram: "exploding-bomb",
    reference: "ICOP Part 2, Section 2.4.15",
  },
  {
    hazardClass: "Organic Peroxide",
    ingredientCode: "Org. Perox. C",
    limitPercent: 1,
    resultCategory: "Type C",
    resultHCode: "H242",
    signalWord: "Danger",
    pictogram: "flame",
    reference: "ICOP Part 2, Section 2.4.15",
  },
  {
    hazardClass: "Organic Peroxide",
    ingredientCode: "Org. Perox. D",
    limitPercent: 1,
    resultCategory: "Type D",
    resultHCode: "H242",
    signalWord: "Danger",
    pictogram: "flame",
    reference: "ICOP Part 2, Section 2.4.15",
  },
  // Corrosive to Metals
  {
    hazardClass: "Corrosive to Metals",
    ingredientCode: "Met. Corr. 1",
    limitPercent: 1,
    resultCategory: "Category 1",
    resultHCode: "H290",
    signalWord: "Warning",
    pictogram: "corrosion",
    reference: "ICOP Part 2, Section 2.4.16",
  },
  // Explosives
  {
    hazardClass: "Explosive",
    ingredientCode: "Unst. Expl.",
    limitPercent: 1,
    resultCategory: "Unstable Explosive",
    resultHCode: "H200",
    signalWord: "Danger",
    pictogram: "exploding-bomb",
    reference: "ICOP Part 2, Section 2.4.1",
  },
  {
    hazardClass: "Explosive",
    ingredientCode: "Expl. 1.1",
    limitPercent: 1,
    resultCategory: "Division 1.1",
    resultHCode: "H201",
    signalWord: "Danger",
    pictogram: "exploding-bomb",
    reference: "ICOP Part 2, Section 2.4.1",
  },
  {
    hazardClass: "Explosive",
    ingredientCode: "Expl. 1.2",
    limitPercent: 1,
    resultCategory: "Division 1.2",
    resultHCode: "H202",
    signalWord: "Danger",
    pictogram: "exploding-bomb",
    reference: "ICOP Part 2, Section 2.4.1",
  },
  {
    hazardClass: "Explosive",
    ingredientCode: "Expl. 1.3",
    limitPercent: 1,
    resultCategory: "Division 1.3",
    resultHCode: "H203",
    signalWord: "Danger",
    pictogram: "exploding-bomb",
    reference: "ICOP Part 2, Section 2.4.1",
  },
  {
    hazardClass: "Explosive",
    ingredientCode: "Expl. 1.4",
    limitPercent: 1,
    resultCategory: "Division 1.4",
    resultHCode: "H204",
    signalWord: "Warning",
    pictogram: "exploding-bomb",
    reference: "ICOP Part 2, Section 2.4.1",
  },
  // Gases Under Pressure
  {
    hazardClass: "Gas Under Pressure",
    ingredientCode: "Press. Gas",
    limitPercent: 1,
    resultCategory: "Compressed gas",
    resultHCode: "H280",
    signalWord: "Warning",
    pictogram: "gas-cylinder",
    reference: "ICOP Part 2, Section 2.4.5",
    applicableForms: ["gas"],
  },
];

function classifyFlammableLiquidByTestData(
  testData: MixtureTestData,
): ClassificationResult | null {
  const { flashPoint, boilingPoint } = testData;
  if (flashPoint == null) return null;

  const steps: ProofStep[] = [
    { description: "Classify flammable liquid using test data (flash point / boiling point) from SDS Section 9" },
  ];

  steps.push({
    description: `Flash point = ${flashPoint}°C${boilingPoint != null ? `, Boiling point = ${boilingPoint}°C` : ""}`,
  });

  let category: string;
  let hCode: string;
  let signalWord: "Danger" | "Warning";

  if (flashPoint < 23 && boilingPoint != null && boilingPoint <= 35) {
    category = "Category 1";
    hCode = "H224";
    signalWord = "Danger";
    steps.push({
      description: "Compare against Table 2.65 flammable liquid classification criteria",
      calculation: `Flash point (${flashPoint}°C) < 23°C AND Boiling point (${boilingPoint}°C) ≤ 35°C`,
      result: "Flammable Liquid Category 1 (H224)",
    });
  } else if (flashPoint < 23) {
    category = "Category 2";
    hCode = "H225";
    signalWord = "Danger";
    steps.push({
      description: "Compare against Table 2.65 flammable liquid classification criteria",
      calculation: `Flash point (${flashPoint}°C) < 23°C${boilingPoint != null ? ` AND Boiling point (${boilingPoint}°C) > 35°C` : ""}`,
      result: "Flammable Liquid Category 2 (H225)",
    });
  } else if (flashPoint <= 60) {
    category = "Category 3";
    hCode = "H226";
    signalWord = "Warning";
    steps.push({
      description: "Compare against Table 2.65 flammable liquid classification criteria",
      calculation: `23°C ≤ Flash point (${flashPoint}°C) ≤ 60°C`,
      result: "Flammable Liquid Category 3 (H226)",
    });
  } else {
    steps.push({
      description: "Compare against Table 2.65 flammable liquid classification criteria",
      calculation: `Flash point (${flashPoint}°C) > 60°C`,
      result: "Not classified as Flammable Liquid",
    });
    return null;
  }

  return {
    hazardClass: "Flammable Liquid",
    category,
    hCode,
    signalWord,
    pictogram: "flame",
    proof: {
      method: "Test Data Method (ICOP Part 2, Section 2.4.6)",
      steps,
      conclusion: `Mixture classified as Flammable Liquid ${category} - ${hCode}`,
      reference: "ICOP Part 2, Section 2.4.6",
    },
  };
}

export function classifyPhysicalHazards(
  ingredients: MixtureIngredient[],
  physicalForm: PhysicalForm = "liquid",
  testData?: MixtureTestData,
): ClassificationResult[] {
  const results: ClassificationResult[] = [];
  const classifiedHazards = new Set<string>();

  if (physicalForm === "liquid" && testData?.flashPoint != null) {
    const fpResult = classifyFlammableLiquidByTestData(testData);
    if (fpResult) {
      results.push(fpResult);
      classifiedHazards.add("Flammable Liquid");
    }
  }

  for (const rule of PHYSICAL_HAZARD_RULES) {
    if (classifiedHazards.has(rule.hazardClass)) continue;

    if (rule.applicableForms && !rule.applicableForms.includes(physicalForm)) continue;

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
      const steps: ProofStep[] = [
        {
          description: `Check ingredients for ${rule.hazardClass} classification (physical form: ${physicalForm})`,
        },
      ];

      for (const mi of matchingIngredients) {
        steps.push({
          description: `${mi.name}: Ci = ${mi.concentration}%, classified as ${mi.code}`,
        });
      }

      steps.push({
        description: `Check against concentration limit`,
        calculation: `${totalConcentration.toFixed(1)}% ≥ ${rule.limitPercent}% (threshold)`,
        result: `Mixture classified as ${rule.hazardClass} ${rule.resultCategory} (${rule.resultHCode})`,
      });

      results.push({
        hazardClass: rule.hazardClass,
        category: rule.resultCategory,
        hCode: rule.resultHCode,
        signalWord: rule.signalWord,
        pictogram: rule.pictogram,
        proof: {
          method: "Ingredient Classification Method",
          steps,
          conclusion: `Mixture classified as ${rule.hazardClass} ${rule.resultCategory} - ${rule.resultHCode}`,
          reference: rule.reference,
        },
      });

      classifiedHazards.add(rule.hazardClass);
    }
  }

  return results;
}
