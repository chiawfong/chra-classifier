"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Loader2, AlertCircle, Plus, ShieldCheck, Globe } from "lucide-react";
import type { Chemical } from "@/lib/classification/types";

const SOURCE_LABELS: Record<string, { label: string; description: string; color: string }> = {
  ICOP2019: {
    label: "ICOP 2019 Amendment",
    description: "Official Malaysian DOSH pre-classified list (Amendment 2019) — highest authority",
    color: "border-green-500 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200",
  },
  ICOP2014: {
    label: "ICOP 2014",
    description: "Official Malaysian DOSH pre-classified list (Original 2014)",
    color: "border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
  },
  PubChem: {
    label: "PubChem GHS",
    description: "GHS classification from PubChem (international source — not found in ICOP database)",
    color: "border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  },
  Manual: {
    label: "Manual Entry",
    description: "User-provided classification data from Safety Data Sheet",
    color: "border-gray-500 bg-gray-50 text-gray-800 dark:bg-gray-950 dark:text-gray-200",
  },
};

interface ChemicalSearchProps {
  onAddChemical: (chemical: Chemical) => void;
}

export function ChemicalSearch({ onAddChemical }: ChemicalSearchProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Chemical | null>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setSearched(true);

    try {
      const res = await fetch(
        `/api/chemical/search?q=${encodeURIComponent(query.trim())}`
      );
      if (!res.ok) {
        setError("Search failed. Please try again.");
        return;
      }
      const data = await res.json();
      if (data.chemical) {
        setResult(data.chemical);
      } else {
        setError(
          "Chemical not found. Try a different name or CAS number, or enter data manually."
        );
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    if (result) {
      onAddChemical(result);
      setResult(null);
      setQuery("");
      setSearched(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">Search Chemical</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            placeholder="Enter CAS number (e.g. 67-64-1) or chemical name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            disabled={loading}
          />
          <Button onClick={handleSearch} disabled={loading || !query.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {result && (
          <div className="mt-4 rounded-lg border bg-muted/30 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{result.name}</h3>
                {result.cas && (
                  <p className="text-sm text-muted-foreground">
                    CAS: {result.cas}
                  </p>
                )}
                {result.aliases.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Also known as: {result.aliases.slice(0, 3).join(", ")}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-1">
                  {result.classifications.map((c, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {c.code} ({c.hCode})
                    </Badge>
                  ))}
                  {result.classifications.length === 0 && (
                    <Badge variant="secondary" className="text-xs">
                      No hazard classification data
                    </Badge>
                  )}
                </div>
                <div className="mt-2">
                  {(() => {
                    const info = SOURCE_LABELS[result.source] ?? SOURCE_LABELS.Manual;
                    return (
                      <div className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium ${info.color}`}>
                        {result.source === "PubChem" ? (
                          <Globe className="h-3 w-3" />
                        ) : (
                          <ShieldCheck className="h-3 w-3" />
                        )}
                        <span>{info.label}</span>
                      </div>
                    );
                  })()}
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {SOURCE_LABELS[result.source]?.description ?? "Classification source unknown"}
                  </p>
                </div>
              </div>
              <Button size="sm" onClick={handleAdd}>
                <Plus className="mr-1 h-3 w-3" />
                Add
              </Button>
            </div>
          </div>
        )}

        {searched && !result && !loading && !error && (
          <p className="mt-3 text-sm text-muted-foreground">
            No results found.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
