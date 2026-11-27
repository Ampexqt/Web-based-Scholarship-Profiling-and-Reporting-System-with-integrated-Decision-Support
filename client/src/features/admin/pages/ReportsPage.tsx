import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { apiClient } from "@/lib/axios"
import {
  FileSpreadsheet,
  CalendarRange,
  Clock,
  CheckCircle2,
  ChevronRight,
  FileDown,
} from "lucide-react"
import CollegeMultiSelect, { ALL_COLLEGE_ABBRS } from "../components/CollegeMultiSelect"
import { cn } from "@/lib/utils"

interface AnnexSummary {
  eligibleCount: number
  totalApproved: number
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("30days")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [selectedColleges, setSelectedColleges] = useState<string[]>([...ALL_COLLEGE_ABBRS])
  const [isExporting, setIsExporting] = useState(false)
  const [summary, setSummary] = useState<AnnexSummary | null>(null)

  const isAllCollegesSelected = selectedColleges.length === ALL_COLLEGE_ABBRS.length

  const buildQueryParams = () => {
    const params = new URLSearchParams()
    if (dateRange) params.append("dateRange", dateRange)
    if (dateRange === "custom") {
      if (fromDate) params.append("fromDate", fromDate)
      if (toDate) params.append("toDate", toDate)
    }
    if (!isAllCollegesSelected && selectedColleges.length > 0) {
      params.append("colleges", selectedColleges.join(","))
    }
    return params
  }

  useEffect(() => {
    if (selectedColleges.length === 0) {
      setSummary({ eligibleCount: 0, totalApproved: summary?.totalApproved ?? 0 })
      return
    }
    if (dateRange === "custom" && (!fromDate || !toDate)) {
      return
    }

    let cancelled = false
    const fetchSummary = async () => {
      try {
        const params = buildQueryParams()
        const res = (await apiClient.get(`/reports/tes-annex1/summary?${params.toString()}`)) as {
          success?: boolean
          eligibleCount?: number
          totalApproved?: number
        }
        if (!cancelled && res?.success) {
          setSummary({
            eligibleCount: res.eligibleCount ?? 0,
            totalApproved: res.totalApproved ?? 0,
          })
        }
      } catch {
        // Optional preview endpoint; keep silent if unavailable
      }
    }

    fetchSummary()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, fromDate, toDate, selectedColleges])

  const handleExport = async () => {
    if (selectedColleges.length === 0) {
      toast.error("Select at least one college before generating Annex 1.")
      return
    }

    if (dateRange === "custom" && (!fromDate || !toDate)) {
      toast.error("Specify both From Date and To Date for a custom range.")
      return
    }

    setIsExporting(true)
    try {
      const params = buildQueryParams()
      const data = (await apiClient.get(`/reports/tes-annex1?${params.toString()}`, {
        responseType: "blob",
      })) as BlobPart

      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement("a")
      const collegeTag = isAllCollegesSelected ? "ALL" : selectedColleges.join("_")
      link.href = url
      link.setAttribute("download", `TES_Annex_1_${collegeTag}_${Date.now()}.xlsm`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success("CHED/UniFAST Annex 1 report exported and logged.")
    } catch (error) {
      console.error("Failed to download report", error)
      toast.error("Failed to generate Annex 1 report. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Generate the official CHED/UniFAST Annex 1 formatted template (.xlsm) filtered by college and submission period.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Annex 1 Specification Context */}
        <Card className="lg:col-span-4 border-border shadow-none flex flex-col">
          <CardHeader className="pb-4 border-b border-border/60">
            <div className="size-12 rounded-lg bg-muted flex items-center justify-center mb-3 border border-border">
              <FileSpreadsheet className="size-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-serif font-bold">ANNEX 1</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Exports eligible Approved and Accepted scholarship recipients mapped strictly from Row 9 onward inside the macro-enabled UniFAST workbook.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-5 flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-sm">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <span>Preserves native .xlsm macros & headers</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <span>Upper-cased names & normalized courses</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <span>Multi-college filtering with audit logging</span>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                Output Format
              </span>
              <Badge variant="outline" className="font-mono">
                .xlsm (Macro-Enabled)
              </Badge>
            </div>

            {summary !== null && (
              <div className="rounded-lg border border-border bg-muted/30 p-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Matching Approved Scholars</span>
                <span className="text-lg font-bold font-mono text-primary">
                  {summary.eligibleCount}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Panel: Filter & Export Configuration */}
        <Card className="lg:col-span-8 border-border shadow-none">
          <CardHeader className="pb-4 border-b border-border/60">
            <CardTitle className="text-lg font-semibold">Export Configuration</CardTitle>
            <CardDescription className="text-xs">
              Choose target university colleges and date window before generating the workbook.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 flex flex-col gap-6">
            {/* Multi-College Filter */}
            <CollegeMultiSelect
              selectedColleges={selectedColleges}
              onChange={setSelectedColleges}
            />

            <Separator />

            {/* Date Range Selector */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground font-sans">
                  Select Application Range
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-muted/40 p-1 rounded-lg border border-border/60">
                {(
                  [
                    { key: "today", label: "Today" },
                    { key: "7days", label: "7 Days" },
                    { key: "30days", label: "30 Days" },
                    { key: "custom", label: "Custom" },
                  ] as const
                ).map((range) => (
                  <Button
                    key={range.key}
                    type="button"
                    variant={dateRange === range.key ? "default" : "ghost"}
                    onClick={() => setDateRange(range.key)}
                    className={cn(
                      "w-full h-9 text-xs",
                      dateRange === range.key
                        ? "bg-background text-primary border border-border font-semibold hover:bg-background"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Date Inputs */}
            {dateRange === "custom" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="report-from-date" className="text-xs font-medium text-muted-foreground">
                    From Date
                  </Label>
                  <div className="relative">
                    <CalendarRange className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      id="report-from-date"
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="report-to-date" className="text-xs font-medium text-muted-foreground">
                    To Date
                  </Label>
                  <div className="relative">
                    <CalendarRange className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      id="report-to-date"
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {/* Export Trigger */}
            <div className="flex flex-col gap-2">
              <Button
                size="lg"
                onClick={handleExport}
                disabled={isExporting || selectedColleges.length === 0}
                className="w-full h-12 text-sm font-semibold flex items-center justify-between px-5"
              >
                <span className="flex items-center gap-2.5">
                  <FileDown className="size-4" />
                  {isExporting ? "Generating Annex 1 Workbook..." : "Generate Excel Report"}
                </span>
                <span className="flex items-center gap-1.5 text-xs opacity-80 font-mono">
                  {isAllCollegesSelected ? "ALL" : `${selectedColleges.length} COLLEGES`}
                  <ChevronRight className="size-4" />
                </span>
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Every export generates an audit trail entry recording user ID, role, timestamp, and selected college filters.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
