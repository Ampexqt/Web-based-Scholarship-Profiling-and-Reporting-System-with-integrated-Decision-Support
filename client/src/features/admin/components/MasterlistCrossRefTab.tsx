import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, CheckCircle, AlertTriangle } from "lucide-react"
import { apiClient as api } from "@/lib/axios"
import type {
  FlaggedApplicationRecord,
  OfficialUploadRecord,
} from "../types/decisionSupport"

interface MasterlistCrossRefTabProps {
  uploads: OfficialUploadRecord[]
  flags: FlaggedApplicationRecord[]
  onRefresh: () => void
}

export default function MasterlistCrossRefTab({
  uploads,
  flags,
  onRefresh,
}: MasterlistCrossRefTabProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [programName, setProgramName] = useState("TES / CHED Official List")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    formData.append("scholarshipProgram", programName.trim() || "Official List")

    setIsUploading(true)
    try {
      await api.post("/decision-support/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      toast.success("Official masterlist processed and cross-referenced.")
      onRefresh()
    } catch (error) {
      console.error("Upload failed", error)
      toast.error("Failed to process uploaded file. Please verify the CSV, Excel, or PDF format.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Left: Upload & Recent Uploads */}
      <div className="xl:col-span-1 flex flex-col gap-6">
        <Card className="border-border shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              <h2>Upload Official Records</h2>
            </CardTitle>
            <CardDescription className="text-xs">
              Upload official grantee lists (TES, CHED, UniFAST) to automatically flag duplicate or existing beneficiaries.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="program-source" className="text-xs font-medium text-muted-foreground">
                Scholarship Program Source
              </Label>
              <Input
                id="program-source"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                placeholder="e.g., TES 2026-2027, CHED TDP"
                className="h-9 text-sm"
              />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv, .pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/pdf"
              onChange={handleFileChange}
            />

            <div
              onClick={handleUploadClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleUploadClick()
              }}
              className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
            >
              <Upload className="size-7 text-muted-foreground mb-2.5" />
              <p className="text-sm font-medium text-foreground">Click to select masterlist file</p>
              <p className="text-xs text-muted-foreground mt-1">CSV, Excel (.xlsx), or PDF (max 5MB)</p>
            </div>

            <Button
              className="w-full"
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              {isUploading ? "Processing..." : "Select File"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {uploads.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">No recent uploads</div>
            ) : (
              uploads.map((upload) => (
                <div
                  key={upload.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-background gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-md bg-muted shrink-0">
                      <FileText className="size-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" title={upload.fileName}>
                        {upload.fileName}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {new Date(upload.uploadDate).toLocaleDateString()} • {upload.recordCount} records
                      </p>
                    </div>
                  </div>
                  <CheckCircle className="size-4 text-primary shrink-0" />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right: Flagged Matches Table */}
      <Card className="xl:col-span-2 border-border shadow-none flex flex-col overflow-hidden">
        <CardHeader className="border-b border-border/60 bg-background/50">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" />
            Flagged Applications
          </CardTitle>
          <CardDescription className="text-xs">
            Applicants matching uploaded official masterlists. Flagged entries are held out of automated MCDA award quotas pending manual review.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 flex-1 flex flex-col">
          <div className="relative w-full overflow-auto flex-1 max-h-[580px]">
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
                    <TableRow key={flag.id} className="hover:bg-muted/20 transition-colors border-b border-border">
                      <TableCell className="pl-6">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {flag.application.givenName} {flag.application.lastName}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground">
                            {flag.application.referenceNumber}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="destructive"
                          className="bg-destructive/10 text-destructive border-destructive/20 font-normal"
                        >
                          {flag.matchReason}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {flag.officialRecord.listReference || flag.officialRecord.scholarshipProgram}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm font-mono">
                        {new Date(flag.dateFlagged).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Link
                          to={`/admin/applications/${flag.application.referenceNumber || flag.application.id}`}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted size-8 text-muted-foreground hover:text-foreground"
                        >
                          <FileText className="size-4" />
                          <span className="sr-only">Review Application</span>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="p-4 border-t border-border bg-muted/10 text-xs text-muted-foreground font-mono">
            Showing {flags.length} flagged applications
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
