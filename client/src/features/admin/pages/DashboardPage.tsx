import StatCard from "../components/StatCard"
import PriorityGroupWidget from "../components/PriorityGroupWidget"
import RecentApplicationsTable from "../components/RecentApplicationsTable"
import { Users, FileText, FileX, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { apiClient } from "@/lib/axios"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res: any = await apiClient.get('/applications/stats');
        if (res.success) {
          setStats(res.stats);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };
    fetchStats();
  }, []);
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-1">System snapshot and priority queues.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Applications" 
          value={stats.total} 
          icon={<FileText className="w-4 h-4" />} 
          className="lg:col-span-1"
        />
        <StatCard 
          title="Pending Verification" 
          value={stats.pending} 
          icon={<Users className="w-4 h-4" />} 
          className="lg:col-span-1"
        />
        <StatCard 
          title="Accepted" 
          value={stats.accepted} 
          icon={<CheckCircle className="w-4 h-4" />} 
          className="lg:col-span-1"
        />
        <StatCard 
          title="Rejected" 
          value={stats.rejected} 
          icon={<FileX className="w-4 h-4" />} 
          className="lg:col-span-1"
        />
        
        <PriorityGroupWidget />
        <RecentApplicationsTable />
      </div>
    </div>
  )
}
