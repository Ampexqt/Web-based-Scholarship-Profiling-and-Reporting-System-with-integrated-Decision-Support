import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

// Mock Data
const MOCK_APPLICATIONS = [
  { id: "APP-2026-0842", name: "Dela Cruz, Juan M.", college: "College of Information and Computing Sciences", course: "BS Information Technology", date: "Jul 28, 2026, 10:30 AM", status: "Pending Review" },
  { id: "APP-2026-0843", name: "Reyes, Maria C.", college: "College of Engineering and Technology", course: "BS Civil Engineering", date: "Jul 28, 2026, 09:15 AM", status: "Flagged" },
  { id: "APP-2026-0840", name: "Santos, Mark J.", college: "School of Business Administration", course: "BS Business Administration", date: "Jul 27, 2026, 02:45 PM", status: "Pending Review" },
  { id: "APP-2026-0839", name: "Garcia, Ana L.", college: "School of Business Administration", course: "BS Accountancy", date: "Jul 27, 2026, 11:20 AM", status: "Flagged" },
  { id: "APP-2026-0835", name: "Mendoza, Paul R.", college: "College of Information and Computing Sciences", course: "BS Information Technology", date: "Jul 25, 2026, 08:50 AM", status: "Pending Review" },
  { id: "APP-2026-0831", name: "Bautista, Luis T.", college: "College of Engineering and Technology", course: "BS Mechanical Engineering", date: "Jul 24, 2026, 04:15 PM", status: "Pending Review" },
  { id: "APP-2026-0829", name: "Flores, Angela D.", college: "School of Business Administration", course: "BS Accountancy", date: "Jul 24, 2026, 01:05 PM", status: "Pending Review" },
  { id: "APP-2026-0822", name: "Villanueva, Jose S.", college: "College of Engineering and Technology", course: "BS Civil Engineering", date: "Jul 23, 2026, 09:30 AM", status: "Flagged" },
];

export default function ApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filterCollege, setFilterCollege] = useState("All");

  const filteredApplications = MOCK_APPLICATIONS.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCollege = filterCollege === "All" || app.college === filterCollege;

    if (activeTab === "all") return matchesSearch && matchesCollege;
    return matchesSearch && matchesCollege && app.status.toLowerCase() === activeTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending Review':
        return <Badge variant="secondary" className="bg-secondary hover:bg-secondary/80 text-secondary-foreground border-transparent">Pending Review</Badge>;
      case 'Flagged':
        return <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 border">Flagged</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">Applications Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Review, verify, and process student scholarship applications.</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-background/50">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-3 sm:flex bg-muted/50 p-1 rounded-lg">
              <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">All</TabsTrigger>
              <TabsTrigger value="pending review" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Pending Review</TabsTrigger>
              <TabsTrigger value="flagged" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Flagged</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ID or Name..."
                className="pl-9 bg-background border-border focus-visible:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="outline" size="icon" className="shrink-0 border-border hover:bg-muted text-foreground" />
              }>
                <Filter className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Filter by College</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filterCollege === "All"}
                    onCheckedChange={() => setFilterCollege("All")}
                  >
                    All Colleges
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filterCollege === "College of Information and Computing Sciences"}
                    onCheckedChange={() => setFilterCollege("College of Information and Computing Sciences")}
                  >
                    College of Information and Computing Sciences
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filterCollege === "College of Engineering and Technology"}
                    onCheckedChange={() => setFilterCollege("College of Engineering and Technology")}
                  >
                    College of Engineering and Technology
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filterCollege === "School of Business Administration"}
                    onCheckedChange={() => setFilterCollege("School of Business Administration")}
                  >
                    School of Business Administration
                  </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table Area */}
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="font-semibold text-muted-foreground w-[130px]">App ID</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Applicant Name</TableHead>
                <TableHead className="font-semibold text-muted-foreground">College</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Course</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Date Submitted</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
                <TableHead className="text-right font-semibold text-muted-foreground w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No applications found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map((app) => (
                  <TableRow key={app.id} className="group hover:bg-muted/20 transition-colors border-b border-border">
                    <TableCell className="font-mono text-sm font-medium text-foreground">{app.id}</TableCell>
                    <TableCell className="font-medium text-foreground">{app.name}</TableCell>
                    <TableCell className="text-muted-foreground">{app.college}</TableCell>
                    <TableCell className="text-muted-foreground">{app.course}</TableCell>
                    <TableCell className="text-muted-foreground">{app.date}</TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell className="text-right pr-6">
                      <Link 
                        to={app.id} 
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="sr-only">Review</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination/Footer (Mock) */}
        <div className="p-4 border-t border-border bg-muted/10 text-xs text-muted-foreground flex justify-between items-center">
          <div>Showing {filteredApplications.length} of {MOCK_APPLICATIONS.length} applications</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="h-8 text-xs border-border">Previous</Button>
            <Button variant="outline" size="sm" className="h-8 text-xs border-border">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
