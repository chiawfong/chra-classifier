"use client";

import type { ClassificationProof } from "@/lib/classification/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { parseTableReferences } from "./TablePopup";

interface FormulaProofProps {
  proof: ClassificationProof;
  hazardClass: string;
  category: string;
}

export function FormulaProof({ proof, hazardClass, category }: FormulaProofProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader
        className="cursor-pointer py-3"
        onClick={() => setExpanded(!expanded)}
      >
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span>{hazardClass}</span>
            <Badge variant="secondary">{category}</Badge>
          </div>
          <span className="text-xs text-muted-foreground">{proof.method}</span>
        </CardTitle>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0">
          {proof.formula && (
            <div className="mb-3 rounded bg-muted p-3 font-mono text-sm">
              {parseTableReferences(proof.formula)}
            </div>
          )}

          <div className="space-y-3">
            {proof.steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  {i + 1}
                </div>
                <div className="flex-1 border-l-2 border-gray-200 pl-3">
                  <div className="text-sm">
                    {parseTableReferences(step.description)}
                  </div>
                  {step.calculation && (
                    <div className="mt-1 rounded bg-blue-50 p-2 font-mono text-xs text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                      {parseTableReferences(step.calculation)}
                    </div>
                  )}
                  {step.result && (
                    <div className="mt-1 text-sm font-semibold text-green-700 dark:text-green-400">
                      {parseTableReferences(step.result)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
            <div className="text-sm font-bold text-green-800 dark:text-green-200">
              {parseTableReferences(proof.conclusion)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Reference: {parseTableReferences(proof.reference)}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
