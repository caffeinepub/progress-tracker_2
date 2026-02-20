import { Checkbox } from '@/components/ui/checkbox';
import type { ChecklistItem as ChecklistItemType } from '../backend';
import { useToggleDaily } from '../hooks/useQueries';

interface ChecklistItemProps {
  item: ChecklistItemType;
}

export function ChecklistItem({ item }: ChecklistItemProps) {
  const toggleDaily = useToggleDaily();

  const handleToggle = () => {
    toggleDaily.mutate(item.text);
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors min-h-[44px] touch-manipulation">
      <Checkbox
        id={item.text}
        checked={item.isComplete}
        onCheckedChange={handleToggle}
        disabled={toggleDaily.isPending}
        className="h-5 w-5 sm:h-4 sm:w-4"
      />
      <label
        htmlFor={item.text}
        className={`flex-1 text-sm cursor-pointer break-words ${
          item.isComplete ? 'line-through text-muted-foreground' : 'text-foreground'
        }`}
      >
        {item.text}
      </label>
    </div>
  );
}
