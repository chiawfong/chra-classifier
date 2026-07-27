import {
  type MixtureIngredient,
  type ClassificationResult,
  type ProofStep,
  type ExposureRoute,
  type PhysicalForm,
  ATE_CONVERSION_TABLE,
  ACUTE_TOXICITY_THRESHOLDS,
} from "./types";

function getATEFromCategory(category: number, route: ExposureRoute): number {
  return ATE_CONVERSION_TABLE[route][category] ?? 0;
}

function extractAcuteToxCategory(code: string): number | null {
  const match = code.match(/Acute Tox\.\s*(\d)/);
  return match ? parseInt(match[1]) : null;
}

function extractRoute(code: string): string | null {
  if (code.includes("(oral)")) return "oral";
  if (code.includes("(dermal)")) return "dermal";
  if (code.includes("(inh)")) return "inhalation";
  return null;
}

function routeMatches(clsRoute: string | null, targetRoute: ExposureRoute): boolean {
  if (!clsRoute) return false;
  if (clsRoute === targetRoute) return true;
  if (clsRoute === "inhalation" && targetRoute.startsWith("inhalation_")) return true;
  return false;
}

function getCategoryFromATE(ate: number, route: ExposureRoute): number | null {
  const t = ACUTE_TOXICITY_THRESHOLDS[route];
  if (ate <= t.cat1) return 1;
  if (ate <= t.cat2) return 2;
  if (ate <= t.cat3) return 3;
  if (ate <= t.cat4) return 4;
  return null;
}

function getHCode(route: ExposureRoute, category: number): string {
  const routeMap: Record<string, Record<number, string>> = {
    oral: { 1: "H300", 2: "H300", 3: "H301", 4: "H302" },
    dermal: { 1: "H310", 2: "H310", 3: "H311", 4: "H312" },
    inhalation_gas: { 1: "H330", 2: "H330", 3: "H331", 4: "H332" },
    inhalation_vapour: { 1: "H330", 2: "H330", 3: "H331", 4: "H332" },
    inhalation_dust: { 1: "H330", 2: "H330", 3: "H331", 4: "H332" },
  };
  return routeMap[route]?.[category] ?? "";
}

function getSignalWord(category: number): "Danger" | "Warning" {
  return category <= 3 ? "Danger" : "Warning";
}

function getPictogram(category: number): string {
  return category <= 3 ? "skull-crossbones" : "exclamation-mark";
}

function getRouteLabel(route: ExposureRoute): string {
  const labels: Record<ExposureRoute, string> = {
    oral: "Oral",
    dermal: "Dermal",
    inhalation_gas: "Inhalation (gases)",
    inhalation_vapour: "Inhalation (vapours)",
    inhalation_dust: "Inhalation (dusts/mists)",
  };
  return labels[route];
}

function getRouteUnit(route: ExposureRoute): string {
  const units: Record<ExposureRoute, string> = {
    oral: "mg/kg bw",
    dermal: "mg/kg bw",
    inhalation_gas: "ppmV",
    inhalation_vapour: "mg/l",
    inhalation_dust: "mg/l",
  };
  return units[route];
}

function getInhalationRoute(physicalForm: PhysicalForm): ExposureRoute {
  switch (physicalForm) {
    case "gas": return "inhalation_gas";
    case "solid": return "inhalation_dust";
    case "aerosol": return "inhalation_dust";
    case "liquid":
    default: return "inhalation_vapour";
  }
}

export function classifyAcuteToxicity(
  ingredients: MixtureIngredient[],
  physicalForm: PhysicalForm = "liquid",
): ClassificationResult[] {
  const results: ClassificationResult[] = [];
  const inhalationRoute = getInhalationRoute(physicalForm);
  const routes: ExposureRoute[] = ["oral", "dermal", inhalationRoute];

  for (const route of routes) {
    const result = classifyForRoute(ingredients, route);
    if (result) results.push(result);
  }

  return results;
}

function classifyForRoute(
  ingredients: MixtureIngredient[],
  route: ExposureRoute
): ClassificationResult | null {
  const steps: ProofStep[] = [];
  let totalKnownConcentration = 0;
  let unknownConcentration = 0;
  const terms: { name: string; concentration: number; ate: number }[] = [];

  // Step 1: Identify ingredients and their ATE values
  steps.push({
    description: `Identify ingredients with acute toxicity data for ${getRouteLabel(route)} route`,
  });

  for (const ing of ingredients) {
    const acuteClassifications = ing.chemical.classifications.filter(
      (c) => c.code.startsWith("Acute Tox.")
    );

    let foundForRoute = false;
    for (const cls of acuteClassifications) {
      const cat = extractAcuteToxCategory(cls.code);
      const clsRoute = extractRoute(cls.code);

      if (cat && routeMatches(clsRoute, route)) {
        let ate: number;
        let ateSource: string;
        if (route === "oral" && ing.ateOral) {
          ate = ing.ateOral;
          ateSource = "from LD50/LC50 data";
        } else if (route === "dermal" && ing.ateDermal) {
          ate = ing.ateDermal;
          ateSource = "from LD50/LC50 data";
        } else {
          ate = getATEFromCategory(cat, route);
          ateSource = `converted from Category ${cat} using Table 2.26`;
        }

        terms.push({
          name: ing.chemical.name,
          concentration: ing.concentration,
          ate,
        });
        totalKnownConcentration += ing.concentration;
        foundForRoute = true;

        steps.push({
          description: `${ing.chemical.name}: Ci = ${ing.concentration}%, Acute Tox. ${cat} (${getRouteLabel(route)})`,
          calculation: `ATEi = ${ate} ${getRouteUnit(route)} (${ateSource})`,
        });
        break;
      }
    }

    if (!foundForRoute) {
      const hasAnyClassification = ing.chemical.classifications.length > 0;
      if (hasAnyClassification) {
        totalKnownConcentration += ing.concentration;
        steps.push({
          description: `${ing.chemical.name}: ${ing.concentration}% - not classified for ${getRouteLabel(route)} route (excluded from calculation)`,
        });
      } else {
        unknownConcentration += ing.concentration;
        steps.push({
          description: `${ing.chemical.name}: ${ing.concentration}% - unknown toxicity data`,
        });
      }
    }
  }

  if (terms.length === 0) {
    return null;
  }

  // Step 2: Apply additivity formula
  let sumCiOverATEi = 0;
  const formulaParts: string[] = [];
  const formulaValues: string[] = [];
  for (const term of terms) {
    const ratio = term.concentration / term.ate;
    sumCiOverATEi += ratio;
    formulaParts.push(`(${term.concentration}/${term.ate})`);
    formulaValues.push(ratio.toFixed(4));
  }

  let ateMix: number;
  let formulaUsed: string;

  if (unknownConcentration > 10) {
    const adjustedNumerator = 100 - unknownConcentration;
    ateMix = adjustedNumerator / sumCiOverATEi;
    formulaUsed = `(100 - ${unknownConcentration}) / ATEmix = Σ(Ci/ATEi)`;

    steps.push({
      description: `Unknown ingredients = ${unknownConcentration}% (>10%), using adjusted formula per ICOP 2.5.1.7.2.3`,
      calculation: `Σ(Ci/ATEi) = ${formulaParts.join(" + ")} = ${formulaValues.join(" + ")} = ${sumCiOverATEi.toFixed(4)}`,
    });
  } else {
    ateMix = 100 / sumCiOverATEi;
    formulaUsed = `100 / ATEmix = Σ(Ci/ATEi)`;

    steps.push({
      description: `Apply additivity formula: 100 / ATEmix = Σ(Ci/ATEi)`,
      calculation: `Σ(Ci/ATEi) = ${formulaParts.join(" + ")} = ${formulaValues.join(" + ")} = ${sumCiOverATEi.toFixed(4)}`,
    });
  }

  // Step 3: Calculate ATEmix
  steps.push({
    description: `Calculate ATEmix`,
    calculation: unknownConcentration > 10
      ? `ATEmix = (100 - ${unknownConcentration}) / ${sumCiOverATEi.toFixed(4)} = ${ateMix.toFixed(1)} ${getRouteUnit(route)}`
      : `ATEmix = 100 / ${sumCiOverATEi.toFixed(4)} = ${ateMix.toFixed(1)} ${getRouteUnit(route)}`,
    result: `ATEmix = ${ateMix.toFixed(1)} ${getRouteUnit(route)}`,
  });

  // Step 4: Compare against thresholds
  const category = getCategoryFromATE(ateMix, route);

  if (!category) {
    const thresholds = ACUTE_TOXICITY_THRESHOLDS[route];
    steps.push({
      description: `Compare ATEmix with Table 2.25 thresholds for ${getRouteLabel(route)}`,
      calculation: `ATEmix = ${ateMix.toFixed(1)} > ${thresholds.cat4} (Cat 4 upper limit)`,
      result: "Not classified — ATEmix exceeds all category thresholds",
    });
    return null;
  }

  const thresholds = ACUTE_TOXICITY_THRESHOLDS[route];
  const catThreshold = [thresholds.cat1, thresholds.cat2, thresholds.cat3, thresholds.cat4][category - 1];
  const prevThreshold = category > 1
    ? [0, thresholds.cat1, thresholds.cat2, thresholds.cat3][category - 1]
    : 0;

  steps.push({
    description: `Compare ATEmix with Table 2.25 thresholds for ${getRouteLabel(route)}`,
    calculation: `Cat 1: ≤${thresholds.cat1} | Cat 2: ≤${thresholds.cat2} | Cat 3: ≤${thresholds.cat3} | Cat 4: ≤${thresholds.cat4} ${getRouteUnit(route)}`,
    result: `${prevThreshold} < ATEmix (${ateMix.toFixed(1)}) ≤ ${catThreshold} → Category ${category}`,
  });

  const hCode = getHCode(route, category);

  return {
    hazardClass: `Acute Toxicity (${getRouteLabel(route)})`,
    category: `Category ${category}`,
    hCode,
    signalWord: getSignalWord(category),
    pictogram: getPictogram(category),
    proof: {
      method: "Additivity Formula (ICOP Part 2, Section 2.5.1.7)",
      formula: formulaUsed,
      steps,
      conclusion: `Mixture classified as Acute Tox. ${category} (${getRouteLabel(route)}) - ${hCode}`,
      reference: "ICOP Part 2, Section 2.5.1.7.1, Table 2.25, Table 2.26",
    },
  };
}
