import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Accessibility, Baby, Mountain, Trophy, HandHeart } from "lucide-react"
import { Link } from "react-router-dom"

const priorityGroups = [
  {
    id: "pwd",
    label: "Person with Disability",
    count: 14,
    icon: Accessibility,
  },
  {
    id: "solo-parent",
    label: "Solo Parent",
    count: 8,
    icon: Baby,
  },
  {
    id: "ip",
    label: "Indigenous Peoples",
    count: 22,
    icon: Mountain,
  },
  {
    id: "sports-arts",
    label: "Sports & Arts",
    count: 5,
    icon: Trophy,
  },
  {
    id: "indigent",
    label: "Indigent",
    count: 45,
    icon: HandHeart,
  }
]

export default function PriorityGroupWidget() {
  return (
    <Card className="col-span-full lg:col-span-1 flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Priority Groups</span>
          <Users className="w-4 h-4 text-muted-foreground" />
        </CardTitle>
        <CardDescription>Applicants requiring special attention</CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="flex flex-col flex-1 divide-y">
          {priorityGroups.map((group) => (
            <Link 
              to={`priority-groups/${group.id}`} 
              key={group.id} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 px-6 hover:bg-muted/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <group.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{group.label}</span>
              </div>
              <Badge variant="secondary">
                {group.count}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
