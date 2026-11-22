import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Wallet, Info } from "lucide-react"

interface IncomeDistributionProps {
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
    description: "Extreme Poverty / Indigent",
    colorBar: "bg-emerald-500",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
  },
  {
    key: "from10kTo20k" as const,
    label: "₱10k - ₱20k",
    description: "Low Income",
    colorBar: "bg-sky-500",
    badgeBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400"
  },
  {
    key: "from20kTo40k" as const,
    label: "₱20k - ₱40k",
    description: "Lower Middle Income",
    colorBar: "bg-amber-500",
    badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
  },
  {
    key: "above40k" as const,
    label: "> ₱40,000",
    description: "Middle Income",
    colorBar: "bg-slate-400",
    badgeBg: "bg-slate-500/10 text-slate-600 dark:text-slate-400"
  }
]

export default function IncomeDistributionCard({ distribution, total }: IncomeDistributionProps) {
  const values = Object.values(distribution)
  const maxCount = Math.max(...values, 1)
  const totalWithIncome = values.reduce((a, b) => a + b, 0)
  const indigentShare = totalWithIncome > 0 ? Math.round(((distribution.below10k + distribution.from10kTo20k) / totalWithIncome) * 100) : 0

  return (
    <Card className="col-span-1 flex flex-col border-border/80 shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Household Monthly Income
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Socio-economic distribution of student applicants
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 flex-1 flex flex-col justify-between">
        <div className="space-y-3.5">
          {BRACKETS.map((bracket) => {
            const count = distribution[bracket.key] || 0
            const percentage = totalWithIncome > 0 ? Math.round((count / totalWithIncome) * 100) : 0
            const barWidth = Math.max(Math.round((count / maxCount) * 100), 4)

            return (
              <div key={bracket.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground font-mono">{bracket.label}</span>
                    <span className="text-[11px] text-muted-foreground hidden sm:inline">({bracket.description})</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-semibold text-foreground">{count}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${bracket.badgeBg}`}>
                      {percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ease-out ${bracket.colorBar}`} 
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Poverty Target Callout */}
        <div className="mt-5 p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed">
            <span className="font-bold">{indigentShare}%</span> of applicants fall under the low-income/indigent threshold (&le; ₱20,000/mo), prioritizing them in the DSS Needs-Based matrix.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
