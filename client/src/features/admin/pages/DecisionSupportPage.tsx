import { useState, useRef, useEffect } from "react";
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
import { Upload, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { apiClient as api } from "@/lib/axios";

export default function DecisionSupportPage() {
  const [uploads, setUploads] = useState<any[]>([]);
  const [flags, setFlags] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [uploadsRes, flagsRes] = await Promise.all([
        api.get("/decision-support/history"),
        api.get("/decision-support/flags")
      ]);
      setUploads(uploadsRes as any);
      setFlags(flagsRes as any);
    } catch (error) {
      console.error("Failed to fetch decision support data", error);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    // You can also add a way to specify the scholarship program from UI, using a prompt or input.
    // For now, default to "Official List"
    formData.append("scholarshipProgram", "Official List");

    setIsUploading(true);
    try {
      await api.post("/decision-support/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("File uploaded and processed successfully!");
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload file. Please check the format and try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset input
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">Decision Support</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload official records and review automated cross-referencing flags.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Upload & Manage Records */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-6">
            <h2 className="text-xl font-semibold mb-2">Upload Official Records</h2>
            <p className="text-sm text-muted-foreground mb-6">Upload official lists (TES, CHED, etc.) to automatically check against pending applicants.</p>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv, .pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/pdf" 
              onChange={handleFileChange} 
            />
            
            <div 
              onClick={handleUploadClick}
              className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer mb-6"
            >
              <Upload className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">CSV, Excel, or PDF files only (max 5MB)</p>
            </div>
            
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              {isUploading ? "Processing..." : "Select File"}
            </Button>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Uploads</h2>
            <div className="space-y-4">
              {uploads.length === 0 ? (
                 <div className="text-sm text-muted-foreground text-center py-4">No recent uploads</div>
              ) : uploads.map(upload => (
                <div key={upload.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-muted">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate max-w-[150px]" title={upload.fileName}>{upload.fileName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(upload.uploadDate).toLocaleDateString()} • {upload.recordCount} records
                      </p>
                    </div>
                  </div>
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Flagged Matches Review */}
        <div className="xl:col-span-2">
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-border bg-background/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Flagged Applications
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Applicants matching uploaded official records or duplicates.</p>
              </div>
            </div>

            <div className="relative w-full overflow-auto flex-1 max-h-[600px]">
              <Table>
                <TableHeader className="bg-muted/30 sticky top-0">
                  <TableRow className="hover:bg-transparent border-b border-border">
                    <TableHead className="font-semibold text-muted-foreground pl-6">App ID & Name</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Match Reason</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">List Reference</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Date Flagged</TableHead>
                    <TableHead className="text-right font-semibold text-muted-foreground pr-6">Review</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flags.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No flagged applications found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    flags.map((flag) => (
                      <TableRow key={flag.id} className="group hover:bg-muted/20 transition-colors border-b border-border">
                        <TableCell className="pl-6">
                          <div>
                            <p className="font-medium text-foreground">
                              {flag.application.givenName} {flag.application.lastName}
                            </p>
                            <p className="text-xs font-mono text-muted-foreground">{flag.application.referenceNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 font-normal">
                            {flag.matchReason}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {flag.officialRecord.listReference || flag.officialRecord.scholarshipProgram}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(flag.dateFlagged).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Link 
                            to={`/admin/applications/${flag.application.id}`} 
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <FileText className="w-4 h-4" />
                            <span className="sr-only">Review Application</span>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="p-4 border-t border-border bg-muted/10 text-xs text-muted-foreground flex justify-between items-center">
              <div>Showing {flags.length} flagged applications</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
