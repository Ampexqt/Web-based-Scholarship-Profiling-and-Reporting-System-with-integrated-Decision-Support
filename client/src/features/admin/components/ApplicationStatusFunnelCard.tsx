import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PieChart, CheckCircle2, Clock, AlertTriangle, XCircle } from "lucide-react"

interface ApplicationStatusFunnelProps {
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

export default function ApplicationStatusFunnelCard({ stats, rates }: ApplicationStatusFunnelProps) {
  const { total, pending, approved, rejected, flagged = 0 } = stats
  const processed = approved + rejected

  return (
    <Card className="col-span-1 flex flex-col border-border/80 shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <PieChart className="w-4 h-4 text-primary" />
              Processing Funnel & Efficiency
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Verification progress and application health
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 flex-1 flex flex-col justify-between space-y-4">
        {/* Progress Bar Funnel */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-muted-foreground">Verification Completion</span>
            <span className="font-mono font-bold text-foreground">{rates.verificationProgress}%</span>
          </div>
          <div className="w-full bg-muted/60 h-3 rounded-full overflow-hidden flex">
            <div 
              style={{ width: `${total > 0 ? (approved / total) * 100 : 0}%` }} 
              className="bg-emerald-500 transition-all duration-500" 
              title={`Approved: ${approved}`}
            />
            <div 
              style={{ width: `${total > 0 ? (rejected / total) * 100 : 0}%` }} 
              className="bg-rose-500 transition-all duration-500" 
              title={`Rejected: ${rejected}`}
            />
            <div 
              style={{ width: `${total > 0 ? (flagged / total) * 100 : 0}%` }} 
              className="bg-amber-500 transition-all duration-500" 
              title={`Flagged: ${flagged}`}
            />
            <div 
              style={{ width: `${total > 0 ? (pending / total) * 100 : 0}%` }} 
              className="bg-muted-foreground/30 transition-all duration-500" 
              title={`Pending: ${pending}`}
            />
          </div>
        </div>

        {/* 4 Status Micro-Cards */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="p-2.5 rounded-lg border border-emerald-200/50 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approved</span>
            </div>
            <div className="text-lg font-bold font-mono text-emerald-900 dark:text-emerald-200 mt-1">
              {approved}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {rates.approvalRate}% of processed
            </div>
          </div>

          <div className="p-2.5 rounded-lg border border-border bg-muted/20">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Pending</span>
            </div>
            <div className="text-lg font-bold font-mono text-foreground mt-1">
              {pending}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              In review queue
            </div>
          </div>

          <div className="p-2.5 rounded-lg border border-amber-200/50 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20">
            <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Flagged</span>
            </div>
            <div className="text-lg font-bold font-mono text-amber-900 dark:text-amber-200 mt-1">
              {flagged}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Masterlist match
            </div>
          </div>

          <div className="p-2.5 rounded-lg border border-rose-200/50 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20">
            <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 text-xs font-semibold">
              <XCircle className="w-3.5 h-3.5" />
              <span>Rejected</span>
            </div>
            <div className="text-lg font-bold font-mono text-rose-900 dark:text-rose-200 mt-1">
              {rejected}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Ineligible criteria
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
