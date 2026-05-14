interface ActivityActionsProps {
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}

export function ActivityActions({ onEdit, onDuplicate, onDelete }: ActivityActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={onEdit}
        className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
      >
        Editar
      </button>
      <button
        type="button"
        onClick={onDuplicate}
        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50"
      >
        Duplicar
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="rounded-md border border-red-200 px-2.5 py-1 text-xs text-red-600 hover:bg-red-50"
      >
        Eliminar
      </button>
    </div>
  )
}
