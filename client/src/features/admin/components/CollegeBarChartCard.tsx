import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2 } from "lucide-react"

interface CollegeBarChartCardProps {
  data: Record<string, number>
  total: number
}

const KNOWN_ACRONYMS: Record<string, string> = {
  "College of Teacher Education": "CTE",
  "College of Physical Education and Sports": "CPES",
  "College of Maritime Education": "CME",
  "College of Information and Computing Sciences": "CICS",
  "College of Engineering and Technology": "CET",
  "College of Arts, Humanities, and Social Sciences": "CAHSS",
  "School of Business Administration": "SBA"
}

export default function CollegeBarChartCard({ data, total }: CollegeBarChartCardProps) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1])
  const maxCount = entries.length > 0 ? Math.max(...entries.map(([, c]) => c)) : 1

  return (
    <Card className="flex flex-col border-border/80 shadow-xs h-full">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
              <Building2 className="w-4 h-4 text-primary" />
              Applications by College
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Applicant distribution across academic departments
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            {entries.length} College{entries.length === 1 ? "" : "s"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-5 flex-1">
        {entries.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-muted-foreground text-xs">
            <Building2 className="w-8 h-8 mb-2 opacity-30" />
            No college records recorded yet.
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map(([collegeName, count], idx) => {
              const acronym = KNOWN_ACRONYMS[collegeName]
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0
              const widthPercentage = Math.max(Math.round((count / maxCount) * 100), 6)

              return (
                <div key={collegeName} className="space-y-1.5 group">
                  <div className="flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2 min-w-0 truncate" title={collegeName}>
                      <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center font-mono text-[10px] font-semibold text-muted-foreground shrink-0">
                        #{idx + 1}
                      </span>
                      {acronym ? (
                        <span className="font-bold text-primary shrink-0">{acronym}</span>
                      ) : null}
                      <span className="text-foreground truncate">{collegeName}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 font-mono">
                      <span className="font-semibold text-foreground text-xs">
                        {count} {count === 1 ? "applicant" : "applicants"}
                      </span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium">
                        {percentage}%
                      </Badge>
                    </div>
                  </div>

                  {/* Modern Proportional Meter Track */}
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
        )}
      </CardContent>
    </Card>
  )
}
