import type {
  MixtureIngredient,
  ClassificationResult,
  MixtureClassificationOutput,
  PhysicalForm,
  MixtureTestData,
} from "./types";
import { classifyAcuteToxicity } from "./acute-toxicity";
import { classifyByConcentrationLimits } from "./concentration-limits";
import { classifyPhysicalHazards } from "./physical-hazards";
import { classifyEnvironmentalHazards } from "./environmental-hazards";

export function classifyMixture(
  ingredients: MixtureIngredient[],
  physicalForm: PhysicalForm = "liquid",
  testData?: MixtureTestData,
): MixtureClassificationOutput {
  const warnings: string[] = [];

  const totalConcentration = ingredients.reduce(
    (sum, i) => sum + i.concentration,
    0
  );
  if (totalConcentration > 100.5) {
    warnings.push(
      `Total concentration is ${totalConcentration.toFixed(1)}%, which exceeds 100%. Please verify your inputs.`
    );
  }

  const unknownPercentage = ingredients
    .filter((i) => i.chemical.classifications.length === 0)
    .reduce((sum, i) => sum + i.concentration, 0);

  if (unknownPercentage > 0) {
    warnings.push(
      `${unknownPercentage.toFixed(1)}% of the mixture consists of ingredient(s) with unknown hazard classification.`
    );
  }

  const relevantIngredients = ingredients.filter((i) => i.concentration >= 1);
  const subThresholdIngredients = ingredients.filter(
    (i) =>
      i.concentration < 1 &&
      i.chemical.classifications.some(
        (c) =>
          c.code.startsWith("Acute Tox. 1") ||
          c.code.startsWith("Acute Tox. 2") ||
          c.code.startsWith("Carc. 1") ||
          c.code.startsWith("Muta. 1") ||
          c.code.startsWith("Repr. 1") ||
          c.code.startsWith("Resp. Sens.")
      )
  );

  if (subThresholdIngredients.length > 0) {
    for (const ing of subThresholdIngredients) {
      if (!relevantIngredients.includes(ing)) {
        relevantIngredients.push(ing);
        warnings.push(
          `${ing.chemical.name} (${ing.concentration}%) is below 1% but included due to high hazard classification.`
        );
      }
    }
  }

  const allResults: ClassificationResult[] = [];

  const acuteToxResults = classifyAcuteToxicity(relevantIngredients, physicalForm);
  allResults.push(...acuteToxResults);

  const concLimitResults = classifyByConcentrationLimits(relevantIngredients, physicalForm);
  allResults.push(...concLimitResults);

  const physicalResults = classifyPhysicalHazards(relevantIngredients, physicalForm, testData);
  allResults.push(...physicalResults);

  const envResults = classifyEnvironmentalHazards(relevantIngredients);
  allResults.push(...envResults);

  const deduped = deduplicateResults(allResults);

  return {
    ingredients,
    results: deduped,
    warnings,
    unknownPercentage,
    physicalForm,
  };
}

function deduplicateResults(
  results: ClassificationResult[]
): ClassificationResult[] {
  const byClass = new Map<string, ClassificationResult>();

  for (const r of results) {
    const key = r.hazardClass;
    const existing = byClass.get(key);
    if (!existing) {
      byClass.set(key, r);
    }
  }

  return Array.from(byClass.values());
}

export { type MixtureIngredient, type ClassificationResult, type MixtureClassificationOutput, type PhysicalForm, type MixtureTestData } from "./types";
export type { Chemical, ChemicalClassification } from "./types";
export { H_CODE_DESCRIPTIONS } from "./types";
