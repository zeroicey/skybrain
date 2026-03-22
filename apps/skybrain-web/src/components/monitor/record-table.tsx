import { Play, Download } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { VideoRecord } from '@/types/drone'

interface RecordTableProps {
  records: VideoRecord[]
  onPlay?: (record: VideoRecord) => void
  onDownload?: (record: VideoRecord) => void
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}小时${mins}分钟`
  }
  if (mins > 0) {
    return `${mins}分钟${secs}秒`
  }
  return `${secs}秒`
}

export function RecordTable({ records, onPlay, onDownload }: RecordTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>无人机</TableHead>
            <TableHead>开始时间</TableHead>
            <TableHead>结束时间</TableHead>
            <TableHead>时长</TableHead>
            <TableHead>文件大小</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.droneName}</TableCell>
              <TableCell>{record.startTime}</TableCell>
              <TableCell>{record.endTime}</TableCell>
              <TableCell>{formatDuration(record.duration)}</TableCell>
              <TableCell>{record.fileSize}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onPlay?.(record)}
                    title="播放"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDownload?.(record)}
                    title="下载"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {records.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                暂无录像记录
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}