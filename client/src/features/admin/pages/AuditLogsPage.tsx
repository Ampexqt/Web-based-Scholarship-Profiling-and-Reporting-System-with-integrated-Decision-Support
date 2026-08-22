import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/axios';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Monitor, Smartphone, Tablet, Activity, Filter, FileText, Download, CalendarDays, Users, MousePointer2, LogIn, LogOut, Eye, EyeOff, CheckCircle, XCircle, CheckCircle2, Flag, X, FileSpreadsheet, ChevronDown, CheckIcon, UserPlus, Ban, KeyRound } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportDateFilter, setExportDateFilter] = useState('All Dates');
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  const [exportActionFilters, setExportActionFilters] = useState<string[]>([]);
  const [exportUserFilters, setExportUserFilters] = useState<string[]>([]);
  
  // Search terms for the custom dropdowns
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [actionSearchTerm, setActionSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  // Reset pagination on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res: any = await apiClient.get('/audit');
        if (res.success) {
          setLogs(res.logs);
        }
      } catch (error) {
        console.error("Failed to fetch audit logs", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'USER_LOGIN': return <Badge variant="outline" className="gap-1.5"><LogIn className="w-3 h-3" />Login</Badge>;
      case 'USER_LOGOUT': return <Badge variant="outline" className="gap-1.5 text-muted-foreground"><LogOut className="w-3 h-3" />Logout</Badge>;
      case 'APP_VIEW_START': return <Badge variant="secondary" className="gap-1.5"><Eye className="w-3 h-3" />View App</Badge>;
      case 'APP_VIEW_END': return <Badge variant="secondary" className="gap-1.5"><EyeOff className="w-3 h-3" />End Review</Badge>;
      case 'DOC_VIEW': return <Badge variant="secondary" className="gap-1.5"><FileText className="w-3 h-3" />View Doc</Badge>;
      case 'DOC_VERIFY': return <Badge variant="default" className="gap-1.5"><CheckCircle className="w-3 h-3" />Verify Doc</Badge>;
      case 'DOC_UNVERIFY': return <Badge variant="destructive" className="gap-1.5"><XCircle className="w-3 h-3" />Unverify Doc</Badge>;
      case 'APP_APPROVE': return <Badge variant="default" className="gap-1.5"><CheckCircle2 className="w-3 h-3" />Approve App</Badge>;
      case 'APP_REJECT': return <Badge variant="destructive" className="gap-1.5"><XCircle className="w-3 h-3" />Reject App</Badge>;
      case 'APP_FLAG': return <Badge variant="destructive" className="gap-1.5"><Flag className="w-3 h-3" />Flag App</Badge>;
      case 'CREATE_STAFF_ACCOUNT': return <Badge variant="default" className="gap-1.5"><UserPlus className="w-3 h-3" />Create Staff</Badge>;
      case 'SUSPEND_STAFF_ACCOUNT': return <Badge variant="destructive" className="gap-1.5"><Ban className="w-3 h-3" />Suspend Staff</Badge>;
      case 'ACTIVATE_STAFF_ACCOUNT': return <Badge variant="default" className="gap-1.5"><CheckCircle2 className="w-3 h-3" />Activate Staff</Badge>;
      case 'RESET_STAFF_PASSWORD': return <Badge variant="secondary" className="gap-1.5 text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900/50"><KeyRound className="w-3 h-3" />Reset Password</Badge>;
      case 'DOWNLOAD_REPORT': return <Badge variant="secondary" className="gap-1.5 text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900/50"><Download className="w-3 h-3" />Download Report</Badge>;
      default: return <Badge variant="outline" className="gap-1.5"><Activity className="w-3 h-3" />{action}</Badge>;
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'smartphone': return <Smartphone className="w-4 h-4 text-muted-foreground" />;
      case 'tablet': return <Tablet className="w-4 h-4 text-muted-foreground" />;
      default: return <Monitor className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-';
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDocumentName = (doc: string, appId?: string) => {
    let name = doc.split('/').pop() || doc;

    // Remove the App ID prefix (e.g., "APP-2026-2759_")
    if (appId && name.startsWith(`${appId}_`)) {
      name = name.replace(`${appId}_`, '');
    }

    // Remove file extensions (e.g., ".jpg", ".pdf")
    name = name.replace(/\.[^/.]+$/, "");

    // Convert camelCase to Title Case (e.g. "uploadRecommendation" -> "Upload Recommendation")
    name = name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

    return name.trim();
  };

  const filteredLogs = logs.filter(log => {
    // Search Term Filter
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      log.user?.name?.toLowerCase().includes(search) ||
      log.action.toLowerCase().includes(search) ||
      log.targetAppId?.toLowerCase().includes(search);

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Extract unique users and actions for filter dropdowns
  const uniqueUsers = Array.from(new Map(logs.filter(l => l.user).map(l => [l.userId, l.user.name || `User ID: ${l.userId}`])).entries());
  const uniqueActions = Array.from(new Set(logs.map(l => l.action)));

  const exportToCSV = () => {
    const exportLogs = logs.filter(log => {
      const matchesAction = exportActionFilters.length === 0 || exportActionFilters.includes(log.action);
      const matchesUser = exportUserFilters.length === 0 || exportUserFilters.includes(log.userId?.toString() as string);

      let matchesDate = true;
      const logDate = new Date(log.createdAt);
      const now = new Date();
      if (exportDateFilter === 'today') {
        matchesDate = logDate.toDateString() === now.toDateString();
      } else if (exportDateFilter === '7 days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        matchesDate = logDate >= sevenDaysAgo;
      } else if (exportDateFilter === '30 days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        matchesDate = logDate >= thirtyDaysAgo;
      } else if (exportDateFilter === 'custom') {
        const start = exportStartDate ? new Date(exportStartDate) : new Date(0);
        const end = exportEndDate ? new Date(exportEndDate) : new Date();
        end.setHours(23, 59, 59, 999);
        matchesDate = logDate >= start && logDate <= end;
      }

      return matchesAction && matchesUser && matchesDate;
    });

    if (exportLogs.length === 0) {
      alert("No logs match the selected export criteria.");
      return;
    }

    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Context', 'OS', 'Device', 'IP Address', 'Duration/Notes'];
    const csvContent = [
      headers.join(','),
      ...exportLogs.map(log => {
        const timestamp = new Date(log.createdAt).toLocaleString('en-US').replace(/,/g, '');
        const user = log.user?.name || 'Unknown User';
        const role = log.userRole || 'System';
        const action = log.action;
        const context = log.targetAppId ? `${log.targetAppId} ${log.targetDoc ? '(' + formatDocumentName(log.targetDoc, log.targetAppId) + ')' : ''}` : '';
        const os = log.os || 'Unknown OS';
        const device = log.deviceType || 'Desktop';
        const ip = log.ipAddress || '';
        const durationNotes = log.duration ? formatDuration(log.duration) : log.notes ? `"${log.notes.replace(/"/g, '""')}"` : '';

        return [timestamp, user, role, action, context, os, device, ip, durationNotes].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Audit_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in-up print:space-y-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
            Audit & System Trails
          </h1>
          <p className="text-muted-foreground mt-1">Comprehensive log of all user activities, decisions, and system access.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsExportModalOpen(true)} 
          className="gap-2 shadow-sm border-border hover:bg-primary/5 hover:text-primary transition-all duration-300 group" 
        >
          <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="font-medium">Export to CSV</span>
        </Button>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/20 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by user, action, or App ID..."
                className="pl-9 bg-background w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            Showing {filteredLogs.length} events
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Context</TableHead>
                <TableHead>Footprint</TableHead>
                <TableHead className="text-right">Duration / Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    Loading audit trails...
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No logs found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLogs.map((log) => (
                  <TableRow key={log.id} className="group hover:bg-muted/20">
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                        hour: 'numeric', minute: '2-digit', second: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{log.user?.name || 'Unknown User'}</span>
                        <span className="text-xs text-muted-foreground capitalize">{log.userRole || 'System'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getActionBadge(log.action)}
                    </TableCell>
                    <TableCell>
                      {log.targetAppId ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-mono font-medium text-primary bg-primary/5 px-2 py-0.5 rounded w-fit border border-primary/10">
                            {log.targetAppId}
                          </span>
                          {log.targetDoc && (
                            <span className="text-[10px] text-muted-foreground truncate max-w-[200px] flex items-center gap-1 mt-1" title={log.targetDoc}>
                              <FileText className="w-3 h-3" />
                              {formatDocumentName(log.targetDoc, log.targetAppId)}
                            </span>
                          )}
                        </div>
                      ) : <span className="text-xs text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          {log.deviceType && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground" title="Device">
                              {log.deviceType === 'smartphone' ? <Smartphone className="w-3.5 h-3.5" /> :
                                log.deviceType === 'tablet' ? <Tablet className="w-3.5 h-3.5" /> :
                                  <Monitor className="w-3.5 h-3.5" />}
                              <span>{log.os || 'Unknown OS'}</span>
                            </div>
                          )}
                          {log.ipAddress && (
                            <span className="text-xs font-mono text-muted-foreground/80 bg-muted px-1.5 py-0.5 rounded" title="IP Address">
                              {log.ipAddress}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right flex flex-col items-end gap-1">
                      {log.duration && (
                        <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border/50 w-fit">
                          {formatDuration(log.duration)}
                        </span>
                      )}
                      {log.notes && (
                        <span className="text-[10px] text-muted-foreground max-w-[200px] inline-block truncate" title={log.notes}>
                          {log.notes}
                        </span>
                      )}
                      {!log.duration && !log.notes && (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination/Footer */}
        <div className="p-4 border-t border-border bg-muted/10 text-xs text-muted-foreground flex justify-between items-center">
          <div>
            Showing {paginatedLogs.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)} of {filteredLogs.length} events {isLoading && "(Loading...)"}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs border-border" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs border-border" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-md rounded-[20px] shadow-2xl border border-border/40 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 pb-4">
              <h3 className="font-serif font-semibold text-xl flex items-center gap-3 text-foreground tracking-tight">
                <FileSpreadsheet className="w-5 h-5 text-primary" strokeWidth={1.5} /> Export Audit Logs
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsExportModalOpen(false)} className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted/60 transition-colors">
                <X className="w-4 h-4" strokeWidth={1.5} />
              </Button>
            </div>
            
            <div className="p-6 pt-2 space-y-6">
              <div className="space-y-5">
                
                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-foreground/80">Date Range</Label>
                  <Select value={exportDateFilter} onValueChange={setExportDateFilter}>
                    <SelectTrigger className="w-full bg-background border-border/60 hover:border-border transition-all h-11 rounded-xl shadow-sm hover:shadow">
                      <SelectValue placeholder="Select Date Range" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/60 shadow-lg">
                      <SelectItem value="All Dates">All Dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="7 days">Last 7 Days</SelectItem>
                      <SelectItem value="30 days">Last 30 Days</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {exportDateFilter === 'custom' && (
                  <div className="flex gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="space-y-2 w-full">
                      <Label className="text-[13px] font-medium text-foreground/80">Start Date</Label>
                      <Input 
                        type="date" 
                        value={exportStartDate} 
                        onChange={(e) => setExportStartDate(e.target.value)} 
                        className="bg-background border-border/60 hover:border-border transition-colors h-11 rounded-xl shadow-sm"
                      />
                    </div>
                    <div className="space-y-2 w-full">
                      <Label className="text-[13px] font-medium text-foreground/80">End Date</Label>
                      <Input 
                        type="date" 
                        value={exportEndDate} 
                        onChange={(e) => setExportEndDate(e.target.value)} 
                        className="bg-background border-border/60 hover:border-border transition-colors h-11 rounded-xl shadow-sm"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-foreground/80">User</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex w-full items-center justify-between bg-background border border-border/60 hover:border-border transition-all h-11 rounded-xl shadow-sm hover:shadow px-3 text-sm font-normal text-left outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <span className="truncate">
                        {exportUserFilters.length === 0 
                          ? "All Users" 
                          : `${exportUserFilters.length} user${exportUserFilters.length > 1 ? 's' : ''} selected`}
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px] rounded-xl border-border/60 shadow-xl p-1">
                      <div className="px-2 py-2 pb-1 border-b border-border/40 mb-1">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search users..."
                            className="h-8 pl-8 text-sm bg-muted/40 border-transparent hover:border-border/50 focus-visible:ring-1 rounded-lg"
                            value={userSearchTerm}
                            onChange={(e) => setUserSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      <ScrollArea className="h-48">
                        <DropdownMenuItem
                          closeOnClick={false}
                          onClick={() => setExportUserFilters([])}
                          className="font-medium cursor-pointer flex items-center gap-3 py-2 px-2 hover:bg-muted/40 focus:bg-muted/40 focus:text-foreground"
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${exportUserFilters.length === 0 ? 'bg-primary border-primary text-primary-foreground' : 'border-primary/40 bg-transparent'}`}>
                            {exportUserFilters.length === 0 && <CheckIcon className="w-3 h-3 stroke-[3]" />}
                          </div>
                          All Users
                        </DropdownMenuItem>
                        {uniqueUsers
                          .filter(([, name]) => (name as string).toLowerCase().includes(userSearchTerm.toLowerCase()))
                          .map(([id, name]) => {
                            const isChecked = exportUserFilters.includes(id.toString());
                            return (
                              <DropdownMenuItem
                                key={id.toString()}
                                closeOnClick={false}
                                onClick={() => {
                                  setExportUserFilters(prev => {
                                    if (!isChecked) return [...prev, id.toString()];
                                    return prev.filter(v => v !== id.toString());
                                  });
                                }}
                                className="cursor-pointer flex items-center gap-3 py-2 px-2 hover:bg-muted/40 focus:bg-muted/40 focus:text-foreground"
                              >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-primary border-primary text-primary-foreground' : 'border-primary/40 bg-transparent'}`}>
                                  {isChecked && <CheckIcon className="w-3 h-3 stroke-[3]" />}
                                </div>
                                {name as string}
                              </DropdownMenuItem>
                            );
                          })}
                      </ScrollArea>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <Label className="text-[13px] font-medium text-foreground/80">Action</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex w-full items-center justify-between bg-background border border-border/60 hover:border-border transition-all h-11 rounded-xl shadow-sm hover:shadow px-3 text-sm font-normal text-left outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <span className="truncate">
                        {exportActionFilters.length === 0 
                          ? "All Actions" 
                          : `${exportActionFilters.length} action${exportActionFilters.length > 1 ? 's' : ''} selected`}
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px] rounded-xl border-border/60 shadow-xl p-1">
                      <ScrollArea className="h-48">
                        <DropdownMenuItem
                          closeOnClick={false}
                          onClick={() => setExportActionFilters([])}
                          className="font-medium cursor-pointer flex items-center gap-3 py-2 px-2 hover:bg-muted/40 focus:bg-muted/40 focus:text-foreground"
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${exportActionFilters.length === 0 ? 'bg-primary border-primary text-primary-foreground' : 'border-primary/40 bg-transparent'}`}>
                            {exportActionFilters.length === 0 && <CheckIcon className="w-3 h-3 stroke-[3]" />}
                          </div>
                          All Actions
                        </DropdownMenuItem>
                        {uniqueActions.map(action => {
                          const isChecked = exportActionFilters.includes(action as string);
                          return (
                            <DropdownMenuItem
                              key={action as string}
                              closeOnClick={false}
                              onClick={() => {
                                setExportActionFilters(prev => {
                                  if (!isChecked) return [...prev, action as string];
                                  return prev.filter(v => v !== action);
                                });
                              }}
                              className="cursor-pointer flex items-center gap-3 py-2 px-2 hover:bg-muted/40 focus:bg-muted/40 focus:text-foreground"
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-primary border-primary text-primary-foreground' : 'border-primary/40 bg-transparent'}`}>
                                {isChecked && <CheckIcon className="w-3 h-3 stroke-[3]" />}
                              </div>
                              {action as string}
                            </DropdownMenuItem>
                          );
                        })}
                      </ScrollArea>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

              </div>

              <div className="pt-6 mt-4 border-t border-border/30 flex justify-between sm:justify-end gap-3">
                <Button variant="ghost" onClick={() => setIsExportModalOpen(false)} className="rounded-xl hover:bg-muted/60 font-medium text-muted-foreground hover:text-foreground">
                  Cancel
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-xl font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all px-6 border border-primary/20" onClick={exportToCSV}>
                  <Download className="w-4 h-4" strokeWidth={2} />
                  Generate CSV
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
