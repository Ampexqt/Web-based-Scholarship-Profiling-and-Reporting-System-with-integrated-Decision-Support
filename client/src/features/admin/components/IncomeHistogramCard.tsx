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
  total: number
}

const BRACKETS = [
  {
    key: "below10k" as const,
    label: "< ₱10,000",
    tier: "Indigent / 4Ps",
  },
  {
    key: "from10kTo20k" as const,
    label: "₱10,000 – ₱20,000",
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
    tier: "Middle Income & Above",
  }
]

export default function IncomeHistogramCard({ distribution, total }: IncomeHistogramCardProps) {
  const values = Object.values(distribution)
  const maxCount = Math.max(...values, 1)
  const totalWithIncome = values.reduce((a, b) => a + b, 0)

  return (
    <Card className="flex flex-col border-border/80 shadow-xs h-full">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
              <Wallet className="w-4 h-4 text-primary" />
              Household Monthly Income
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Socio-economic brackets across applicant households
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            {totalWithIncome} Profile{totalWithIncome === 1 ? "" : "s"} Recorded
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-5 flex-1">
        <div className="space-y-4">
          {BRACKETS.map((bracket) => {
            const count = distribution[bracket.key] || 0
            const percentage = totalWithIncome > 0 ? Math.round((count / totalWithIncome) * 100) : 0
            const widthPercentage = maxCount > 0 && count > 0 
              ? Math.max(Math.round((count / maxCount) * 100), 5) 
              : 0

            return (
              <div key={bracket.key} className="space-y-1.5 group">
                <div className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground font-mono">{bracket.label}</span>
                    <span className="text-muted-foreground text-[11px]">({bracket.tier})</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-mono">
                    <span className="font-medium text-foreground text-xs">
                      {count} {count === 1 ? "applicant" : "applicants"}
                    </span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium">
                      {percentage}%
                    </Badge>
                  </div>
                </div>

                <div className="w-full bg-muted/60 h-2.5 rounded-full overflow-hidden p-0.5 border border-border/40">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${widthPercentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
