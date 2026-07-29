import StatCard from "../components/StatCard"
import PriorityGroupWidget from "../components/PriorityGroupWidget"
import RecentApplicationsTable from "../components/RecentApplicationsTable"
import { Users, FileText, FileX, CheckCircle } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-1">System snapshot and priority queues.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Applications" 
          value={1248} 
          icon={<FileText className="w-4 h-4" />} 
          trend={{ value: 12, label: "from last month", isPositive: true }}
          className="lg:col-span-1"
        />
        <StatCard 
          title="Pending Verification" 
          value={342} 
          icon={<Users className="w-4 h-4" />} 
          trend={{ value: 5, label: "from yesterday", isPositive: false }}
          className="lg:col-span-1"
        />
        <StatCard 
          title="Accepted" 
          value={824} 
          icon={<CheckCircle className="w-4 h-4" />} 
          className="lg:col-span-1"
        />
        <StatCard 
          title="Rejected" 
          value={82} 
          icon={<FileX className="w-4 h-4" />} 
          className="lg:col-span-1"
        />
        
        <PriorityGroupWidget />
        <RecentApplicationsTable />
      </div>
    </div>
  )
}
