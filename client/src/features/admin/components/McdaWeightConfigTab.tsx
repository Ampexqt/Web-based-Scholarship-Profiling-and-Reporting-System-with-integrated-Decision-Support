import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Sliders, RotateCcw, Save, CheckCircle2, AlertCircle } from "lucide-react"
import { apiClient } from "@/lib/axios"
import { cn } from "@/lib/utils"
import type { McdaTrackOption, McdaWeights } from "../types/decisionSupport"

interface McdaWeightConfigTabProps {
  tracks: McdaTrackOption[]
  activeWeights: McdaWeights
  onSaved: () => void
}

const CRITERIA_META = [
  {
    key: "gwaWeight" as const,
    label: "Academic Merit (Previous GWA)",
    type: "Benefit Criterion (Inverted 1.00–5.00)",
    description: "Rewards stronger academic standing on the Philippine grading scale.",
  },
  {
    key: "incomeWeight" as const,
    label: "Monthly Household Income",
    type: "Cost Criterion (Lower = Higher Priority)",
    description: "Directs financial assistance toward lower-income applicant households.",
  },
  {
    key: "householdWeight" as const,
    label: "Household Dependency Size",
    type: "Benefit Criterion (Higher = Higher Priority)",
    description: "Accounts for the total number of dependents sharing household resources.",
  },
  {
    key: "priorityWeight" as const,
    label: "Priority Sector / Special Circumstances",
    type: "Benefit Criterion (Affirmative Action)",
    description: "Weights Indigent/4Ps, PWD, Solo Parent, Indigenous Peoples, and Athletics/Arts.",
  },
]

const PRESETS: ReadonlyArray<{ label: string; weights: McdaWeights }> = [
  {
    label: "Track 1: Needs-Based / Equity",
    weights: { gwaWeight: 10, incomeWeight: 45, householdWeight: 15, priorityWeight: 30 },
  },
  {
    label: "Track 2: Merit / Academic",
    weights: { gwaWeight: 60, incomeWeight: 20, householdWeight: 10, priorityWeight: 10 },
  },
  {
    label: "Track 3: Balanced Composite",
    weights: { gwaWeight: 35, incomeWeight: 30, householdWeight: 15, priorityWeight: 20 },
  },
]

export default function McdaWeightConfigTab({
  tracks,
  activeWeights,
  onSaved,
}: McdaWeightConfigTabProps) {
  const [weights, setWeights] = useState<McdaWeights>(activeWeights)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const customTrack = tracks.find((t) => t.key === "custom")
    if (customTrack) {
      setWeights(customTrack.weights)
    } else {
      setWeights(activeWeights)
    }
  }, [tracks, activeWeights])

  const totalWeight =
    weights.gwaWeight +
    weights.incomeWeight +
    weights.householdWeight +
    weights.priorityWeight
  const isValidTotal = Math.abs(totalWeight - 100) <= 0.01

  const updateCriterion = (key: keyof McdaWeights, rawVal: string) => {
    const parsed = Number.parseFloat(rawVal)
    const clamped = Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : 0
    setWeights((prev) => ({ ...prev, [key]: clamped }))
  }

  const handleSave = async () => {
    if (!isValidTotal) {
      toast.error(`Criteria weights must sum to 100%. Current total: ${totalWeight.toFixed(1)}%.`)
      return
    }

    setIsSaving(true)
    try {
      await apiClient.post("/decision-support/weights", {
        trackKey: "custom",
        label: "Custom Institutional Track",
        ...weights,
        setAsActive: true,
      })
      toast.success("Custom MCDA weights saved and activated.")
      onSaved()
    } catch (error) {
      console.error("Failed to save weights:", error)
      toast.error("Failed to update MCDA weights. Admin privileges are required.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Left: AHP Preset Reference */}
      <Card className="xl:col-span-4 border-border shadow-none">
        <CardHeader className="pb-4 border-b border-border/60">
          <CardTitle className="text-lg font-semibold">AHP Reference Presets</CardTitle>
          <CardDescription className="text-xs">
            Load an Analytic Hierarchy Process (AHP) baseline into the editor, then fine-tune to match grant mandates.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 flex flex-col gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setWeights(preset.weights)}
              className="w-full text-left p-3.5 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-colors flex flex-col gap-2"
            >
              <span className="text-sm font-semibold text-foreground">{preset.label}</span>
              <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-muted-foreground">
                <span>GWA: {preset.weights.gwaWeight}%</span>
                <span>Income: {preset.weights.incomeWeight}%</span>
                <span>Household: {preset.weights.householdWeight}%</span>
                <span>Priority: {preset.weights.priorityWeight}%</span>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Right: Interactive Criteria Weight Editor */}
      <Card className="xl:col-span-8 border-border shadow-none">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Sliders className="size-4 text-primary" />
                Custom Criteria Weight Configuration
              </CardTitle>
              <CardDescription className="text-xs">
                Adjust the relative importance of each criterion. All four weights must total exactly 100%.
              </CardDescription>
            </div>

            <Badge
              variant={isValidTotal ? "secondary" : "destructive"}
              className={cn(
                "font-mono text-xs px-3 py-1 flex items-center gap-1.5 w-fit",
                isValidTotal && "bg-primary/10 text-primary border-primary/20"
              )}
            >
              {isValidTotal ? (
                <CheckCircle2 className="size-3.5" />
              ) : (
                <AlertCircle className="size-3.5" />
              )}
              Total: {totalWeight.toFixed(0)}%
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-5 flex flex-col gap-5">
          {CRITERIA_META.map((criterion) => (
            <div key={criterion.key} className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <Label htmlFor={`weight-${criterion.key}`} className="text-sm font-semibold text-foreground">
                    {criterion.label}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {criterion.type} — {criterion.description}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Input
                    id={`weight-${criterion.key}`}
                    type="number"
                    min={0}
                    max={100}
                    step={5}
                    value={weights[criterion.key]}
                    onChange={(e) => updateCriterion(criterion.key, e.target.value)}
                    className="w-20 h-9 text-right font-mono font-semibold"
                  />
                  <span className="text-xs font-mono text-muted-foreground">%</span>
                </div>
              </div>

              <input
                type="range"
                aria-label={`${criterion.label} slider`}
                min={0}
                max={100}
                step={5}
                value={weights[criterion.key]}
                onChange={(e) => updateCriterion(criterion.key, e.target.value)}
                className="w-full accent-[var(--color-primary)] cursor-pointer"
              />
            </div>
          ))}

          <Separator />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              {isValidTotal
                ? "Valid weight distribution. Saving activates the Custom Institutional Track and records an audit entry."
                : `Adjust weights by ${(100 - totalWeight).toFixed(0)}% to reach 100%.`}
            </span>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setWeights(PRESETS[2].weights)}
                disabled={isSaving}
              >
                <RotateCcw data-icon="inline-start" />
                Reset Default
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={!isValidTotal || isSaving}
              >
                <Save data-icon="inline-start" />
                {isSaving ? "Saving..." : "Save Weights"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
