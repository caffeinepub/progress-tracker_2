import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetTasks, useGetAllPerformanceRatings } from '../hooks/useQueries';
import { DateDetailsPanel } from './DateDetailsPanel';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { data: tasks = [] } = useGetTasks();
  const { data: performanceRatings = [] } = useGetAllPerformanceRatings();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Create a Set of dates that have performance ratings for efficient lookup
  const datesWithRatings = useMemo(() => {
    const dateSet = new Set<string>();
    performanceRatings.forEach((rating) => {
      const date = new Date(Number(rating.date) / 1000000);
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      dateSet.add(dateKey);
    });
    return dateSet;
  }, [performanceRatings]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [year, month]);

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      const taskDate = new Date(Number(task.dueDate) / 1000000); // Convert nanoseconds to milliseconds
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const hasPerformanceRating = (date: Date) => {
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return datesWithRatings.has(dateKey);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg md:text-xl font-semibold">
              {MONTHS[month]} {year}
            </CardTitle>
            <div className="flex gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousMonth}
                className="h-9 w-9 sm:h-10 sm:w-10 touch-manipulation"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNextMonth}
                className="h-9 w-9 sm:h-10 sm:w-10 touch-manipulation"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Day headers - full names on larger screens, single letter on mobile */}
            {DAYS.map((day, index) => (
              <div
                key={day}
                className="text-center text-xs sm:text-sm font-medium text-muted-foreground py-2"
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{DAYS_SHORT[index]}</span>
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dateTasks = getTasksForDate(date);
              const hasCompletedTasks = dateTasks.some((t) => t.status);
              const hasIncompleteTasks = dateTasks.some((t) => !t.status);
              const hasRating = hasPerformanceRating(date);

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`
                    aspect-square rounded-lg p-1 sm:p-2 text-xs sm:text-sm font-medium transition-all
                    hover:bg-accent hover:text-accent-foreground
                    active:scale-95 touch-manipulation
                    min-h-[44px] min-w-[44px]
                    ${isToday(date) ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
                    ${isSelected(date) && !isToday(date) ? 'bg-accent text-accent-foreground ring-2 ring-primary' : ''}
                    ${!isToday(date) && !isSelected(date) ? 'text-foreground' : ''}
                  `}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span>{date.getDate()}</span>
                    <div className="flex gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
                      {/* Task indicators */}
                      {hasIncompleteTasks && (
                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-destructive" />
                      )}
                      {hasCompletedTasks && (
                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-chart-2" />
                      )}
                      {/* Performance rating indicator */}
                      {hasRating && (
                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary ring-1 ring-primary/30" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedDate && (
        <DateDetailsPanel date={selectedDate} tasks={getTasksForDate(selectedDate)} onClose={() => setSelectedDate(null)} />
      )}
    </div>
  );
}
