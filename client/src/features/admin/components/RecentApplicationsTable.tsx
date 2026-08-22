import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { ArrowRight, FileText } from "lucide-react"
import { useState, useEffect } from "react"
import { apiClient } from "@/lib/axios"
import { getAcronym } from "@/lib/utils"

interface Application {
  id: string;
  name: string;
  college: string;
  course: string;
  status: string;
  date: string;
  isPriority: boolean;
}

// Applications state to be fetched from API
const initialApplications: Application[] = []

export default function RecentApplicationsTable() {
  const [recentApplications, setRecentApplications] = useState<Application[]>(initialApplications);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const res: any = await apiClient.get('/applications');
        if (res.success) {
          // Take only the first 5 recent apps
          setRecentApplications(res.applications.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, []);

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
              <TableHead className="hidden xl:table-cell">College</TableHead>
              <TableHead className="hidden md:table-cell">Course</TableHead>
              <TableHead className="hidden md:table-cell">Date Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6 w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Loading recent applications...
                </TableCell>
              </TableRow>
            ) : recentApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No recent applications found.
                </TableCell>
              </TableRow>
            ) : (
              recentApplications.map((app) => (
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
                  <TableCell className="hidden xl:table-cell text-muted-foreground" title={app.college}>
                    {getAcronym(app.college)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground" title={app.course}>
                    {getAcronym(app.course)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {new Date(app.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        app.status === 'Flagged' ? 'destructive' :
                        app.status === 'Pending Review' ? 'secondary' :
                        'outline'
                      }
                      className={
                        app.status === 'Flagged' ? 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 border' :
                        app.status === 'Pending Review' ? 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border-transparent' : ''
                      }
                    >
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Link 
                      to={`/admin/applications/${app.id}`} 
                      className="inline-flex items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary bg-muted/50 px-3 py-1.5 text-muted-foreground"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
