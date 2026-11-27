import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface PrioritySectorDonutCardProps {
  stats: {
    pwd: number
    soloParent: number
    ip: number
    athlete: number
    indigent: number
  }
}

const SECTORS = [
  {
    id: "indigent",
    key: "indigent" as const,
    label: "Indigent / 4Ps",
    stroke: "var(--color-primary)",
    dotClass: "bg-primary",
  },
  {
    id: "solo-parent",
    key: "soloParent" as const,
    label: "Solo Parent",
    stroke: "var(--color-accent)",
    dotClass: "bg-accent",
  },
  {
    id: "pwd",
    key: "pwd" as const,
    label: "Person with Disability",
    stroke: "var(--color-destructive)",
    dotClass: "bg-destructive",
  },
  {
    id: "ip",
    key: "ip" as const,
    label: "Indigenous Peoples",
    stroke: "var(--color-foreground)",
    dotClass: "bg-foreground",
  },
  {
    id: "sports-arts",
    key: "athlete" as const,
    label: "Sports & Arts",
    stroke: "var(--color-muted-foreground)",
    dotClass: "bg-muted-foreground",
  },
]

export default function PrioritySectorDonutCard({ stats }: PrioritySectorDonutCardProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  const totalTags =
    stats.indigent + stats.soloParent + stats.pwd + stats.ip + stats.athlete

  const radius = 56
  const circumference = 2 * Math.PI * radius
  const strokeWidth = 14

  let cumulativeDash = 0
  const segments = SECTORS.map((sector) => {
    const count = stats[sector.key] || 0
    const share = totalTags > 0 ? count / totalTags : 0
    const dash = share * circumference
    const offset = -cumulativeDash
    cumulativeDash += dash

    return {
      ...sector,
      count,
      percentage: totalTags > 0 ? Math.round(share * 100) : 0,
      dash,
      offset,
    }
  })

  const activeSegment = segments.find((s) => s.key === hoveredKey) ?? null

  return (
    <Card className="flex flex-col border-border shadow-none h-full">
      <CardHeader className="pb-3 border-b border-border/60">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
              <Users className="size-4 text-primary" />
              Priority Sector Composition
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Distribution of affirmative-action classifications
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-mono shrink-0">
            {totalTags} Total
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-5 flex-1 flex flex-col justify-between gap-5">
        <div className="flex items-center justify-center relative py-1">
          <svg className="size-40 -rotate-90" viewBox="0 0 150 150" role="img" aria-label="Priority Sector Composition Donut Chart">
            <circle
              cx="75"
              cy="75"
              r={radius}
              className="stroke-muted/60"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {segments.map((seg) =>
              seg.dash > 0 ? (
                <circle
                  key={seg.key}
                  cx="75"
                  cy="75"
                  r={radius}
                  stroke={seg.stroke}
                  strokeWidth={hoveredKey === seg.key ? strokeWidth + 3 : strokeWidth}
                  fill="transparent"
                  strokeDasharray={`${seg.dash} ${circumference}`}
                  strokeDashoffset={seg.offset}
                  className="transition-all duration-300 ease-out cursor-pointer"
                  opacity={hoveredKey && hoveredKey !== seg.key ? 0.35 : 1}
                  onMouseEnter={() => setHoveredKey(seg.key)}
                  onMouseLeave={() => setHoveredKey(null)}
                />
              ) : null
            )}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6">
            <span className="text-2xl font-bold font-mono text-foreground leading-none">
              {activeSegment ? `${activeSegment.percentage}%` : totalTags}
            </span>
            <span className="text-[10px] uppercase text-muted-foreground font-medium mt-1 tracking-wider truncate max-w-[96px]">
              {activeSegment ? activeSegment.label : "Priority Tags"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 pt-3 border-t border-border/50">
          {segments.map((seg) => (
            <Link
              key={seg.key}
              to={`priority-groups/${seg.id}`}
              onMouseEnter={() => setHoveredKey(seg.key)}
              onMouseLeave={() => setHoveredKey(null)}
              className={cn(
                "px-2.5 py-1.5 rounded-md border border-transparent flex items-center justify-between text-xs transition-colors",
                hoveredKey === seg.key
                  ? "bg-muted/70 border-border"
                  : "hover:bg-muted/40"
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={cn("size-2.5 rounded-full shrink-0", seg.dotClass)} />
                <span className="font-medium text-foreground truncate">{seg.label}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono shrink-0">
                <span className="font-semibold text-foreground">{seg.count}</span>
                <span className="text-[11px] text-muted-foreground">({seg.percentage}%)</span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
