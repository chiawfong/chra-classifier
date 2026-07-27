"use client";

import { useState } from "react";
import type {
  Chemical,
  MixtureIngredient,
  MixtureClassificationOutput,
  PhysicalForm,
  MixtureTestData,
} from "@/lib/classification/types";
import { MixtureBuilder } from "@/components/MixtureBuilder";
import { ClassificationResults } from "@/components/ClassificationResults";
import { Loader2 } from "lucide-react";

interface IngredientEntry {
  chemical: Chemical;
  concentration: string;
}

type AppState = "build" | "loading" | "results";

export default function Home() {
  const [state, setState] = useState<AppState>("build");
  const [output, setOutput] = useState<MixtureClassificationOutput | null>(
    null
  );
  const [entries, setEntries] = useState<IngredientEntry[]>([]);
  const [physicalForm, setPhysicalForm] = useState<PhysicalForm>("liquid");
  const [testData, setTestData] = useState<MixtureTestData>({});

  async function handleClassify(ings: MixtureIngredient[]) {
    setState("loading");

    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: ings,
          physicalForm,
          testData: Object.keys(testData).length > 0 ? testData : undefined,
        }),
      });

      if (!res.ok) throw new Error("Classification failed");

      const data: MixtureClassificationOutput = await res.json();
      setOutput(data);
      setState("results");
    } catch {
      setState("build");
      alert("Classification failed. Please try again.");
    }
  }

  function handleBack() {
    setState("build");
    setOutput(null);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {state === "build" && (
        <MixtureBuilder
          entries={entries}
          onEntriesChange={setEntries}
          physicalForm={physicalForm}
          onPhysicalFormChange={setPhysicalForm}
          testData={testData}
          onTestDataChange={setTestData}
          onClassify={handleClassify}
        />
      )}

      {state === "loading" && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="mt-4 text-muted-foreground">
            Classifying mixture ({entries.length} ingredients)...
          </p>
        </div>
      )}

      {state === "results" && output && (
        <ClassificationResults output={output} onBack={handleBack} />
      )}
    </div>
  );
}
