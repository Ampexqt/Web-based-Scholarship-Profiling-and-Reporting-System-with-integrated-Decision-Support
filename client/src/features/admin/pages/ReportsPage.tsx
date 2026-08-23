import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/axios";
import { FileSpreadsheet, CalendarRange, Clock, CheckCircle2, ChevronRight, FileDown } from "lucide-react";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("30days");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (dateRange) params.append('dateRange', dateRange);
      if (dateRange === 'custom') {
        if (fromDate) params.append('fromDate', fromDate);
        if (toDate) params.append('toDate', toDate);
      }

      const data: any = await apiClient.get(`/reports/tes-annex1?${params.toString()}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `TES_Annex_1_${Date.now()}.xlsm`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download report', error);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate the official CHED/UniFast Annex 1 formatted template for Zamboanga Peninsula Polytechnic State University.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Context & Visuals */}
        <div className="lg:col-span-5 bg-card border-2 border-border/80 rounded-2xl shadow-sm overflow-hidden flex flex-col relative h-full group transition-all hover:border-primary/30 hover:shadow-md">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary opacity-90" />
          <div className="p-8 flex-1 flex flex-col justify-center items-start">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 shadow-sm border border-primary/20 group-hover:scale-105 transition-transform duration-300">
              <FileSpreadsheet className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-3">ANNEX 1</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              This tool exports the raw application data precisely mapped into the official UniFast Excel template, ready for immediate submission.
            </p>
            
            <div className="space-y-4 w-full">
              <div className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Pre-formatted headers & styling</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Auto-populates PWD & Address fields</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Outputs native .xlsm with macros</span>
              </div>
            </div>
          </div>
          <div className="bg-muted/40 p-5 border-t border-border flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Format</span>
            <span className="text-sm font-mono font-medium bg-background px-2.5 py-1 rounded border border-border shadow-sm text-foreground">.xlsm</span>
          </div>
        </div>

        {/* Right Panel: Export Configuration */}
        <div className="lg:col-span-7 bg-card border border-border rounded-2xl shadow-lg p-8 flex flex-col gap-8 relative overflow-hidden h-full">
          {/* Subtle background decoration */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Select Application Range</h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/30 p-1.5 rounded-xl border border-border/50">
              {['today', '7days', '30days', 'custom'].map((range) => (
                <Button
                  key={range}
                  type="button"
                  variant={dateRange === range ? "default" : "ghost"}
                  onClick={() => setDateRange(range)}
                  className={`w-full transition-all rounded-lg h-10 ${
                    dateRange === range 
                      ? "bg-background text-primary shadow-sm border border-border/50 font-semibold hover:bg-background" 
                      : "text-muted-foreground font-medium hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  {range === 'today' && "Today"}
                  {range === '7days' && "7 Days"}
                  {range === '30days' && "30 Days"}
                  {range === 'custom' && "Custom"}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Date Inputs with smooth slide down */}
          <div className={`relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-5 transition-all duration-300 ease-in-out ${
            dateRange === 'custom' ? 'opacity-100 max-h-40 transform-none' : 'opacity-0 max-h-0 -translate-y-4 pointer-events-none overflow-hidden'
          }`}>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">From Date</Label>
              <div className="relative">
                <CalendarRange className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground/70" />
                <Input 
                  type="date" 
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="pl-10 bg-background border-border focus-visible:ring-primary h-11 rounded-xl shadow-sm transition-shadow hover:shadow-md" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">To Date</Label>
              <div className="relative">
                <CalendarRange className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground/70" />
                <Input 
                  type="date" 
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="pl-10 bg-background border-border focus-visible:ring-primary h-11 rounded-xl shadow-sm transition-shadow hover:shadow-md" 
                />
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 relative z-10">
            <Button 
              size="lg" 
              onClick={handleExport}
              className="w-full h-16 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group flex items-center justify-between px-7 rounded-xl"
            >
              <span className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                  <FileDown className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </div>
                Generate Excel Report
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">Ready</span>
                <ChevronRight className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4 font-medium flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse"></span>
              Depending on the data size, the export may take a few seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
