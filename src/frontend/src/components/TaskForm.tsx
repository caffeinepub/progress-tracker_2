import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAddTask } from '../hooks/useQueries';

interface TaskFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function TaskForm({ onSuccess, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const addTask = useAddTask();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !dueDate) {
      return;
    }

    // Convert date to nanoseconds (Internet Computer time format)
    const dateObj = new Date(dueDate);
    const nanoseconds = BigInt(dateObj.getTime()) * BigInt(1000000);

    addTask.mutate(
      { title: title.trim(), description: description.trim(), dueDate: nanoseconds },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setDueDate('');
          onSuccess();
        },
      }
    );
  };

  return (
    <Card className="p-3 sm:p-4 bg-accent/30">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm">Task Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
            className="h-11 text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details about this task"
            rows={3}
            className="text-base resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate" className="text-sm">Due Date *</Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="h-11 text-base"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="h-11 sm:h-10 w-full sm:w-auto touch-manipulation"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={addTask.isPending}
            className="h-11 sm:h-10 w-full sm:w-auto touch-manipulation"
          >
            {addTask.isPending ? 'Adding...' : 'Add Task'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
