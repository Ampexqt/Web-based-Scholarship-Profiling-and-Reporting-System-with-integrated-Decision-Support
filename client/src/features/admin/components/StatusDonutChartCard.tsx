import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart as PieChartIcon } from "lucide-react"

interface StatusDonutChartCardProps {
  stats: {
    total: number
    pending: number
    approved: number
    rejected: number
    flagged?: number
  }
  rates: {
    approvalRate: number
    verificationProgress: number
    priorityShare: number
  }
}

export default function StatusDonutChartCard({ stats, rates }: StatusDonutChartCardProps) {
  const { total, pending, approved, rejected, flagged = 0 } = stats

  const radius = 56
  const circumference = 2 * Math.PI * radius // ~351.86
  const strokeWidth = 14

  const approvedShare = total > 0 ? approved / total : 0
  const pendingShare = total > 0 ? pending / total : 0
  const flaggedShare = total > 0 ? flagged / total : 0
  const rejectedShare = total > 0 ? rejected / total : 0

  const approvedDash = approvedShare * circumference
  const pendingDash = pendingShare * circumference
  const flaggedDash = flaggedShare * circumference
  const rejectedDash = rejectedShare * circumference

  const approvedOffset = 0
  const pendingOffset = -approvedDash
  const flaggedOffset = -(approvedDash + pendingDash)
  const rejectedOffset = -(approvedDash + pendingDash + flaggedDash)

  const items = [
    {
      label: "Approved",
      count: approved,
      percentage: total > 0 ? Math.round(approvedShare * 100) : 0,
      dotClass: "bg-primary",
      colorVar: "var(--color-primary)",
    },
    {
      label: "Pending",
      count: pending,
      percentage: total > 0 ? Math.round(pendingShare * 100) : 0,
      dotClass: "bg-accent",
      colorVar: "var(--color-accent)",
    },
    {
      label: "Flagged",
      count: flagged,
      percentage: total > 0 ? Math.round(flaggedShare * 100) : 0,
      dotClass: "bg-destructive",
      colorVar: "var(--color-destructive)",
    },
    {
      label: "Rejected",
      count: rejected,
      percentage: total > 0 ? Math.round(rejectedShare * 100) : 0,
      dotClass: "bg-muted-foreground",
      colorVar: "var(--color-muted-foreground)",
    }
  ]

  return (
    <Card className="flex flex-col border-border/80 shadow-xs h-full">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
              <PieChartIcon className="w-4 h-4 text-primary" />
              Application Status
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Processing pipeline & verification status
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs font-mono">
            {rates.verificationProgress}% Verified
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Modern Donut Chart */}
        <div className="flex items-center justify-center relative py-2">
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 150 150">
            {/* Background Track */}
            <circle
              cx="75"
              cy="75"
              r={radius}
              className="stroke-muted/60"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Approved Arc */}
            {approvedDash > 0 && (
              <circle
                cx="75"
                cy="75"
                r={radius}
                stroke="var(--color-primary)"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${approvedDash} ${circumference}`}
                strokeDashoffset={approvedOffset}
                className="transition-all duration-500 ease-out"
              />
            )}

            {/* Pending Arc */}
            {pendingDash > 0 && (
              <circle
                cx="75"
                cy="75"
                r={radius}
                stroke="var(--color-accent)"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${pendingDash} ${circumference}`}
                strokeDashoffset={pendingOffset}
                className="transition-all duration-500 ease-out"
              />
            )}

            {/* Flagged Arc */}
            {flaggedDash > 0 && (
              <circle
                cx="75"
                cy="75"
                r={radius}
                stroke="var(--color-destructive)"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${flaggedDash} ${circumference}`}
                strokeDashoffset={flaggedOffset}
                className="transition-all duration-500 ease-out"
              />
            )}

            {/* Rejected Arc */}
            {rejectedDash > 0 && (
              <circle
                cx="75"
                cy="75"
                r={radius}
                stroke="var(--color-muted-foreground)"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${rejectedDash} ${circumference}`}
                strokeDashoffset={rejectedOffset}
                className="transition-all duration-500 ease-out"
              />
            )}
          </svg>

          {/* Donut Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-3xl font-bold font-sans text-foreground leading-none">
              {total}
            </span>
            <span className="text-[11px] uppercase text-muted-foreground font-medium mt-1 tracking-wider">
              Total Intake
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-border/50">
          {items.map((item) => (
            <div 
              key={item.label} 
              className="p-2 rounded-lg bg-muted/30 border border-border/60 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${item.dotClass}`} />
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              <div className="flex items-center gap-1 font-mono">
                <span className="font-semibold text-foreground">{item.count}</span>
                <span className="text-[11px] text-muted-foreground">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
