"use client";

import type { Chemical, MixtureIngredient, PhysicalForm, MixtureTestData } from "@/lib/classification/types";
import { ChemicalSearch } from "./ChemicalSearch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, FlaskConical, AlertTriangle, Info, ChevronDown, ChevronRight, Beaker } from "lucide-react";
import { useState } from "react";

export interface IngredientEntry {
  chemical: Chemical;
  concentration: string;
}

interface MixtureBuilderProps {
  entries: IngredientEntry[];
  onEntriesChange: (entries: IngredientEntry[]) => void;
  physicalForm: PhysicalForm;
  onPhysicalFormChange: (form: PhysicalForm) => void;
  testData: MixtureTestData;
  onTestDataChange: (data: MixtureTestData) => void;
  onClassify: (ingredients: MixtureIngredient[]) => void;
}

const FORM_LABELS: Record<PhysicalForm, string> = {
  liquid: "Liquid",
  solid: "Solid / Powder",
  gas: "Gas",
  aerosol: "Aerosol",
};

const FORM_DESCRIPTIONS: Record<PhysicalForm, string> = {
  liquid: "Inhalation via vapour route. Aspiration hazard applies. Flammable liquid classification available.",
  solid: "Inhalation via dust/mist route. Aspiration hazard does not apply. Flammable solid classification available.",
  gas: "Inhalation via gas route (ppmV). Gas-specific physical hazards apply.",
  aerosol: "Inhalation via dust/mist route. Flammable aerosol classification available.",
};

export function MixtureBuilder({
  entries,
  onEntriesChange,
  physicalForm,
  onPhysicalFormChange,
  testData,
  onTestDataChange,
  onClassify,
}: MixtureBuilderProps) {
  const [showGuidance, setShowGuidance] = useState(false);

  function addChemical(chemical: Chemical) {
    const exists = entries.some(
      (i) =>
        i.chemical.cas === chemical.cas && i.chemical.name === chemical.name
    );
    if (exists) return;
    onEntriesChange([...entries, { chemical, concentration: "" }]);
  }

  function removeIngredient(index: number) {
    onEntriesChange(entries.filter((_, i) => i !== index));
  }

  function updateConcentration(index: number, value: string) {
    const num = parseFloat(value);
    if (value !== "" && (isNaN(num) || num < 0 || num > 100)) return;
    const updated = [...entries];
    updated[index] = { ...updated[index], concentration: value };
    onEntriesChange(updated);
  }

  function updateTestField(field: keyof MixtureTestData, value: string) {
    const num = parseFloat(value);
    onTestDataChange({
      ...testData,
      [field]: value === "" ? undefined : (isNaN(num) ? undefined : num),
    });
  }

  const totalConcentration = entries.reduce((sum, i) => {
    const val = parseFloat(i.concentration);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const isValid =
    entries.length >= 1 &&
    entries.every((i) => {
      const val = parseFloat(i.concentration);
      return !isNaN(val) && val > 0;
    }) &&
    totalConcentration <= 100.5;

  function handleClassify() {
    const mixtureIngredients: MixtureIngredient[] = entries.map((i) => ({
      chemical: i.chemical,
      concentration: parseFloat(i.concentration),
    }));
    onClassify(mixtureIngredients);
  }

  return (
    <div className="space-y-4">
      <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Before you begin:</strong> Ensure you know the exact
          composition of your mixture. Enter concentrations in % w/w (or % v/v
          for gases). Ingredients without classification data will be treated as
          non-hazardous unless noted otherwise.
          <button
            onClick={() => setShowGuidance(!showGuidance)}
            className="mt-2 flex items-center gap-1 text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
          >
            {showGuidance ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            Classification notes by physical form
          </button>
          {showGuidance && (
            <div className="mt-2 space-y-2 border-t border-blue-200 pt-2 text-xs dark:border-blue-700">
              <div>
                <strong>Liquids:</strong> Enter concentrations in % w/w. Acute
                toxicity for vapours uses ATE in mg/l (4-hour exposure).
                Aspiration hazard (H304) applies only to liquid mixtures with
                kinematic viscosity ≤ 20.5 mm²/s at 40°C.
              </div>
              <div>
                <strong>Solids / Powders:</strong> Enter concentrations in % w/w
                (same as liquids). If the solid mixture can generate respirable
                dust, inhalation route classification applies using the
                dusts/mists thresholds (Table 2.25). Aspiration hazard does not
                apply to solids.
              </div>
              <div>
                <strong>Gases:</strong> Enter concentrations in % v/v. Inhalation
                ATE for gases uses ppmV (4-hour exposure) per Table 2.25.
              </div>
            </div>
          )}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Beaker className="h-5 w-5" />
            Physical Form of Mixture
          </CardTitle>
          <CardDescription>
            Select the physical form — this affects which hazard classifications and inhalation thresholds apply.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="physical-form" className="mb-1.5 block text-sm font-medium">
                  Physical Form
                </Label>
                <select
                  id="physical-form"
                  value={physicalForm}
                  onChange={(e) => onPhysicalFormChange(e.target.value as PhysicalForm)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="liquid">Liquid</option>
                  <option value="solid">Solid / Powder</option>
                  <option value="gas">Gas</option>
                  <option value="aerosol">Aerosol</option>
                </select>
              </div>
              <div className="flex items-end">
                <p className="text-xs text-muted-foreground">
                  {FORM_DESCRIPTIONS[physicalForm]}
                </p>
              </div>
            </div>

            <div className="rounded-md border border-dashed border-gray-300 p-3 dark:border-gray-700">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Test Data from SDS Section 9 (optional — overrides ingredient-based classification when provided)
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {(physicalForm === "liquid" || physicalForm === "aerosol") && (
                  <div>
                    <Label htmlFor="flash-point" className="mb-1 block text-xs">
                      Flash Point (°C)
                    </Label>
                    <Input
                      id="flash-point"
                      type="number"
                      step="0.1"
                      placeholder="e.g. -20"
                      value={testData.flashPoint ?? ""}
                      onChange={(e) => updateTestField("flashPoint", e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                )}
                {physicalForm === "liquid" && (
                  <div>
                    <Label htmlFor="boiling-point" className="mb-1 block text-xs">
                      Boiling Point (°C)
                    </Label>
                    <Input
                      id="boiling-point"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 56.2"
                      value={testData.boilingPoint ?? ""}
                      onChange={(e) => updateTestField("boilingPoint", e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                )}
                {physicalForm === "solid" && (
                  <div>
                    <Label htmlFor="burning-rate" className="mb-1 block text-xs">
                      Burning Rate (mm/s)
                    </Label>
                    <Input
                      id="burning-rate"
                      type="number"
                      step="0.01"
                      placeholder="e.g. 2.2"
                      value={testData.burningRate ?? ""}
                      onChange={(e) => updateTestField("burningRate", e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                )}
                {physicalForm === "gas" && (
                  <p className="col-span-3 text-xs text-muted-foreground italic">
                    Gas classification relies on ingredient classifications (flammability limits, oxidizing properties).
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ChemicalSearch onAddChemical={addChemical} />

      {entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FlaskConical className="h-5 w-5" />
              Mixture Composition
              <Badge variant="secondary" className="ml-2 text-xs font-normal">
                {FORM_LABELS[physicalForm]}
              </Badge>
            </CardTitle>
            <CardDescription>
              {entries.length} ingredient{entries.length !== 1 && "s"} |
              Total: {totalConcentration.toFixed(1)}%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Chemical</TableHead>
                    <TableHead>CAS No.</TableHead>
                    <TableHead>Classifications</TableHead>
                    <TableHead className="w-32">Concentration (%)</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((ing, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        {ing.chemical.name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {ing.chemical.cas || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {ing.chemical.classifications
                            .slice(0, 3)
                            .map((c, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs"
                              >
                                {c.hCode}
                              </Badge>
                            ))}
                          {ing.chemical.classifications.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{ing.chemical.classifications.length - 3}
                            </Badge>
                          )}
                          {ing.chemical.classifications.length === 0 && (
                            <span className="text-xs text-muted-foreground">
                              None
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          placeholder="0.0"
                          value={ing.concentration}
                          onChange={(e) =>
                            updateConcentration(idx, e.target.value)
                          }
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeIngredient(idx)}
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalConcentration > 100 && (
              <Alert
                variant="destructive"
                className="mt-3"
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Total concentration exceeds 100% ({totalConcentration.toFixed(1)}%).
                  Please verify your inputs.
                </AlertDescription>
              </Alert>
            )}

            <div className="mt-4 flex justify-end">
              <Button
                size="lg"
                onClick={handleClassify}
                disabled={!isValid}
              >
                <FlaskConical className="mr-2 h-4 w-4" />
                Classify Mixture
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
