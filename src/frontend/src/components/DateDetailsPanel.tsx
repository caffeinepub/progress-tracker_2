import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Task } from '../backend';
import { TaskItem } from './TaskItem';
import { PerformanceRating } from './PerformanceRating';
import { DailyReflection } from './DailyReflection';

interface DateDetailsPanelProps {
  date: Date;
  tasks: Task[];
  onClose: () => void;
}

export function DateDetailsPanel({ date, tasks, onClose }: DateDetailsPanelProps) {
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const completedTasks = tasks.filter((t) => t.status);
  const incompleteTasks = tasks.filter((t) => !t.status);

  return (
    <Card className="shadow-sm w-full">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base sm:text-lg font-semibold break-words">{formattedDate}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
              </Badge>
              {completedTasks.length > 0 && (
                <Badge variant="secondary" className="text-xs bg-chart-2/10 text-chart-2 border-chart-2/20">
                  {completedTasks.length} completed
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-11 w-11 sm:h-9 sm:w-9 flex-shrink-0 touch-manipulation"
          >
            <X className="h-5 w-5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[60vh] sm:max-h-[400px]">
          <div className="space-y-4 pr-4">
            {/* Performance Rating Section */}
            <PerformanceRating date={date} />

            <Separator />

            {/* Daily Reflection Section */}
            <DailyReflection date={date} />

            <Separator />

            {/* Tasks Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Tasks</h3>
              {tasks.length === 0 ? (
                <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">
                  No tasks scheduled for this day
                </p>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <TaskItem key={task.title} task={task} compact />
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
