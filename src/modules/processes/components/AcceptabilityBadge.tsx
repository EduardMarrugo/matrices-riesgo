import type { Acceptability } from '@/core/types/process'
import { ACCEPTABILITY_META } from '@/core/utils/risk'

interface AcceptabilityBadgeProps {
  acceptability: Acceptability
  riskLevel: number
}

export function AcceptabilityBadge({
  acceptability,
  riskLevel,
}: AcceptabilityBadgeProps) {
  const meta = ACCEPTABILITY_META[acceptability]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium ${meta.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      <span className="font-semibold tabular-nums">{riskLevel}</span>
      <span className="text-slate-500">·</span>
      <span>{meta.label}</span>
    </span>
  )
}
