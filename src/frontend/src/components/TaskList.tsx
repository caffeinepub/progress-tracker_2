import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetTasks } from '../hooks/useQueries';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';
import { Skeleton } from '@/components/ui/skeleton';

export function TaskList() {
  const [showForm, setShowForm] = useState(false);
  const { data: tasks = [], isLoading } = useGetTasks();

  const incompleteTasks = tasks.filter(t => !t.status);
  const completedTasks = tasks.filter(t => t.status);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base sm:text-lg md:text-xl font-semibold">Tasks</CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {incompleteTasks.length} active • {completedTasks.length} completed
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            size="sm"
            className="gap-2 h-11 sm:h-9 w-full sm:w-auto touch-manipulation"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showForm && (
          <TaskForm onSuccess={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xs sm:text-sm text-muted-foreground">No tasks yet. Create your first task to get started!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {incompleteTasks.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Active Tasks
                </h3>
                {incompleteTasks.map(task => (
                  <TaskItem key={task.title} task={task} />
                ))}
              </div>
            )}

            {completedTasks.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Completed
                </h3>
                {completedTasks.map(task => (
                  <TaskItem key={task.title} task={task} />
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
