import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useGetDailies, useAddDaily } from '../hooks/useQueries';
import { ChecklistItem } from './ChecklistItem';
import { Skeleton } from '@/components/ui/skeleton';

export function DailyChecklist() {
  const [newItemText, setNewItemText] = useState('');
  const { data: items = [], isLoading } = useGetDailies();
  const addDaily = useAddDaily();

  const completedCount = items.filter(item => item.isComplete).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    addDaily.mutate(newItemText.trim(), {
      onSuccess: () => {
        setNewItemText('');
      },
    });
  };

  return (
    <Card className="shadow-sm h-fit md:sticky md:top-8">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg md:text-xl font-semibold">Daily Checklist</CardTitle>
        <div className="space-y-2 mt-3">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {completedCount} / {totalCount}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAddItem} className="flex gap-2">
          <Input
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add new item..."
            className="flex-1 h-11 text-base"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={addDaily.isPending}
            className="h-11 w-11 flex-shrink-0 touch-manipulation"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </form>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs sm:text-sm text-muted-foreground">
              No items yet. Add your first checklist item!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <ChecklistItem key={item.text} item={item} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
