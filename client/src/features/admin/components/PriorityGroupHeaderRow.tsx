import { Users, Accessibility, Baby, Mountain, Trophy, HandHeart } from "lucide-react"
import { Link } from "react-router-dom"

interface PriorityGroupStats {
  pwd: number
  soloParent: number
  ip: number
  athlete: number
  indigent: number
}

interface PriorityGroupHeaderRowProps {
  stats: PriorityGroupStats
  totalApplicants: number
}

const PRIORITY_GROUPS = [
  {
    id: "indigent",
    label: "Indigent / 4Ps",
    key: "indigent" as keyof PriorityGroupStats,
    icon: HandHeart,
  },
  {
    id: "solo-parent",
    label: "Solo Parent",
    key: "soloParent" as keyof PriorityGroupStats,
    icon: Baby,
  },
  {
    id: "pwd",
    label: "Person w/ Disability",
    key: "pwd" as keyof PriorityGroupStats,
    icon: Accessibility,
  },
  {
    id: "ip",
    label: "Indigenous Peoples",
    key: "ip" as keyof PriorityGroupStats,
    icon: Mountain,
  },
  {
    id: "sports-arts",
    label: "Sports & Arts",
    key: "athlete" as keyof PriorityGroupStats,
    icon: Trophy,
  }
]

export default function PriorityGroupHeaderRow({ stats, totalApplicants }: PriorityGroupHeaderRowProps) {
  const totalPriorityCount = Object.values(stats).reduce((acc, curr) => acc + curr, 0)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Priority Groups
        </h2>
        <span className="text-xs text-muted-foreground font-mono">
          {totalPriorityCount} total flagged
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {PRIORITY_GROUPS.map((group) => {
          const count = stats[group.key] || 0

          return (
            <Link
              key={group.id}
              to={`priority-groups/${group.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card border border-border hover:border-primary/50 hover:shadow-xs rounded-xl p-3.5 transition-all duration-200 flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-lg bg-muted text-primary shrink-0 group-hover:bg-primary/10 transition-colors">
                <group.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate" title={group.label}>
                  {group.label}
                </p>
                <p className="text-2xl font-bold font-sans text-foreground leading-tight mt-0.5">
                  {count}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
