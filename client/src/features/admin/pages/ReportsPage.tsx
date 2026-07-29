import { useState } from 'react';
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
import { FileText, Filter, X, CheckCircle, FileSpreadsheet } from "lucide-react";

export default function ReportsPage() {
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState("30days");

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">Generate official administrative documents and export applicant data.</p>
      </div>

      {/* Global Filters Section */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Global Date & Term Filters</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="space-y-2 w-full md:w-64">
            <Label>Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full bg-background border-border">
                <SelectValue placeholder="Select Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="7 Days">Last 7 Days</SelectItem>
                <SelectItem value="30 Days">Last 30 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dateRange === 'custom' && (
            <>
              <div className="space-y-2 w-full md:w-48 animate-in fade-in slide-in-from-left-4 duration-300">
                <Label>Date From</Label>
                <Input type="date" className="bg-background border-border" />
              </div>
              <div className="space-y-2 w-full md:w-48 animate-in fade-in slide-in-from-left-4 duration-300">
                <Label>Date To</Label>
                <Input type="date" className="bg-background border-border" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => setIsPdfModalOpen(true)}
          className="bg-card border-2 border-border hover:border-primary/50 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-muted/30 group"
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-semibold text-xl mb-2">Generate PDF Report</h3>
          <p className="text-sm text-muted-foreground max-w-sm">Open the generation modal to create Applicant Statistics or Scholarship Summaries in PDF format.</p>
        </div>

        <div
          onClick={() => setIsCsvModalOpen(true)}
          className="bg-card border-2 border-border hover:border-accent/50 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-muted/30 group"
        >
          <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileSpreadsheet className="w-7 h-7 text-accent-foreground" />
          </div>
          <h3 className="font-semibold text-xl mb-2">Export CSV Data</h3>
          <p className="text-sm text-muted-foreground max-w-sm">Open the export modal to download Raw Application Data in CSV format.</p>
        </div>
      </div>

      {/* MODALS */}

      {/* PDF Modal */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-xl shadow-lg border border-border overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Generate PDF
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsPdfModalOpen(false)} className="h-8 w-8 rounded-full">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 border border-primary bg-primary/5 rounded-lg cursor-pointer">
                  <div className="mt-0.5"><CheckCircle className="w-5 h-5 text-primary" /></div>
                  <div>
                    <p className="font-medium">Applicant Statistics</p>
                    <p className="text-xs text-muted-foreground mt-1">Demographics, gender, and geographical distribution of applicants.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 border border-border hover:border-border/80 bg-background rounded-lg cursor-pointer opacity-70">
                  <div className="mt-0.5"><div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" /></div>
                  <div>
                    <p className="font-medium">Scholarship Summaries</p>
                    <p className="text-xs text-muted-foreground mt-1">Distribution across courses, program types, and year levels.</p>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setIsPdfModalOpen(false)}>
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-xl shadow-lg border border-border overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-accent-foreground" /> Export CSV
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsCsvModalOpen(false)} className="h-8 w-8 rounded-full">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 border border-accent/50 bg-accent/5 rounded-lg cursor-pointer">
                  <div className="mt-0.5"><CheckCircle className="w-5 h-5 text-accent-foreground" /></div>
                  <div>
                    <p className="font-medium">Raw Application Data</p>
                    <p className="text-xs text-muted-foreground mt-1">Complete, unfiltered list of applicant data fields.</p>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => setIsCsvModalOpen(false)}>
                Download CSV
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
