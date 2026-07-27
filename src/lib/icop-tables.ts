export interface ICOPTableData {
  title: string;
  section: string;
  headers: string[];
  rows: string[][];
}

export const ICOP_TABLES: Record<string, ICOPTableData> = {
  "Table 2.25": {
    title: "Acute toxicity hazard categories and ATE values",
    section: "ICOP Part 2, Section 2.5.1",
    headers: [
      "Exposure Route",
      "Category 1",
      "Category 2",
      "Category 3",
      "Category 4",
    ],
    rows: [
      ["Oral (mg/kg bw)", "ATE ≤ 5", "5 < ATE ≤ 50", "50 < ATE ≤ 300", "300 < ATE ≤ 2000"],
      ["Dermal (mg/kg bw)", "ATE ≤ 50", "50 < ATE ≤ 200", "200 < ATE ≤ 1000", "1000 < ATE ≤ 2000"],
      ["Gases (ppmV)", "ATE ≤ 100", "100 < ATE ≤ 500", "500 < ATE ≤ 2500", "2500 < ATE ≤ 20000"],
      ["Vapours (mg/l)", "ATE ≤ 0.5", "0.5 < ATE ≤ 2.0", "2.0 < ATE ≤ 10.0", "10.0 < ATE ≤ 20.0"],
      ["Dusts/Mists (mg/l)", "ATE ≤ 0.05", "0.05 < ATE ≤ 0.5", "0.5 < ATE ≤ 1.0", "1.0 < ATE ≤ 5.0"],
    ],
  },
  "Table 2.26": {
    title: "Conversion from acute toxicity category to ATE point estimate",
    section: "ICOP Part 2, Section 2.5.1.7",
    headers: [
      "Exposure Route",
      "Category 1",
      "Category 2",
      "Category 3",
      "Category 4",
    ],
    rows: [
      ["Oral (mg/kg bw)", "0.5", "5", "100", "500"],
      ["Dermal (mg/kg bw)", "5", "50", "300", "1100"],
      ["Gases (ppmV)", "10", "100", "700", "4500"],
      ["Vapours (mg/l)", "0.05", "0.5", "3", "11"],
      ["Dusts/Mists (mg/l)", "0.005", "0.05", "0.5", "1.5"],
    ],
  },
  "Table 2.30": {
    title: "Concentration limits for skin corrosion/irritation (additivity)",
    section: "ICOP Part 2, Section 2.5.2",
    headers: ["Classification", "Concentration triggering classification"],
    rows: [
      ["Corrosive Cat 1A/1B/1C sum ≥ 5%", "→ Mixture: Skin Corr. Cat 1 (H314)"],
      ["Corrosive Cat 1A sum ≥ 1%", "→ Mixture: Skin Corr. Cat 1 (H314)"],
      ["Corrosive Cat 1A/1B/1C sum ≥ 1% but < 5%", "→ Mixture: Skin Irrit. Cat 2 (H315)"],
      ["Irritant Cat 2 sum ≥ 10%", "→ Mixture: Skin Irrit. Cat 2 (H315)"],
      ["(Corr. × 10) + Irrit. ≥ 10%", "→ Mixture: Skin Irrit. Cat 2 (H315)"],
    ],
  },
  "Table 2.35": {
    title: "Concentration limits for serious eye damage/irritation (additivity)",
    section: "ICOP Part 2, Section 2.5.3",
    headers: ["Classification", "Concentration triggering classification"],
    rows: [
      ["Eye Dam. 1 / Skin Corr. 1A/1B/1C sum ≥ 3%", "→ Mixture: Eye Dam. 1 (H318)"],
      ["Eye Dam. 1 / Skin Corr. sum ≥ 1% but < 3%", "→ Mixture: Eye Irrit. 2 (H319)"],
      ["Eye Irrit. 2 sum ≥ 10%", "→ Mixture: Eye Irrit. 2 (H319)"],
      ["(Eye Dam. × 10) + Eye Irrit. ≥ 10%", "→ Mixture: Eye Irrit. 2 (H319)"],
    ],
  },
  "Table 2.39": {
    title: "Concentration limits for respiratory sensitization",
    section: "ICOP Part 2, Section 2.5.4",
    headers: ["Ingredient classified as", "Concentration limit"],
    rows: [
      ["Resp. Sens. 1 (solid/liquid)", "≥ 1.0%"],
      ["Resp. Sens. 1 (gas)", "≥ 0.2%"],
      ["Resp. Sens. 1A (solid/liquid)", "≥ 0.1%"],
      ["Resp. Sens. 1A (gas)", "≥ 0.1%"],
      ["Resp. Sens. 1B (solid/liquid)", "≥ 1.0%"],
      ["Resp. Sens. 1B (gas)", "≥ 0.2%"],
    ],
  },
  "Table 2.42": {
    title: "Concentration limits for skin sensitization",
    section: "ICOP Part 2, Section 2.5.5",
    headers: ["Ingredient classified as", "Concentration limit"],
    rows: [
      ["Skin Sens. 1", "≥ 1.0%"],
      ["Skin Sens. 1A", "≥ 0.1%"],
      ["Skin Sens. 1B", "≥ 1.0%"],
    ],
  },
  "Table 2.45": {
    title: "Concentration limits for germ cell mutagenicity",
    section: "ICOP Part 2, Section 2.5.6",
    headers: ["Ingredient classified as", "Concentration limit", "Mixture classified as"],
    rows: [
      ["Muta. 1A", "≥ 0.1%", "Muta. 1A (H340)"],
      ["Muta. 1B", "≥ 0.1%", "Muta. 1B (H340)"],
      ["Muta. 2", "≥ 1.0%", "Muta. 2 (H341)"],
    ],
  },
  "Table 2.48": {
    title: "Concentration limits for carcinogenicity",
    section: "ICOP Part 2, Section 2.5.7",
    headers: ["Ingredient classified as", "Concentration limit", "Mixture classified as"],
    rows: [
      ["Carc. 1A", "≥ 0.1%", "Carc. 1A (H350)"],
      ["Carc. 1B", "≥ 0.1%", "Carc. 1B (H350)"],
      ["Carc. 2", "≥ 1.0%", "Carc. 2 (H351)"],
    ],
  },
  "Table 2.52": {
    title: "Concentration limits for reproductive toxicity",
    section: "ICOP Part 2, Section 2.5.8",
    headers: ["Ingredient classified as", "Concentration limit", "Mixture classified as"],
    rows: [
      ["Repr. 1A", "≥ 0.3%", "Repr. 1A (H360)"],
      ["Repr. 1B", "≥ 0.3%", "Repr. 1B (H360)"],
      ["Repr. 2", "≥ 3.0%", "Repr. 2 (H361)"],
      ["Lact.", "≥ 0.3%", "Lact. (H362)"],
    ],
  },
  "Table 2.56": {
    title: "Concentration limits for STOT - Single Exposure",
    section: "ICOP Part 2, Section 2.5.9",
    headers: ["Ingredient classified as", "Concentration limit", "Mixture classified as"],
    rows: [
      ["STOT SE 1", "≥ 10%", "STOT SE 1 (H370)"],
      ["STOT SE 1", "1.0% ≤ c < 10%", "STOT SE 2 (H371)"],
      ["STOT SE 2", "≥ 10%", "STOT SE 2 (H371)"],
      ["STOT SE 2", "1.0% ≤ c < 10%", "STOT SE 3 (H335/H336)"],
      ["STOT SE 3", "≥ 20%", "STOT SE 3 (H335/H336)"],
    ],
  },
  "Table 2.61": {
    title: "Concentration limits for STOT - Repeated Exposure",
    section: "ICOP Part 2, Section 2.5.10",
    headers: ["Ingredient classified as", "Concentration limit", "Mixture classified as"],
    rows: [
      ["STOT RE 1", "≥ 10%", "STOT RE 1 (H372)"],
      ["STOT RE 1", "1.0% ≤ c < 10%", "STOT RE 2 (H373)"],
      ["STOT RE 2", "≥ 10%", "STOT RE 2 (H373)"],
    ],
  },
  "Table 2.65": {
    title: "Classification criteria for flammable liquids",
    section: "ICOP Part 2, Section 2.4.6",
    headers: ["Category", "Criteria", "H Code", "Signal Word"],
    rows: [
      ["1", "Flash point < 23°C and initial boiling point ≤ 35°C", "H224", "Danger"],
      ["2", "Flash point < 23°C and initial boiling point > 35°C", "H225", "Danger"],
      ["3", "Flash point ≥ 23°C and ≤ 60°C", "H226", "Warning"],
    ],
  },
  "Table 2.70": {
    title: "Summation thresholds for aquatic toxicity classification",
    section: "ICOP Part 2, Section 2.6.1",
    headers: ["Hazard Category", "Summation Criterion", "H Code"],
    rows: [
      ["Aquatic Acute 1", "Σ(Ci × Mi) ≥ 25%", "H400"],
      ["Aquatic Chronic 1", "Σ Chronic 1 ingredients ≥ 25%", "H410"],
      ["Aquatic Chronic 2", "Σ (Chronic 1 + 2) ingredients ≥ 25%", "H411"],
      ["Aquatic Chronic 3", "Σ (Chronic 1 + 2 + 3) ingredients ≥ 25%", "H412"],
      ["Aquatic Chronic 4", "Σ all chronic ingredients ≥ 25%", "H413"],
    ],
  },
  "Table 2.71": {
    title: "Ozone layer hazard concentration limit",
    section: "ICOP Part 2, Section 2.6.2",
    headers: ["Hazard Category", "Concentration Limit", "H Code"],
    rows: [
      ["Category 1", "≥ 0.1% of ozone-depleting substance", "H420"],
    ],
  },
};
