import type {
  MixtureIngredient,
  ClassificationResult,
  ProofStep,
} from "./types";

interface AquaticToxRule {
  ingredientCode: string;
  acuteMultiplier: number;
  chronicMultiplier: number;
}

const AQUATIC_ACUTE_MULTIPLIERS: AquaticToxRule[] = [
  { ingredientCode: "Aquatic Acute 1", acuteMultiplier: 1, chronicMultiplier: 0 },
];

const AQUATIC_CHRONIC_MULTIPLIERS: AquaticToxRule[] = [
  { ingredientCode: "Aquatic Chronic 1", acuteMultiplier: 0, chronicMultiplier: 1 },
  { ingredientCode: "Aquatic Chronic 2", acuteMultiplier: 0, chronicMultiplier: 10 },
  { ingredientCode: "Aquatic Chronic 3", acuteMultiplier: 0, chronicMultiplier: 100 },
];

export function classifyEnvironmentalHazards(
  ingredients: MixtureIngredient[]
): ClassificationResult[] {
  const results: ClassificationResult[] = [];

  const acuteResult = classifyAquaticAcute(ingredients);
  if (acuteResult) results.push(acuteResult);

  const chronicResult = classifyAquaticChronic(ingredients);
  if (chronicResult) results.push(chronicResult);

  const ozoneResult = classifyOzoneLayer(ingredients);
  if (ozoneResult) results.push(ozoneResult);

  return results;
}

function classifyAquaticAcute(
  ingredients: MixtureIngredient[]
): ClassificationResult | null {
  const steps: ProofStep[] = [];
  let sumAcute = 0;
  const terms: { name: string; concentration: number; code: string }[] = [];

  steps.push({
    description: "Identify ingredients with Aquatic Acute toxicity classification (Table 2.70)",
  });

  for (const ing of ingredients) {
    for (const cls of ing.chemical.classifications) {
      if (cls.code === "Aquatic Acute 1") {
        terms.push({
          name: ing.chemical.name,
          concentration: ing.concentration,
          code: cls.code,
        });
        sumAcute += ing.concentration * 1;
        steps.push({
          description: `${ing.chemical.name}: Ci = ${ing.concentration}%, classified as ${cls.code}`,
          calculation: `Contribution = ${ing.concentration} × M-factor(1) = ${ing.concentration}`,
        });
        break;
      }
    }
  }

  if (terms.length === 0) return null;

  steps.push({
    description: "Sum weighted concentrations for Aquatic Acute",
    calculation: `Σ(Ci × Mi) = ${sumAcute.toFixed(1)}%`,
  });

  if (sumAcute >= 25) {
    steps.push({
      description: "Compare against Table 2.70 threshold",
      calculation: `${sumAcute.toFixed(1)}% ≥ 25% (Category 1 threshold per Table 2.70)`,
      result: "Mixture classified as Aquatic Acute 1 (H400)",
    });

    return {
      hazardClass: "Hazardous to Aquatic Environment (Acute)",
      category: "Category 1",
      hCode: "H400",
      signalWord: "Warning",
      pictogram: "environment",
      proof: {
        method: "Summation Method (ICOP Part 2, Section 2.6.1)",
        formula: "Σ(Ci × Mi) ≥ 25%",
        steps,
        conclusion: "Mixture classified as Aquatic Acute 1 - H400",
        reference: "ICOP Part 2, Section 2.6.1",
      },
    };
  }

  steps.push({
    description: "Compare against Table 2.70 threshold",
    calculation: `${sumAcute.toFixed(1)}% < 25% (Category 1 threshold per Table 2.70)`,
    result: "Not classified for Aquatic Acute toxicity",
  });

  return null;
}

function classifyAquaticChronic(
  ingredients: MixtureIngredient[]
): ClassificationResult | null {
  const steps: ProofStep[] = [];
  let sumChronic1 = 0;
  let sumChronic2 = 0;
  let sumChronic3 = 0;
  const terms: { name: string; concentration: number; code: string; tier: number }[] = [];

  steps.push({
    description: "Identify ingredients with Aquatic Chronic toxicity classification (Table 2.70)",
  });

  for (const ing of ingredients) {
    for (const cls of ing.chemical.classifications) {
      if (cls.code === "Aquatic Chronic 1") {
        terms.push({ name: ing.chemical.name, concentration: ing.concentration, code: cls.code, tier: 1 });
        sumChronic1 += ing.concentration;
        sumChronic2 += ing.concentration;
        sumChronic3 += ing.concentration;
        steps.push({
          description: `${ing.chemical.name}: Ci = ${ing.concentration}%, classified as ${cls.code}`,
        });
        break;
      } else if (cls.code === "Aquatic Chronic 2") {
        terms.push({ name: ing.chemical.name, concentration: ing.concentration, code: cls.code, tier: 2 });
        sumChronic2 += ing.concentration;
        sumChronic3 += ing.concentration;
        steps.push({
          description: `${ing.chemical.name}: Ci = ${ing.concentration}%, classified as ${cls.code}`,
        });
        break;
      } else if (cls.code === "Aquatic Chronic 3") {
        terms.push({ name: ing.chemical.name, concentration: ing.concentration, code: cls.code, tier: 3 });
        sumChronic3 += ing.concentration;
        steps.push({
          description: `${ing.chemical.name}: Ci = ${ing.concentration}%, classified as ${cls.code}`,
        });
        break;
      } else if (cls.code === "Aquatic Chronic 4") {
        terms.push({ name: ing.chemical.name, concentration: ing.concentration, code: cls.code, tier: 4 });
        steps.push({
          description: `${ing.chemical.name}: Ci = ${ing.concentration}%, classified as ${cls.code}`,
        });
        break;
      }
    }
  }

  if (terms.length === 0) return null;

  steps.push({
    description: "Calculate cumulative sums by tier",
    calculation: `Chronic 1 sum = ${sumChronic1.toFixed(1)}% | Chronic 1+2 sum = ${sumChronic2.toFixed(1)}% | Chronic 1+2+3 sum = ${sumChronic3.toFixed(1)}%`,
  });

  if (sumChronic1 >= 25) {
    steps.push({
      description: "Compare against Chronic 1 threshold (Table 2.70)",
      calculation: `${sumChronic1.toFixed(1)}% ≥ 25%`,
      result: "Mixture classified as Aquatic Chronic 1 (H410)",
    });
    return makeChronicResult("Category 1", "H410", "Very toxic to aquatic life with long lasting effects", steps);
  }

  if (sumChronic2 >= 25) {
    steps.push({
      description: "Compare against Chronic 2 threshold (Table 2.70)",
      calculation: `Σ(Chronic 1 + 2) = ${sumChronic2.toFixed(1)}% ≥ 25%`,
      result: "Mixture classified as Aquatic Chronic 2 (H411)",
    });
    return makeChronicResult("Category 2", "H411", "Toxic to aquatic life with long lasting effects", steps);
  }

  if (sumChronic3 >= 25) {
    steps.push({
      description: "Compare against Chronic 3 threshold (Table 2.70)",
      calculation: `Σ(Chronic 1 + 2 + 3) = ${sumChronic3.toFixed(1)}% ≥ 25%`,
      result: "Mixture classified as Aquatic Chronic 3 (H412)",
    });
    return makeChronicResult("Category 3", "H412", "Harmful to aquatic life with long lasting effects", steps);
  }

  const sumAll = terms.reduce((s, t) => s + t.concentration, 0);
  if (sumAll >= 25) {
    steps.push({
      description: "Compare against Chronic 4 threshold (Table 2.70)",
      calculation: `Σ(all chronic ingredients) = ${sumAll.toFixed(1)}% ≥ 25%`,
      result: "Mixture classified as Aquatic Chronic 4 (H413)",
    });
    return makeChronicResult("Category 4", "H413", "May cause long lasting harmful effects to aquatic life", steps);
  }

  steps.push({
    description: "No chronic threshold met",
    result: "Not classified for Aquatic Chronic toxicity",
  });

  return null;
}

function makeChronicResult(
  category: string,
  hCode: string,
  description: string,
  steps: ProofStep[]
): ClassificationResult {
  return {
    hazardClass: "Hazardous to Aquatic Environment (Chronic)",
    category,
    hCode,
    signalWord: category === "Category 1" || category === "Category 2" ? "Warning" : "",
    pictogram: "environment",
    proof: {
      method: "Summation Method (ICOP Part 2, Section 2.6.1)",
      formula: "Σ(Ci) by chronic tier ≥ 25%",
      steps,
      conclusion: `Mixture classified as Aquatic Chronic ${category} - ${hCode}`,
      reference: "ICOP Part 2, Section 2.6.1",
    },
  };
}

function classifyOzoneLayer(
  ingredients: MixtureIngredient[]
): ClassificationResult | null {
  const steps: ProofStep[] = [];
  let totalOzone = 0;
  const matchingIngredients: { name: string; concentration: number }[] = [];

  steps.push({
    description: "Identify ingredients classified as Ozone layer hazard",
  });

  for (const ing of ingredients) {
    for (const cls of ing.chemical.classifications) {
      if (cls.code.startsWith("Ozone")) {
        matchingIngredients.push({
          name: ing.chemical.name,
          concentration: ing.concentration,
        });
        totalOzone += ing.concentration;
        steps.push({
          description: `${ing.chemical.name}: Ci = ${ing.concentration}%, classified as ${cls.code}`,
        });
        break;
      }
    }
  }

  if (matchingIngredients.length === 0) return null;

  if (totalOzone >= 0.1) {
    steps.push({
      description: "Compare against Table 2.71 concentration limit",
      calculation: `${totalOzone.toFixed(2)}% ≥ 0.1% (threshold per Table 2.71)`,
      result: "Mixture classified as Hazardous to Ozone Layer Category 1 (H420)",
    });

    return {
      hazardClass: "Hazardous to Ozone Layer",
      category: "Category 1",
      hCode: "H420",
      signalWord: "Warning",
      pictogram: "exclamation-mark",
      proof: {
        method: "Concentration Limit Method",
        steps,
        conclusion: "Mixture classified as Hazardous to Ozone Layer Category 1 - H420",
        reference: "ICOP Part 2, Section 2.6.2",
      },
    };
  }

  return null;
}
