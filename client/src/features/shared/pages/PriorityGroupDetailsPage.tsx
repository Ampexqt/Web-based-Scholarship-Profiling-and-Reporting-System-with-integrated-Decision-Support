import { useParams, Link, useLocation } from "react-router-dom"
import { ArrowLeft, Users, Building, FileText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useEffect } from "react"
import { apiClient } from "@/lib/axios"
import { academicStructure } from "@/features/application/data/academicStructure"

// Priority groups mapping
const priorityGroupNames: Record<string, string> = {
  "pwd": "Person with Disability",
  "solo-parent": "Solo Parent",
  "ip": "Indigenous Peoples",
  "sports-arts": "Sports & Arts",
  "indigent": "Indigent"
}

interface Applicant {
  id: string;
  name: string;
  date: string;
  status: string;
}

interface CourseGroup {
  courseName: string;
  applicants: Applicant[];
}

interface CollegeGroup {
  collegeId: string;
  collegeName: string;
  shortName: string;
  courses: CourseGroup[];
}

export function PriorityGroupDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const groupName = id ? priorityGroupNames[id] : "Unknown Group";
  
  const [groupedData, setGroupedData] = useState<CollegeGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalGroupApplicants, setTotalGroupApplicants] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res: any = await apiClient.get('/applications');
        if (res.success && res.applications) {
          // Filter by priority group
          const targetGroup = id || '';
          const filteredApps = res.applications.filter((app: any) => 
            app.priorityGroups && app.priorityGroups.includes(targetGroup)
          );
          
          setTotalGroupApplicants(filteredApps.length);

          // Group by college and course based on academicStructure
          const newGroupedData: CollegeGroup[] = academicStructure.map(college => {
            const courses = college.programs.map(program => {
              // Find applicants for this program
              const programApplicants = filteredApps.filter((app: any) => 
                app.college === college.name && app.course === program.name
              ).map((app: any) => ({
                id: app.id,
                name: app.name,
                status: app.status,
                date: new Date(app.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
              }));

              return {
                courseName: program.name,
                applicants: programApplicants
              };
            });

            return {
              collegeId: college.abbr.toLowerCase(),
              collegeName: college.name,
              shortName: college.abbr,
              courses: courses
            };
          });

          setGroupedData(newGroupedData);
        }
      } catch (error) {
        console.error("Failed to fetch applications for group:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  // Determine dashboard return path
  const returnPath = location.pathname.startsWith('/admin') ? '/admin' : '/staff';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending Review': return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">Pending Review</Badge>;
      case 'Flagged': return <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 border">Flagged</Badge>;
      case 'Approved': return <Badge variant="default" className="bg-primary text-primary-foreground">Approved</Badge>;
      case 'Rejected': return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-16">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6 animate-fade-in-up">
        
        {/* Separated Back Button */}
        <div className="mb-4">
          <Link to={returnPath} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 px-3 py-1.5 rounded-md transition-colors -ml-3">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        {/* Floating Modern Header */}
        <div className="sticky top-6 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border border-border rounded-xl shadow-sm px-6 py-5 flex flex-col justify-center gap-2">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
                  {groupName}
                </h1>
                <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20 font-mono text-sm px-2.5 py-0.5 shadow-sm">
                  {isLoading ? '...' : totalGroupApplicants} Applicants
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                Applicants categorized under this priority group in the Main Campus.
              </p>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar for Colleges + Content Area */}
        <div className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-12 text-muted-foreground">Loading applicants...</div>
          ) : (
            <Tabs defaultValue="cics" className="flex flex-col lg:flex-row gap-8 w-full" orientation="vertical">
              
              {/* Vertical Sidebar */}
              <TabsList className="flex flex-row lg:flex-col h-auto bg-transparent p-0 space-y-0 lg:space-y-1.5 w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-border/60 lg:pr-6 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 justify-start">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 hidden lg:block px-3">Colleges</div>
                
                {groupedData.map((college) => {
                  const totalApplicants = college.courses.reduce((acc, curr) => acc + curr.applicants.length, 0);
                  
                  return (
                    <TabsTrigger 
                      key={college.collegeId} 
                      value={college.collegeId}
                      className="w-auto lg:w-full justify-start px-3 py-2.5 text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-lg flex items-center gap-3 whitespace-nowrap lg:whitespace-normal text-left transition-all hover:bg-muted/50 group"
                    >
                      <div className="p-1.5 rounded-md bg-muted/50 group-data-[state=active]:bg-primary/20 shrink-0">
                        <Building className="w-4 h-4 opacity-70 group-data-[state=active]:opacity-100 group-data-[state=active]:text-primary" />
                      </div>
                      
                      <div className="flex-1 overflow-hidden">
                        <div className="font-semibold text-foreground group-data-[state=active]:text-primary">{college.shortName}</div>
                        <div className="text-xs text-muted-foreground truncate opacity-80 hidden lg:block">{college.collegeName}</div>
                      </div>
                      
                      <Badge 
                        variant="secondary" 
                        className={`ml-auto px-2 py-0.5 min-w-[24px] justify-center text-xs shadow-sm bg-background/50 border-muted-foreground/20 ${totalApplicants === 0 ? 'opacity-40' : 'group-data-[state=active]:bg-primary/20 group-data-[state=active]:text-primary group-data-[state=active]:border-primary/30'}`}
                      >
                        {totalApplicants}
                      </Badge>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {/* Content Area */}
              <div className="flex-1 min-w-0">
                {groupedData.map((college) => {
                  const totalApplicants = college.courses.reduce((acc, curr) => acc + curr.applicants.length, 0);
                  
                  return (
                    <TabsContent key={college.collegeId} value={college.collegeId} className="space-y-6 m-0 focus-visible:outline-none animate-in fade-in slide-in-from-right-4 duration-500">
                      
                      {/* College Header */}
                      <div className="mb-6 pb-4 border-b border-border/40">
                        <h2 className="text-2xl font-serif font-bold text-foreground">{college.collegeName}</h2>
                        <p className="text-muted-foreground text-sm mt-1">Showing all applicants classified under {college.shortName}.</p>
                      </div>

                      {totalApplicants === 0 ? (
                        <div className="text-center py-24 bg-background/50 rounded-2xl border border-dashed border-border/80 flex flex-col items-center justify-center">
                          <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                            <Users className="h-8 w-8 text-muted-foreground/40" />
                          </div>
                          <h3 className="text-xl font-medium text-foreground">No Applicants Found</h3>
                          <p className="text-muted-foreground mt-2 max-w-sm text-center text-sm">There are currently no priority applicants assigned to this specific college.</p>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          {college.courses.map((course) => {
                            if (course.applicants.length === 0) return null;
                            
                            return (
                              <div key={course.courseName} className="space-y-4">
                                {/* Course Header */}
                                <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 border-l-4 border-primary pl-3 py-0.5">
                                    {course.courseName}
                                  </h3>
                                  <Badge variant="secondary" className="bg-muted shadow-sm text-xs px-2.5 py-0.5">
                                    {course.applicants.length} <Users className="w-3 h-3 ml-1.5 opacity-60" />
                                  </Badge>
                                </div>
                                
                                {/* Modern Table Card */}
                                <div className="border bg-background/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
                                  <div className="p-0">
                                    <Table>
                                      <TableHeader className="bg-muted/30 border-b border-border/50">
                                        <TableRow className="hover:bg-transparent border-none">
                                          <TableHead className="w-[150px] pl-6 font-medium text-muted-foreground">App ID</TableHead>
                                          <TableHead className="font-medium text-muted-foreground">Applicant Name</TableHead>
                                          <TableHead className="font-medium text-muted-foreground">Date Submitted</TableHead>
                                          <TableHead className="font-medium text-muted-foreground">Status</TableHead>
                                          <TableHead className="text-right pr-6 font-medium text-muted-foreground w-[100px]">Action</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {course.applicants.map((app) => (
                                          <TableRow key={app.id} className="group border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
                                            <TableCell className="font-mono text-xs pl-6 text-muted-foreground group-hover:text-foreground transition-colors">{app.id}</TableCell>
                                            <TableCell className="font-medium">{app.name}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{app.date}</TableCell>
                                            <TableCell>{getStatusBadge(app.status)}</TableCell>
                                            <TableCell className="text-right pr-6">
                                              <Link 
                                                to={`${returnPath}/applications/${app.id}?hideBack=true`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary bg-muted/50 px-3 py-1.5 text-muted-foreground"
                                              >
                                                <FileText className="w-3.5 h-3.5" />
                                                <span>Review</span>
                                              </Link>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </TabsContent>
                  )
                })}
              </div>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}
