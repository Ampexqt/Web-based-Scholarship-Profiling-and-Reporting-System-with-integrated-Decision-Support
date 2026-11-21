import { useState, useEffect } from "react"
import { apiClient } from "@/lib/axios"
import PriorityGroupHeaderRow from "../components/PriorityGroupHeaderRow"
import CollegeBarChartCard from "../components/CollegeBarChartCard"
import StatusDonutChartCard from "../components/StatusDonutChartCard"
import IncomeHistogramCard from "../components/IncomeHistogramCard"

interface DashboardData {
  stats: {
    total: number
    pending: number
    accepted?: number
    approved: number
    rejected: number
    flagged: number
  }
  rates: {
    approvalRate: number
    verificationProgress: number
    priorityShare: number
  }
  priorityGroups: {
    pwd: number
    soloParent: number
    ip: number
    athlete: number
    indigent: number
  }
  collegeDistribution: Record<string, number>
  incomeDistribution: {
    below10k: number
    from10kTo20k: number
    from20kTo40k: number
    above40k: number
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    stats: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      flagged: 0
    },
    rates: {
      approvalRate: 0,
      verificationProgress: 0,
      priorityShare: 0
    },
    priorityGroups: {
      pwd: 0,
      soloParent: 0,
      ip: 0,
      athlete: 0,
      indigent: 0
    },
    collegeDistribution: {},
    incomeDistribution: {
      below10k: 0,
      from10kTo20k: 0,
      from20kTo40k: 0,
      above40k: 0
    }
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const res: any = await apiClient.get('/applications/stats')
        if (res.success) {
          setData({
            stats: {
              total: res.stats.total || 0,
              pending: res.stats.pending || 0,
              approved: res.stats.approved ?? res.stats.accepted ?? 0,
              rejected: res.stats.rejected || 0,
              flagged: res.stats.flagged || 0
            },
            rates: res.rates || {
              approvalRate: 0,
              verificationProgress: 0,
              priorityShare: 0
            },
            priorityGroups: res.priorityGroups || {
              pwd: 0,
              soloParent: 0,
              ip: 0,
              athlete: 0,
              indigent: 0
            },
            collegeDistribution: res.collegeDistribution || {},
            incomeDistribution: res.incomeDistribution || {
              below10k: 0,
              from10kTo20k: 0,
              from20kTo40k: 0,
              above40k: 0
            }
          })
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  const { stats, rates, priorityGroups, collegeDistribution, incomeDistribution } = data

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">
          Overview
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Scholarship applicant profiling, priority sector queues, and institutional demographic distributions.
        </p>
      </div>

      {/* Priority Groups Horizontal Header */}
      <PriorityGroupHeaderRow 
        stats={priorityGroups} 
        totalApplicants={stats.total} 
      />

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        {/* Left: Applications by College (Bar Chart) */}
        <div className="xl:col-span-7 flex flex-col">
          <CollegeBarChartCard 
            data={collegeDistribution} 
            total={stats.total} 
          />
        </div>

        {/* Right: Application Status (Donut Chart) */}
        <div className="xl:col-span-5 flex flex-col">
          <StatusDonutChartCard 
            stats={stats} 
            rates={rates} 
          />
        </div>

        {/* Bottom: Household Monthly Income Distribution */}
        <div className="xl:col-span-12">
          <IncomeHistogramCard 
            distribution={incomeDistribution} 
            total={stats.total} 
          />
        </div>
      </div>
    </div>
  )
}
