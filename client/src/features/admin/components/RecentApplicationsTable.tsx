import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { ArrowRight, FileText } from "lucide-react"

// Mock data based on project requirements
const recentApplications = [
  {
    id: "APP-2026-0842",
    name: "Dela Cruz, Juan M.",
    course: "BS Information Technology",
    status: "Pending",
    date: "2026-07-28",
    isPriority: false,
  },
  {
    id: "APP-2026-0843",
    name: "Reyes, Maria C.",
    course: "BS Civil Engineering",
    status: "Pending",
    date: "2026-07-28",
    isPriority: true,
  },
  {
    id: "APP-2026-0840",
    name: "Santos, Mark J.",
    course: "BS Business Administration",
    status: "Verified",
    date: "2026-07-27",
    isPriority: false,
  },
  {
    id: "APP-2026-0839",
    name: "Garcia, Ana L.",
    course: "BS Accountancy",
    status: "Flagged",
    date: "2026-07-27",
    isPriority: false,
  },
  {
    id: "APP-2026-0835",
    name: "Mendoza, Paul R.",
    course: "BS Information Technology",
    status: "Pending",
    date: "2026-07-26",
    isPriority: true,
  }
]

export default function RecentApplicationsTable() {
  return (
    <Card className="col-span-full lg:col-span-3 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Applications awaiting review and verification</CardDescription>
        </div>
        <Link to="/admin/applications" className="text-sm font-medium text-primary hover:underline flex items-center gap-1 group">
          View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px] pl-6">App ID</TableHead>
              <TableHead>Applicant Name</TableHead>
              <TableHead className="hidden md:table-cell">Course</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentApplications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium text-muted-foreground pl-6">{app.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{app.name}</span>
                    {app.isPriority && (
                      <span className="w-2 h-2 rounded-full bg-destructive" title="Priority Applicant" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{app.course}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      app.status === 'Verified' ? 'default' :
                      app.status === 'Flagged' ? 'destructive' :
                      app.status === 'Pending' ? 'secondary' :
                      'outline'
                    }
                  >
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Link 
                    to={`/admin/applications/${app.id}`} 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="sr-only">Review</span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
