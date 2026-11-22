import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Building2 } from "lucide-react"

interface CollegeDistributionProps {
  data: Record<string, number>
  total: number
}

// Map long names to recognizable acronyms if needed
const COLLEGE_ACRONYMS: Record<string, string> = {
  "College of Teacher Education": "CTE",
  "College of Physical Education and Sports": "CPES",
  "College of Maritime Education": "CME",
  "College of Information and Computing Sciences": "CICS",
  "College of Engineering and Technology": "CET",
  "College of Arts, Humanities, and Social Sciences": "CAHSS",
  "School of Business Administration": "SBA"
}

export default function CollegeDistributionCard({ data, total }: CollegeDistributionProps) {
  // Sort colleges by volume descending
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1])
  const maxCount = entries.length > 0 ? Math.max(...entries.map(([, count]) => count)) : 1

  return (
    <Card className="col-span-1 xl:col-span-2 flex flex-col border-border/80 shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              Applicant Distribution by College
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Breakdown of student demand across university departments
            </CardDescription>
          </div>
          <span className="text-xs font-mono text-muted-foreground bg-muted/40 px-2 py-0.5 rounded border border-border/50">
            {entries.length} Active Colleges
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-2 flex-1">
        {entries.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-muted-foreground text-xs">
            <Building2 className="w-8 h-8 mb-2 opacity-30" />
            No college records recorded yet.
          </div>
        ) : (
          <div className="space-y-3.5">
            {entries.map(([collegeName, count]) => {
              const abbr = COLLEGE_ACRONYMS[collegeName] || collegeName
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0
              const barWidth = Math.max(Math.round((count / maxCount) * 100), 4)

              return (
                <div key={collegeName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground truncate max-w-[280px]" title={collegeName}>
                      <span className="font-bold text-primary mr-1.5">{abbr}</span>
                      <span className="text-muted-foreground font-normal">({collegeName})</span>
                    </span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-semibold text-foreground">{count}</span>
                      <span className="text-muted-foreground text-[11px] w-9 text-right">{percentage}%</span>
                    </div>
                  </div>
                  {/* Meter Track */}
                  <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${barWidth}%` }}
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
