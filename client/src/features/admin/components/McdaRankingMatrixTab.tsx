import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Award, Scale, ShieldAlert, SlidersHorizontal, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react"
import { apiClient } from "@/lib/axios"
import { academicStructure } from "@/features/application/data/academicStructure"
import { cn, getAcronym } from "@/lib/utils"
import type {
  McdaRankingsResponse,
  McdaTrackKey,
  RankedApplicant,
} from "../types/decisionSupport"

interface McdaRankingMatrixTabProps {
  data: McdaRankingsResponse | null
  isLoading: boolean
  selectedTrack: McdaTrackKey
  quota: number
  selectedCollege: string
  onTrackChange: (track: McdaTrackKey) => void
  onQuotaChange: (quota: number) => void
  onCollegeChange: (college: string) => void
  onRefresh: () => void
}

const TRACK_BUTTONS: ReadonlyArray<{ key: McdaTrackKey; label: string; tag: string }> = [
  { key: "balanced", label: "Balanced Composite", tag: "35 / 30 / 15 / 20" },
  { key: "needs-based", label: "Needs-Based / Equity", tag: "10 / 45 / 15 / 30" },
  { key: "merit", label: "Merit / Academic", tag: "60 / 20 / 10 / 10" },
  { key: "custom", label: "Custom Track", tag: "Admin Defined" },
]

const DECISION_OPTIONS = [
  { value: "CONFIRMED_AWARD", label: "Confirm Award Recommendation" },
  { value: "OVERRIDE_AWARD", label: "Override — Grant Award" },
  { value: "OVERRIDE_WAITLIST", label: "Override — Move to Waitlist" },
  { value: "OVERRIDE_REJECT", label: "Override — Reject Applicant" },
]

export default function McdaRankingMatrixTab({
  data,
  isLoading,
  selectedTrack,
  quota,
  selectedCollege,
  onTrackChange,
  onQuotaChange,
  onCollegeChange,
  onRefresh,
}: McdaRankingMatrixTabProps) {
  const [quotaInput, setQuotaInput] = useState(String(quota))
  const [activeApplicant, setActiveApplicant] = useState<RankedApplicant | null>(null)
  const [decisionType, setDecisionType] = useState("CONFIRMED_AWARD")
  const [remarks, setRemarks] = useState("")
  const [isSavingDecision, setIsSavingDecision] = useState(false)

  const handleQuotaSubmit = (val: string) => {
    setQuotaInput(val)
    const parsed = Number.parseInt(val, 10)
    if (Number.isFinite(parsed) && parsed > 0) {
      onQuotaChange(parsed)
    }
  }

  const openDecisionDialog = (applicant: RankedApplicant) => {
    setActiveApplicant(applicant)
    setDecisionType(
      applicant.decision?.decision ||
        (applicant.recommendation === "Recommended for Award" ? "CONFIRMED_AWARD" : "OVERRIDE_AWARD")
    )
    setRemarks(applicant.decision?.remarks || "")
  }

  const handleSaveDecision = async () => {
    if (!activeApplicant) return
    const isOverride = decisionType.startsWith("OVERRIDE_")
    if (isOverride && remarks.trim().length < 5) {
      toast.error("Enter justification remarks (at least 5 characters) for an override.")
      return
    }

    setIsSavingDecision(true)
    try {
      await apiClient.post("/decision-support/override", {
        referenceNumber: activeApplicant.referenceNumber,
        decision: decisionType,
        trackKey: selectedTrack,
        compositeScore: activeApplicant.compositeScore,
        remarks: remarks.trim(),
        syncApplicationStatus: true,
      })
      toast.success(`Decision saved for ${activeApplicant.fullName} and recorded in audit log.`)
      setActiveApplicant(null)
      onRefresh()
    } catch (error) {
      console.error("Failed to record MCDA decision:", error)
      toast.error("Could not save decision. Check remarks and try again.")
    } finally {
      setIsSavingDecision(false)
    }
  }

  const formatPeso = (amount: number) =>
    `₱${Math.round(amount).toLocaleString("en-PH")}`

  const renderDecisionBadge = (applicant: RankedApplicant) => {
    if (applicant.decision) {
      const d = applicant.decision.decision
      if (d === "CONFIRMED_AWARD") {
        return <Badge className="bg-primary text-primary-foreground font-medium">Confirmed Award</Badge>
      }
      if (d === "OVERRIDE_AWARD") {
        return <Badge variant="outline" className="border-primary text-primary font-medium">Override: Award</Badge>
      }
      if (d === "OVERRIDE_WAITLIST") {
        return <Badge variant="secondary" className="font-medium">Override: Waitlist</Badge>
      }
      return <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">Override: Rejected</Badge>
    }

    if (applicant.recommendation === "Recommended for Award") {
      return (
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 font-medium">
          Recommended for Award
        </Badge>
      )
    }

    return (
      <Badge variant="secondary" className="font-normal text-muted-foreground">
        Waitlisted
      </Badge>
    )
  }

  const summary = data?.summary ?? {
    totalEvaluated: 0,
    recommendedCount: 0,
    waitlistedCount: 0,
    flaggedCount: 0,
    averageScore: 0,
  }
  const weights = data?.weights ?? {
    gwaWeight: 35,
    incomeWeight: 30,
    householdWeight: 15,
    priorityWeight: 20,
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Controls Bar: Track Selection, Quota Input, College Filter */}
      <Card className="border-border shadow-none">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Scale className="size-4 text-primary" />
                MCDA Evaluation Track & Quota Allocation
              </CardTitle>
              <CardDescription className="text-xs">
                Simple Additive Weighting (SAW) normalizes merit and socio-economic need on a 0–100 scale.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <Badge variant="outline">GWA {weights.gwaWeight}%</Badge>
              <Badge variant="outline">Income {weights.incomeWeight}%</Badge>
              <Badge variant="outline">Household {weights.householdWeight}%</Badge>
              <Badge variant="outline">Priority {weights.priorityWeight}%</Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-5 flex flex-col gap-5">
          {/* Evaluation Track Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {TRACK_BUTTONS.map((track) => {
              const active = selectedTrack === track.key
              return (
                <button
                  key={track.key}
                  type="button"
                  onClick={() => onTrackChange(track.key)}
                  aria-pressed={active}
                  className={cn(
                    "text-left p-3 rounded-lg border transition-colors flex flex-col gap-1",
                    active
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border bg-background hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="text-sm font-semibold text-foreground">{track.label}</span>
                  <span className="text-[11px] font-mono text-muted-foreground">{track.tag}</span>
                </button>
              )
            })}
          </div>

          {/* Quota & College Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="mcda-quota" className="text-xs font-medium text-muted-foreground">
                Intake Quota (Slots N)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="mcda-quota"
                  type="number"
                  min={1}
                  max={5000}
                  value={quotaInput}
                  onChange={(e) => handleQuotaSubmit(e.target.value)}
                  className="h-9 font-mono w-28"
                />
                {[5, 25, 50].map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    size="sm"
                    variant={quota === preset ? "default" : "outline"}
                    onClick={() => handleQuotaSubmit(String(preset))}
                    className="h-9 font-mono text-xs"
                  >
                    {preset}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="mcda-college-filter" className="text-xs font-medium text-muted-foreground">
                Filter by College
              </Label>
              <select
                id="mcda-college-filter"
                value={selectedCollege}
                onChange={(e) => onCollegeChange(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All Colleges</option>
                {academicStructure.map((college) => (
                  <option key={college.abbr} value={college.abbr}>
                    {college.abbr} — {college.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-4 text-xs font-mono text-muted-foreground">
              <span>Cohort Avg Score:</span>
              <span className="text-base font-bold text-foreground">{summary.averageScore.toFixed(1)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border shadow-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Qualified Pool</span>
              <span className="text-2xl font-bold font-mono text-foreground">{summary.totalEvaluated}</span>
            </div>
            <SlidersHorizontal className="size-4 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="border-border shadow-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Recommended for Award</span>
              <span className="text-2xl font-bold font-mono text-primary">{summary.recommendedCount}</span>
            </div>
            <Award className="size-4 text-primary" />
          </CardContent>
        </Card>
        <Card className="border-border shadow-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Waitlisted</span>
              <span className="text-2xl font-bold font-mono text-foreground">{summary.waitlistedCount}</span>
            </div>
            <CheckCircle2 className="size-4 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="border-border shadow-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Flagged Hold</span>
              <span className="text-2xl font-bold font-mono text-destructive">{summary.flaggedCount}</span>
            </div>
            <ShieldAlert className="size-4 text-destructive" />
          </CardContent>
        </Card>
      </div>

      {/* Main Ranking Table */}
      <Card className="border-border shadow-none overflow-hidden">
        <CardHeader className="border-b border-border/60 bg-background/50">
          <CardTitle className="text-lg font-semibold">Ranked Applicant Matrix</CardTitle>
          <CardDescription className="text-xs">
            Ranks 1 through {quota} are marked Recommended for Award. Administrators retain final authority to confirm or override with justification.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 flex flex-col gap-3">
              {[1, 2, 3, 4].map((row) => (
                <Skeleton key={row} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-b border-border">
                    <TableHead className="pl-5 w-16 font-semibold text-muted-foreground">Rank</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Applicant</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Raw Criteria</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Score Breakdown (Pts)</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-right">Composite</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Recommendation</TableHead>
                    <TableHead className="text-right pr-5 font-semibold text-muted-foreground">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!data || data.rankings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No eligible applications found for the selected track and college filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.rankings.map((item) => (
                      <TableRow key={item.referenceNumber} className="border-b border-border hover:bg-muted/20">
                        <TableCell className="pl-5 font-mono font-bold text-foreground">
                          #{item.rank}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{item.fullName}</span>
                              <Badge variant="outline" className="text-[10px] font-mono">
                                {getAcronym(item.college)}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-xs font-mono text-muted-foreground">
                                {item.referenceNumber}
                              </span>
                              {item.metrics.priorityTags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5 text-xs font-mono text-muted-foreground">
                            <span>
                              GWA: <strong className="text-foreground">{item.metrics.gwa !== null ? item.metrics.gwa.toFixed(2) : "N/A"}</strong>
                            </span>
                            <span>
                              Income: <strong className="text-foreground">{formatPeso(item.metrics.monthlyIncome)}</strong>
                            </span>
                            <span>
                              Household: <strong className="text-foreground">{item.metrics.householdSize}</strong>
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-mono">
                            <span className="text-muted-foreground">
                              GWA: <strong className="text-foreground">{item.weightedPoints.gwa.toFixed(1)}</strong>
                            </span>
                            <span className="text-muted-foreground">
                              Inc: <strong className="text-foreground">{item.weightedPoints.income.toFixed(1)}</strong>
                            </span>
                            <span className="text-muted-foreground">
                              HH: <strong className="text-foreground">{item.weightedPoints.household.toFixed(1)}</strong>
                            </span>
                            <span className="text-muted-foreground">
                              Prio: <strong className="text-foreground">{item.weightedPoints.priority.toFixed(1)}</strong>
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-lg font-bold font-mono text-foreground">
                            {item.compositeScore.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1 items-start">
                            {renderDecisionBadge(item)}
                            {item.decision?.remarks && (
                              <span className="text-[11px] text-muted-foreground max-w-[180px] truncate" title={item.decision.remarks}>
                                {item.decision.remarks}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-5">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDecisionDialog(item)}
                              className="h-8 text-xs"
                            >
                              Decide
                            </Button>
                            <Link
                              to={`/admin/applications/${item.referenceNumber}`}
                              className="inline-flex items-center justify-center rounded-md size-8 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                              title="Open full application review"
                            >
                              <ExternalLink className="size-3.5" />
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Flagged Hold Section */}
      {data && data.flaggedHold.length > 0 && (
        <Card className="border-destructive/30 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-4" />
              Excluded from Ranking — Flagged Cross-Reference Hold ({data.flaggedHold.length})
            </CardTitle>
            <CardDescription className="text-xs">
              These applicants matched external masterlists and require manual clearance before receiving a quota slot.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {data.flaggedHold.map((item) => (
              <div
                key={item.referenceNumber}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border border-border bg-background text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs text-muted-foreground">{item.referenceNumber}</span>
                  <span className="font-medium text-foreground">{item.fullName}</span>
                  <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 text-[11px]">
                    {item.flagReasons[0] || "Cross-Match Hold"}
                  </Badge>
                </div>
                <Link
                  to={`/admin/applications/${item.referenceNumber}`}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Inspect Flag
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Human-in-the-Loop Confirm / Override Dialog */}
      <AlertDialog open={!!activeApplicant} onOpenChange={(open) => !open && setActiveApplicant(null)}>
        <AlertDialogContent className="sm:max-w-md p-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Human-in-the-Loop Decision</AlertDialogTitle>
            <AlertDialogDescription>
              {activeApplicant
                ? `Record committee action for ${activeApplicant.fullName} (${activeApplicant.referenceNumber}, Score: ${activeApplicant.compositeScore.toFixed(2)}). All overrides are logged permanently.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="mcda-decision-select" className="text-xs font-medium">
                Decision Action
              </Label>
              <select
                id="mcda-decision-select"
                value={decisionType}
                onChange={(e) => setDecisionType(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                {DECISION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="mcda-override-remarks" className="text-xs font-medium">
                Justification Remarks {decisionType.startsWith("OVERRIDE_") ? "(Required)" : "(Optional)"}
              </Label>
              <Textarea
                id="mcda-override-remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="State the committee basis for confirming or overriding this recommendation..."
                rows={3}
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSavingDecision}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isSavingDecision}
              onClick={(e) => {
                e.preventDefault()
                handleSaveDecision()
              }}
            >
              {isSavingDecision ? "Saving..." : "Save Decision"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
