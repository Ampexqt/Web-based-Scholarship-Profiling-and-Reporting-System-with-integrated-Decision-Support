import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, X } from "lucide-react"
import { academicStructure } from "@/features/application/data/academicStructure"
import { cn } from "@/lib/utils"

interface CollegeMultiSelectProps {
  selectedColleges: string[]
  onChange: (colleges: string[]) => void
}

export const ALL_COLLEGE_ABBRS = academicStructure.map((c) => c.abbr)

export default function CollegeMultiSelect({
  selectedColleges,
  onChange,
}: CollegeMultiSelectProps) {
  const isAllSelected = selectedColleges.length === academicStructure.length

  const toggleAll = () => {
    if (isAllSelected) {
      onChange([])
    } else {
      onChange([...ALL_COLLEGE_ABBRS])
    }
  }

  const toggleCollege = (abbr: string) => {
    if (selectedColleges.includes(abbr)) {
      onChange(selectedColleges.filter((c) => c !== abbr))
    } else {
      onChange([...selectedColleges, abbr])
    }
  }

  return (
    <div className="flex flex-col gap-3" role="group" aria-label="College Filter Selection">
      {/* Header + Select All Toggle */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Building2 className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground font-sans">
            Filter by College / Department
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">
            {isAllSelected
              ? `All ${academicStructure.length} Colleges`
              : `${selectedColleges.length} of ${academicStructure.length} selected`}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleAll}
            className="h-7 text-xs px-2.5"
          >
            {isAllSelected ? "Deselect All" : "Select All"}
          </Button>
        </div>
      </div>

      {/* Selected Badges Strip */}
      <div className="flex flex-wrap items-center gap-1.5 min-h-[28px]">
        {selectedColleges.length === 0 ? (
          <span className="text-xs text-destructive font-medium">
            Select at least one college to export Annex 1.
          </span>
        ) : isAllSelected ? (
          <Badge variant="secondary" className="font-mono text-xs">
            All University Colleges ({academicStructure.length})
          </Badge>
        ) : (
          selectedColleges.map((abbr) => (
            <Badge
              key={abbr}
              variant="secondary"
              className="font-mono text-xs flex items-center gap-1 pr-1"
            >
              <span>{abbr}</span>
              <button
                type="button"
                aria-label={`Remove ${abbr}`}
                onClick={() => toggleCollege(abbr)}
                className="rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))
        )}
      </div>

      {/* Multi-Select Checkbox Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {academicStructure.map((college) => {
          const checked = selectedColleges.includes(college.abbr)
          const checkboxId = `report-college-${college.abbr.toLowerCase()}`

          return (
            <label
              key={college.abbr}
              htmlFor={checkboxId}
              className={cn(
                "flex items-start gap-2.5 p-2.5 rounded-lg border text-left cursor-pointer transition-colors",
                checked
                  ? "border-primary/50 bg-primary/5"
                  : "border-border bg-background hover:bg-muted/40"
              )}
            >
              <Checkbox
                id={checkboxId}
                aria-label={`${college.abbr} ${college.name}`}
                checked={checked}
                onCheckedChange={() => toggleCollege(college.abbr)}
                className="mt-0.5"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold font-mono text-primary leading-tight">
                  {college.abbr}
                </span>
                <span className="text-xs text-foreground truncate" title={college.name}>
                  {college.name}
                </span>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}
