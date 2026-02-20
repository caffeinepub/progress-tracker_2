import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetPerformanceRating, useSetPerformanceRating } from '../hooks/useQueries';
import { TrendingUp } from 'lucide-react';

interface PerformanceRatingProps {
  date: Date;
}

export function PerformanceRating({ date }: PerformanceRatingProps) {
  const { data: rating, isLoading } = useGetPerformanceRating(date);
  const setRating = useSetPerformanceRating();

  const currentScore = rating ? Number(rating.score) : null;

  const handleRatingClick = (score: number) => {
    setRating.mutate({ date, score });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Performance Rating</h3>
      </div>

      {isLoading ? (
        <Skeleton className="h-20 w-full" />
      ) : (
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
            <Button
              key={score}
              variant={currentScore === score ? 'default' : 'outline'}
              size="lg"
              onClick={() => handleRatingClick(score)}
              disabled={setRating.isPending}
              className={`h-11 w-full min-w-[44px] touch-manipulation font-semibold ${
                currentScore === score
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'hover:bg-accent'
              }`}
            >
              {score}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
