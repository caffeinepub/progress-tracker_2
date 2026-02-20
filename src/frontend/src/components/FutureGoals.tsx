import { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetGoals, useAddGoal } from '../hooks/useQueries';
import { GoalItem } from './GoalItem';
import { Skeleton } from '@/components/ui/skeleton';

export function FutureGoals() {
  const [newGoalText, setNewGoalText] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const { data: goals = [], isLoading } = useGetGoals();
  const addGoal = useAddGoal();

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim() || !targetDate) return;

    const dateObj = new Date(targetDate);
    const dateNanos = BigInt(dateObj.getTime()) * BigInt(1000000);

    addGoal.mutate(
      { text: newGoalText.trim(), targetDate: dateNanos },
      {
        onSuccess: () => {
          setNewGoalText('');
          setTargetDate('');
        },
      }
    );
  };

  return (
    <Card className="shadow-sm h-fit">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <CardTitle className="text-base sm:text-lg md:text-xl font-semibold">Future Goals</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAddGoal} className="space-y-3">
          <Input
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            placeholder="What's your goal?"
            className="h-11 text-base"
          />
          <div className="flex gap-2">
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="flex-1 h-11 text-base"
            />
            <Button
              type="submit"
              size="icon"
              disabled={addGoal.isPending || !newGoalText.trim() || !targetDate}
              className="h-11 w-11 flex-shrink-0 touch-manipulation"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </form>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs sm:text-sm text-muted-foreground">
              No goals yet. Set your first future goal!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {goals.map((goal) => (
              <GoalItem key={goal.text} goal={goal} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
