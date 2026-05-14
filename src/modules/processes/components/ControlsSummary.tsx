import type { SharedControls } from '@/core/types/process'

interface ControlsSummaryProps {
  controls: SharedControls
}

const ITEMS: Array<{ key: keyof SharedControls; short: string }> = [
  { key: 'engineering', short: 'Ing' },
  { key: 'administrative', short: 'Adm' },
  { key: 'ppe', short: 'EPP' },
]

export function ControlsSummary({ controls }: ControlsSummaryProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {ITEMS.map(({ key, short }) => {
        const value = controls?.[key]?.trim() ?? ''
        const filled = value.length > 0
        return (
          <span
            key={key}
            title={filled ? value : `Sin control ${short}`}
            className={
              filled
                ? 'inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-700'
                : 'inline-flex items-center gap-1 rounded-md border border-dashed border-slate-200 px-1.5 py-0.5 text-[11px] text-slate-400'
            }
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${filled ? 'bg-emerald-500' : 'bg-slate-300'}`}
            />
            {short}
          </span>
        )
      })}
    </div>
  )
}
