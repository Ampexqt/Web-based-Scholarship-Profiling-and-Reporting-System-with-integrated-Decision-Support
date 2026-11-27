import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileStack, CheckCircle2, ClipboardCheck, ShieldAlert } from "lucide-react"

interface DashboardKpiRowProps {
  stats: {
    total: number
    pending: number
    approved: number
    rejected: number
    flagged: number
    recentIntakeCount?: number
  }
  rates: {
    approvalRate: number
    verificationProgress: number
    priorityShare: number
  }
  priorityTotalFlags: number
}

export default function DashboardKpiRow({
  stats,
  rates,
  priorityTotalFlags,
}: DashboardKpiRowProps) {
  const processedCount = stats.approved + stats.rejected
  const awaitingCount = stats.pending + stats.flagged

  return (
    <section aria-label="Key Performance Indicators" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* KPI 1: Total Applications */}
      <Card className="border-border shadow-none transition-colors hover:border-primary/40">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground font-sans">
            Total Applications
          </CardTitle>
          <div className="size-8 rounded-md bg-muted flex items-center justify-center text-primary">
            <FileStack className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-foreground">
              {stats.total}
            </span>
            {typeof stats.recentIntakeCount === "number" && stats.recentIntakeCount > 0 ? (
              <Badge variant="secondary" className="font-mono text-[11px] font-medium">
                +{stats.recentIntakeCount} / 7d
              </Badge>
            ) : (
              <Badge variant="outline" className="font-mono text-[11px] font-medium text-muted-foreground">
                {stats.pending} pending
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.approved} approved, {stats.rejected} rejected, {stats.flagged} flagged
          </p>
        </CardContent>
      </Card>

      {/* KPI 2: Approval Rate (%) */}
      <Card className="border-border shadow-none transition-colors hover:border-primary/40">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground font-sans">
            Approval Rate
          </CardTitle>
          <div className="size-8 rounded-md bg-muted flex items-center justify-center text-primary">
            <CheckCircle2 className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-foreground">
              {rates.approvalRate}%
            </span>
            <Badge variant="secondary" className="font-mono text-[11px] font-medium">
              {stats.approved} / {processedCount}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Share of evaluated applications approved for grant
          </p>
        </CardContent>
      </Card>

      {/* KPI 3: Verification Progress (%) */}
      <Card className="border-border shadow-none transition-colors hover:border-primary/40">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground font-sans">
            Verification Progress
          </CardTitle>
          <div className="size-8 rounded-md bg-muted flex items-center justify-center text-primary">
            <ClipboardCheck className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-foreground">
              {rates.verificationProgress}%
            </span>
            <Badge variant="outline" className="font-mono text-[11px] font-medium text-muted-foreground">
              {awaitingCount} left
            </Badge>
          </div>
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, rates.verificationProgress))}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* KPI 4: Priority Sector Share (%) */}
      <Card className="border-border shadow-none transition-colors hover:border-primary/40">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground font-sans">
            Priority Sector Share
          </CardTitle>
          <div className="size-8 rounded-md bg-muted flex items-center justify-center text-primary">
            <ShieldAlert className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-foreground">
              {rates.priorityShare}%
            </span>
            <Badge variant="secondary" className="font-mono text-[11px] font-medium">
              {priorityTotalFlags} tags
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Applicants under PWD, Solo Parent, IP, Indigent, or Athletics
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
