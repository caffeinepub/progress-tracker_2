import { Calendar, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Task } from '../backend';
import { useToggleTaskStatus } from '../hooks/useQueries';

interface TaskItemProps {
  task: Task;
  compact?: boolean;
}

export function TaskItem({ task, compact = false }: TaskItemProps) {
  const toggleStatus = useToggleTaskStatus();

  const handleToggle = () => {
    toggleStatus.mutate(task.title);
  };

  const dueDate = new Date(Number(task.dueDate) / 1000000);
  const formattedDate = dueDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isOverdue = !task.status && dueDate < new Date();

  return (
    <Card className={`transition-all ${task.status ? 'opacity-60' : ''} ${compact ? 'p-3' : 'p-3 sm:p-4'}`}>
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          disabled={toggleStatus.isPending}
          className={`h-11 w-11 sm:h-9 sm:w-9 mt-0.5 flex-shrink-0 touch-manipulation ${
            task.status ? 'text-chart-2' : 'text-muted-foreground hover:text-primary'
          }`}
        >
          {task.status ? (
            <CheckCircle2 className="h-5 w-5 sm:h-5 sm:w-5" />
          ) : (
            <Circle className="h-5 w-5 sm:h-5 sm:w-5" />
          )}
        </Button>

        <div className="flex-1 min-w-0">
          <h4
            className={`font-medium ${
              task.status ? 'line-through text-muted-foreground' : 'text-foreground'
            } ${compact ? 'text-sm' : 'text-sm sm:text-base'}`}
          >
            {task.title}
          </h4>
          {task.description && !compact && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">{task.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <div
              className={`flex items-center gap-1.5 text-xs ${
                isOverdue ? 'text-destructive' : 'text-muted-foreground'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>
            {isOverdue && (
              <span className="text-xs font-medium text-destructive">Overdue</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
