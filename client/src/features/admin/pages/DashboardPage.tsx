import { useState, useEffect } from "react"
import { apiClient } from "@/lib/axios"
import { Skeleton } from "@/components/ui/skeleton"
import DashboardKpiRow from "../components/DashboardKpiRow"
import PriorityGroupHeaderRow from "../components/PriorityGroupHeaderRow"
import CollegeBarChartCard from "../components/CollegeBarChartCard"
import StatusDonutChartCard from "../components/StatusDonutChartCard"
import IncomeHistogramCard from "../components/IncomeHistogramCard"
import PrioritySectorDonutCard from "../components/PrioritySectorDonutCard"

interface DashboardData {
  stats: {
    total: number
    pending: number
    accepted?: number
    approved: number
    rejected: number
    flagged: number
    recentIntakeCount?: number
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

const INITIAL_DATA: DashboardData = {
  stats: {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    flagged: 0,
    recentIntakeCount: 0,
  },
  rates: {
    approvalRate: 0,
    verificationProgress: 0,
    priorityShare: 0,
  },
  priorityGroups: {
    pwd: 0,
    soloParent: 0,
    ip: 0,
    athlete: 0,
    indigent: 0,
  },
  collegeDistribution: {},
  incomeDistribution: {
    below10k: 0,
    from10kTo20k: 0,
    from20kTo40k: 0,
    above40k: 0,
  },
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>(INITIAL_DATA)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const res = (await apiClient.get("/applications/stats")) as {
          success?: boolean
          stats?: Partial<DashboardData["stats"]>
          rates?: Partial<DashboardData["rates"]>
          priorityGroups?: Partial<DashboardData["priorityGroups"]>
          collegeDistribution?: Record<string, number>
          incomeDistribution?: Partial<DashboardData["incomeDistribution"]>
        }

        if (res?.success) {
          const total = res.stats?.total || 0
          const approved = res.stats?.approved ?? res.stats?.accepted ?? 0
          const rejected = res.stats?.rejected || 0
          const pending = res.stats?.pending || 0
          const flagged = res.stats?.flagged || 0
          const processed = approved + rejected

          const priorityGroups = {
            pwd: res.priorityGroups?.pwd || 0,
            soloParent: res.priorityGroups?.soloParent || 0,
            ip: res.priorityGroups?.ip || 0,
            athlete: res.priorityGroups?.athlete || 0,
            indigent: res.priorityGroups?.indigent || 0,
          }

          const fallbackPriorityCount = Math.min(
            total,
            priorityGroups.pwd +
              priorityGroups.soloParent +
              priorityGroups.ip +
              priorityGroups.athlete +
              priorityGroups.indigent
          )

          setData({
            stats: {
              total,
              pending,
              approved,
              rejected,
              flagged,
              recentIntakeCount: res.stats?.recentIntakeCount ?? 0,
            },
            rates: {
              approvalRate:
                res.rates?.approvalRate ?? (processed > 0 ? Math.round((approved / processed) * 100) : 0),
              verificationProgress:
                res.rates?.verificationProgress ?? (total > 0 ? Math.round((processed / total) * 100) : 0),
              priorityShare:
                res.rates?.priorityShare ?? (total > 0 ? Math.round((fallbackPriorityCount / total) * 100) : 0),
            },
            priorityGroups,
            collegeDistribution: res.collegeDistribution || {},
            incomeDistribution: {
              below10k: res.incomeDistribution?.below10k || 0,
              from10kTo20k: res.incomeDistribution?.from10kTo20k || 0,
              from20kTo40k: res.incomeDistribution?.from20kTo40k || 0,
              above40k: res.incomeDistribution?.above40k || 0,
            },
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
  const priorityTotalFlags =
    priorityGroups.pwd +
    priorityGroups.soloParent +
    priorityGroups.ip +
    priorityGroups.athlete +
    priorityGroups.indigent

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
          Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Zero-click executive view of scholarship intake, verification rates, and socio-economic demographics.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <Skeleton key={n} className="h-32 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <Skeleton className="xl:col-span-7 h-72 rounded-xl" />
            <Skeleton className="xl:col-span-5 h-72 rounded-xl" />
          </div>
        </div>
      ) : (
        <>
          {/* 4 Executive KPI Cards */}
          <DashboardKpiRow
            stats={stats}
            rates={rates}
            priorityTotalFlags={priorityTotalFlags}
          />

          {/* Priority Groups Quick Drilldown Strip */}
          <PriorityGroupHeaderRow
            stats={priorityGroups}
            totalApplicants={stats.total}
          />

          {/* Main Analytics Bento Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
            <div className="xl:col-span-7 flex flex-col">
              <CollegeBarChartCard data={collegeDistribution} total={stats.total} />
            </div>

            <div className="xl:col-span-5 flex flex-col">
              <StatusDonutChartCard stats={stats} rates={rates} />
            </div>

            <div className="xl:col-span-7 flex flex-col">
              <IncomeHistogramCard distribution={incomeDistribution} />
            </div>

            <div className="xl:col-span-5 flex flex-col">
              <PrioritySectorDonutCard stats={priorityGroups} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
