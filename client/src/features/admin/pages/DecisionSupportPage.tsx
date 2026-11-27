import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, Scale, Sliders } from "lucide-react"
import { apiClient as api } from "@/lib/axios"
import MasterlistCrossRefTab from "../components/MasterlistCrossRefTab"
import McdaRankingMatrixTab from "../components/McdaRankingMatrixTab"
import McdaWeightConfigTab from "../components/McdaWeightConfigTab"
import type {
  FlaggedApplicationRecord,
  McdaRankingsResponse,
  McdaTrackKey,
  McdaWeightsResponse,
  OfficialUploadRecord,
} from "../types/decisionSupport"

export default function DecisionSupportPage() {
  const [activeTab, setActiveTab] = useState("cross-reference")
  const [uploads, setUploads] = useState<OfficialUploadRecord[]>([])
  const [flags, setFlags] = useState<FlaggedApplicationRecord[]>([])

  const [selectedTrack, setSelectedTrack] = useState<McdaTrackKey>("balanced")
  const [quota, setQuota] = useState<number>(50)
  const [selectedCollege, setSelectedCollege] = useState<string>("all")
  const [rankingsData, setRankingsData] = useState<McdaRankingsResponse | null>(null)
  const [weightsData, setWeightsData] = useState<McdaWeightsResponse | null>(null)
  const [isLoadingRankings, setIsLoadingRankings] = useState<boolean>(false)

  const fetchCrossRefData = useCallback(async () => {
    try {
      const [uploadsRes, flagsRes] = await Promise.all([
        api.get("/decision-support/history"),
        api.get("/decision-support/flags"),
      ])
      setUploads(Array.isArray(uploadsRes) ? (uploadsRes as OfficialUploadRecord[]) : [])
      setFlags(Array.isArray(flagsRes) ? (flagsRes as FlaggedApplicationRecord[]) : [])
    } catch (error) {
      console.error("Failed to fetch decision support cross-reference data", error)
    }
  }, [])

  const fetchWeights = useCallback(async () => {
    try {
      const res = (await api.get("/decision-support/weights")) as McdaWeightsResponse
      if (res?.success) {
        setWeightsData(res)
      }
    } catch (error) {
      console.error("Failed to fetch MCDA weights", error)
    }
  }, [])

  const fetchRankings = useCallback(async () => {
    setIsLoadingRankings(true)
    try {
      const params = new URLSearchParams({
        track: selectedTrack,
        quota: String(quota),
      })
      if (selectedCollege && selectedCollege !== "all") {
        params.set("college", selectedCollege)
      }
      const res = (await api.get(`/decision-support/rankings?${params.toString()}`)) as McdaRankingsResponse
      if (res?.success) {
        setRankingsData(res)
      }
    } catch (error) {
      console.error("Failed to fetch MCDA rankings", error)
    } finally {
      setIsLoadingRankings(false)
    }
  }, [selectedTrack, quota, selectedCollege])

  useEffect(() => {
    fetchCrossRefData()
  }, [fetchCrossRefData])

  useEffect(() => {
    if (activeTab === "rankings") {
      fetchRankings()
    } else if (activeTab === "weights") {
      fetchWeights()
    }
  }, [activeTab, fetchRankings, fetchWeights])

  const handleWeightsSaved = () => {
    fetchWeights()
    setSelectedTrack("custom")
    fetchRankings()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
          Decision Support
        </h1>
        <p className="text-sm text-muted-foreground">
          Cross-reference official scholar masterlists, rank applicants via Multi-Criteria Decision Analysis (SAW), and manage evaluation track weights.
        </p>
      </div>

      {/* 3-Tab MCDA Decision Support Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-5">
        <TabsList className="w-full sm:w-fit h-auto flex flex-wrap p-1 bg-muted/60 border border-border/60 rounded-lg gap-1">
          <TabsTrigger value="cross-reference" className="px-3.5 py-2 gap-2">
            <ShieldAlert className="size-4" />
            <span>Masterlist Cross-Referencing</span>
            {flags.length > 0 && (
              <Badge variant="destructive" className="ml-1 px-1.5 py-0 text-[10px] font-mono">
                {flags.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rankings" className="px-3.5 py-2 gap-2">
            <Scale className="size-4" />
            <span>MCDA Ranking & Quota Matrix</span>
          </TabsTrigger>
          <TabsTrigger value="weights" className="px-3.5 py-2 gap-2">
            <Sliders className="size-4" />
            <span>Weight Configuration</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cross-reference">
          <MasterlistCrossRefTab
            uploads={uploads}
            flags={flags}
            onRefresh={() => {
              fetchCrossRefData()
              fetchRankings()
            }}
          />
        </TabsContent>

        <TabsContent value="rankings">
          <McdaRankingMatrixTab
            data={rankingsData}
            isLoading={isLoadingRankings}
            selectedTrack={selectedTrack}
            quota={quota}
            selectedCollege={selectedCollege}
            onTrackChange={setSelectedTrack}
            onQuotaChange={setQuota}
            onCollegeChange={setSelectedCollege}
            onRefresh={fetchRankings}
          />
        </TabsContent>

        <TabsContent value="weights">
          <McdaWeightConfigTab
            tracks={weightsData?.tracks ?? []}
            activeWeights={
              weightsData?.activeWeights ?? {
                gwaWeight: 35,
                incomeWeight: 30,
                householdWeight: 15,
                priorityWeight: 20,
              }
            }
            onSaved={handleWeightsSaved}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
