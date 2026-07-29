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
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Filter, ChevronLeft, ChevronRight, Download } from "lucide-react";

// Mock Audit Logs Data
const MOCK_AUDIT_LOGS = [
  { id: "LOG-104", timestamp: "Jul 28, 2026, 14:30", user: "Admin", role: "Administrator", action: "Exported Reports", details: "Exported Applicant Statistics PDF" },
  { id: "LOG-103", timestamp: "Jul 28, 2026, 11:15", user: "Staff 01", role: "Staff", action: "Status Change", details: "Accepted Application APP-2026-0842" },
  { id: "LOG-102", timestamp: "Jul 28, 2026, 09:45", user: "Staff 02", role: "Staff", action: "Review Comment", details: "Added note to APP-2026-0843 (Missing valid ID)" },
  { id: "LOG-101", timestamp: "Jul 27, 2026, 16:20", user: "Admin", role: "Administrator", action: "Uploaded Document", details: "Uploaded TES_Beneficiaries_2026.csv" },
  { id: "LOG-100", timestamp: "Jul 27, 2026, 10:05", user: "Staff 01", role: "Staff", action: "Status Change", details: "Rejected Application APP-2026-0839" },
  { id: "LOG-099", timestamp: "Jul 26, 2026, 08:30", user: "Staff 01", role: "Staff", action: "Logged In", details: "System Login (IP: 192.168.1.4)" },
  { id: "LOG-098", timestamp: "Jul 25, 2026, 17:00", user: "Admin", role: "Administrator", action: "Logged Out", details: "System Logout" },
];

export default function AuditLogsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(MOCK_AUDIT_LOGS.length / itemsPerPage);
  
  const currentLogs = MOCK_AUDIT_LOGS.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">Audit Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor system activities, staff actions, and security events.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Download className="w-4 h-4" />
          Export Logs
        </Button>
      </div>

      {/* Filters Section */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Log Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label>User Role</Label>
            <Select defaultValue="all">
              <SelectTrigger className="w-full bg-background border-border">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Action Type</Label>
            <Select defaultValue="all">
              <SelectTrigger className="w-full bg-background border-border">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="status">Status Changes</SelectItem>
                <SelectItem value="auth">Authentications</SelectItem>
                <SelectItem value="docs">Document Uploads</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date From</Label>
            <Input type="date" className="bg-background border-border" />
          </div>
          <div className="space-y-2">
            <Label>Date To</Label>
            <Input type="date" className="bg-background border-border" />
          </div>
        </div>
      </div>

      {/* Audit Trails Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="font-semibold text-muted-foreground pl-6 w-[200px]">Timestamp</TableHead>
                <TableHead className="font-semibold text-muted-foreground">User</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Action</TableHead>
                <TableHead className="font-semibold text-muted-foreground pr-6">Target / Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentLogs.map((log) => (
                <TableRow key={log.id} className="group hover:bg-muted/20 transition-colors border-b border-border">
                  <TableCell className="pl-6 text-muted-foreground font-mono text-xs">
                    {log.timestamp}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{log.user}</p>
                      <p className="text-xs text-muted-foreground">{log.role}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal bg-background">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm pr-6">
                    {log.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border bg-muted/10 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, MOCK_AUDIT_LOGS.length)} of {MOCK_AUDIT_LOGS.length} entries
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 border-border"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </Button>
            <div className="text-sm font-medium px-2">{currentPage} / {totalPages}</div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 border-border"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}
