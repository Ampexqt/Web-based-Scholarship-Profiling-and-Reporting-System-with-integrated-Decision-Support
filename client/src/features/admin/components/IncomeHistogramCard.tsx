import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet } from "lucide-react"

interface IncomeHistogramCardProps {
  distribution: {
    below10k: number
    from10kTo20k: number
    from20kTo40k: number
    above40k: number
  }
}

const BRACKETS = [
  {
    key: "below10k" as const,
    label: "< ₱10,000",
    tier: "Extreme Poverty",
  },
  {
    key: "from10kTo20k" as const,
    label: "₱10,001 – ₱20,000",
    tier: "Low Income",
  },
  {
    key: "from20kTo40k" as const,
    label: "₱20,001 – ₱40,000",
    tier: "Lower Middle",
  },
  {
    key: "above40k" as const,
    label: "> ₱40,000",
    tier: "Moderate Income",
  },
]

export default function IncomeHistogramCard({ distribution }: IncomeHistogramCardProps) {
  const values = Object.values(distribution)
  const maxCount = Math.max(...values, 1)
  const totalWithIncome = values.reduce((a, b) => a + b, 0)

  return (
    <Card className="flex flex-col border-border shadow-none h-full">
      <CardHeader className="pb-3 border-b border-border/60">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
              <Wallet className="size-4 text-primary" />
              Household Monthly Income Distribution
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Applicant household distribution across socio-economic income brackets
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-mono shrink-0">
            {totalWithIncome} Profile{totalWithIncome === 1 ? "" : "s"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 flex-1 flex flex-col justify-between gap-4">
        {/* Column Histogram */}
        <div className="grid grid-cols-4 gap-3 sm:gap-5 items-end h-56 pt-6 pb-2 border-b border-border/60">
          {BRACKETS.map((bracket) => {
            const count = distribution[bracket.key] || 0
            const percentage = totalWithIncome > 0 ? Math.round((count / totalWithIncome) * 100) : 0
            const heightPercentage =
              maxCount > 0 && count > 0
                ? Math.max(Math.round((count / maxCount) * 100), 10)
                : 4

            return (
              <div key={bracket.key} className="flex flex-col items-center justify-end h-full gap-2 group">
                <div className="flex flex-col items-center gap-0.5 font-mono">
                  <span className="text-sm font-bold text-foreground">{count}</span>
                  <span className="text-[11px] text-muted-foreground">{percentage}%</span>
                </div>
                <div className="w-full max-w-[68px] flex-1 flex items-end justify-center bg-muted/40 rounded-t-md border border-border/40 overflow-hidden p-1">
                  <div
                    className="w-full rounded-t-sm bg-primary transition-all duration-500 ease-out group-hover:bg-primary/85"
                    style={{ height: `${heightPercentage}%` }}
                    title={`${bracket.label}: ${count} applicants (${percentage}%)`}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* X-Axis Labels */}
        <div className="grid grid-cols-4 gap-3 sm:gap-5 text-center">
          {BRACKETS.map((bracket) => (
            <div key={bracket.key} className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold font-mono text-foreground leading-tight">
                {bracket.label}
              </span>
              <span className="text-[11px] text-muted-foreground leading-tight">
                {bracket.tier}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
