import { ReactNode } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

export interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (item: T) => ReactNode
  className?: string
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  onSort?: (key: string) => void
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  emptyMessage?: string
  isLoading?: boolean
}

export function Table<T extends { _id: string }>({
  data,
  columns,
  onSort,
  sortKey,
  sortDirection,
  emptyMessage = 'No hay datos disponibles',
  isLoading = false,
}: TableProps<T>) {
  const handleSort = (key: string, sortable?: boolean) => {
    if (sortable && onSort) {
      onSort(key)
    }
  }

  const getSortIcon = (columnKey: string, sortable?: boolean) => {
    if (!sortable) return null

    if (sortKey === columnKey) {
      return sortDirection === 'asc' ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      )
    }

    return <ChevronsUpDown className="w-4 h-4 text-gray-400" />
  }

  if (isLoading) {
    return (
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''
                  }`}
                  onClick={() => handleSort(column.key, column.sortable)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {getSortIcon(column.key, column.sortable)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''
                } ${column.className || ''}`}
                onClick={() => handleSort(column.key, column.sortable)}
              >
                <div className="flex items-center gap-2">
                  <span>{column.label}</span>
                  {getSortIcon(column.key, column.sortable)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-6 py-4 whitespace-nowrap text-sm ${column.className || ''}`}
                >
                  {column.render ? column.render(item) : (item as any)[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}