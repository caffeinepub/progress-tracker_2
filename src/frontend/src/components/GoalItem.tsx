import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from 'lucide-react';
import type { Goal } from '../backend';
import { useToggleGoal } from '../hooks/useQueries';

interface GoalItemProps {
  goal: Goal;
}

export function GoalItem({ goal }: GoalItemProps) {
  const toggleGoal = useToggleGoal();

  const handleToggle = () => {
    toggleGoal.mutate({ goalText: goal.text, isCompleted: !goal.isCompleted });
  };

  const targetDate = new Date(Number(goal.targetDate) / 1000000);
  const formattedDate = targetDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isOverdue = !goal.isCompleted && targetDate < new Date();

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors min-h-[44px] touch-manipulation border border-border">
      <Checkbox
        id={goal.text}
        checked={goal.isCompleted}
        onCheckedChange={handleToggle}
        disabled={toggleGoal.isPending}
        className="h-5 w-5 sm:h-4 sm:w-4 mt-1"
      />
      <div className="flex-1 min-w-0">
        <label
          htmlFor={goal.text}
          className={`block text-sm cursor-pointer break-words ${
            goal.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
          }`}
        >
          {goal.text}
        </label>
        <div
          className={`flex items-center gap-1.5 text-xs mt-1 ${
            isOverdue ? 'text-destructive' : 'text-muted-foreground'
          }`}
        >
          <Calendar className="h-3 w-3" />
          <span>{formattedDate}</span>
          {isOverdue && <span className="font-medium">• Overdue</span>}
        </div>
      </div>
    </div>
  );
}
