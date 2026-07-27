"use client";

import type { MixtureClassificationOutput } from "@/lib/classification/types";
import { H_CODE_DESCRIPTIONS } from "@/lib/classification/types";
import { HazardPictogram } from "./HazardPictogram";
import { FormulaProof } from "./FormulaProof";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, FileDown, Lock } from "lucide-react";
import { generateClassificationPDF } from "@/lib/pdf-export";

interface ClassificationResultsProps {
  output: MixtureClassificationOutput;
  onBack: () => void;
}

export function ClassificationResults({
  output,
  onBack,
}: ClassificationResultsProps) {
  const { results, warnings, ingredients } = output;

  const uniquePictograms = [
    ...new Set(results.map((r) => r.pictogram).filter(Boolean)),
  ];
  const highestSignalWord = results.some((r) => r.signalWord === "Danger")
    ? "Danger"
    : results.some((r) => r.signalWord === "Warning")
      ? "Warning"
      : "None";

  const physicalPrefixes = ["Flam.", "Expl.", "Ox.", "Self-react.", "Pyr.", "Self-heat.", "Water-react.", "Org. Perox.", "Press. Gas", "Met. Corr.", "Unst. Expl."];
  const envPrefixes = ["Aquatic", "Ozone"];

  const detectedPhysical = new Set<string>();
  const detectedEnv = new Set<string>();
  for (const ing of ingredients) {
    for (const cls of ing.chemical.classifications) {
      for (const p of physicalPrefixes) {
        if (cls.code.startsWith(p)) detectedPhysical.add(`${cls.code} (${cls.hCode})`);
      }
      for (const e of envPrefixes) {
        if (cls.code.startsWith(e)) detectedEnv.add(`${cls.code} (${cls.hCode})`);
      }
    }
  }
  const physEnvClassified = results.some((r) =>
    ["Flammable", "Explosive", "Oxidizing", "Self-Reactive", "Pyrophoric", "Self-Heating", "Water-Reactive", "Organic Peroxide", "Corrosive to Metals", "Gas Under Pressure", "Aquatic", "Ozone"].some((p) => r.hazardClass.includes(p))
  );
  const hasPhysicalOrEnv = (detectedPhysical.size > 0 || detectedEnv.size > 0) && !physEnvClassified;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Mixture
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const doc = generateClassificationPDF(output);
            doc.save(`hazard-classification-${new Date().toISOString().slice(0, 10)}.pdf`);
          }}
        >
          <FileDown className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((w, i) => (
            <Alert key={i} className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">{w}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Classification Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                GHS Pictograms
              </h4>
              <div className="flex flex-wrap gap-2">
                {uniquePictograms.length > 0 ? (
                  uniquePictograms.map((p) => (
                    <HazardPictogram key={p} type={p} size={56} />
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No pictograms required
                  </span>
                )}
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                Signal Word
              </h4>
              <Badge
                variant={
                  highestSignalWord === "Danger" ? "destructive" : "secondary"
                }
                className="text-base"
              >
                {highestSignalWord}
              </Badge>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                Mixture Components
              </h4>
              <p className="text-sm">
                {ingredients.length} ingredient
                {ingredients.length !== 1 && "s"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Hazard Classifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.map((r, i) => (
              <div key={i}>
                <div className="flex items-center gap-3 py-2">
                  <HazardPictogram type={r.pictogram} size={40} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{r.hazardClass}</span>
                      <Badge variant="outline">{r.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-mono">{r.hCode}</span>
                      <span>-</span>
                      <span>
                        {H_CODE_DESCRIPTIONS[r.hCode] || r.hCode}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      r.signalWord === "Danger" ? "destructive" : "secondary"
                    }
                  >
                    {r.signalWord}
                  </Badge>
                </div>
                {i < results.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-lg font-medium">Not Classified</p>
            <p className="text-sm text-muted-foreground">
              Based on the provided ingredient data, this mixture does not meet
              the criteria for any health hazard classification.
            </p>
          </CardContent>
        </Card>
      )}

      {hasPhysicalOrEnv && (
        <Card className="border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 dark:border-amber-700 dark:from-amber-950 dark:to-orange-950">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-semibold text-amber-800 dark:text-amber-200">
                  Physical & Environmental Hazards Detected
                </p>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                  Your mixture ingredients have the following classifications that require the full version to classify:
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {[...detectedPhysical].map((h) => (
                    <Badge key={h} variant="outline" className="border-amber-400 text-xs text-amber-800 dark:border-amber-600 dark:text-amber-200">
                      {h}
                    </Badge>
                  ))}
                  {[...detectedEnv].map((h) => (
                    <Badge key={h} variant="outline" className="border-green-400 text-xs text-green-800 dark:border-green-600 dark:text-green-200">
                      {h}
                    </Badge>
                  ))}
                </div>
                <p className="mt-2 text-sm font-medium text-amber-800 dark:text-amber-200">
                  Upgrade to classify physical and environmental hazards, generate CHRA reports, and save assessments.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Step-by-Step Proof</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {results.length > 0 ? (
            results.map((r, i) => (
              <FormulaProof
                key={i}
                proof={r.proof}
                hazardClass={r.hazardClass}
                category={r.category}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No classification proofs to display.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs text-muted-foreground dark:border-gray-800 dark:bg-gray-900">
        <p>
          <strong>Disclaimer:</strong> This classification is generated based on
          the ICOP on Classification, Labelling and Safety Data Sheet of Hazardous
          Chemicals 2014 (and 2019 Amendment). It is intended as guidance only
          and should not be considered a substitute for professional assessment.
          Always verify results against official Safety Data Sheets (SDS) and
          consult qualified professionals for regulatory compliance.
        </p>
      </div>
    </div>
  );
}
