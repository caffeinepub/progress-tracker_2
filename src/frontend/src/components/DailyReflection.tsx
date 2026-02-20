import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useReflection, useSaveReflection } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';

interface DailyReflectionProps {
  date: Date;
}

export function DailyReflection({ date }: DailyReflectionProps) {
  const { data: reflection, isLoading } = useReflection(date);
  const saveReflection = useSaveReflection();
  const [content, setContent] = useState('');
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Update local content when reflection data changes
  useEffect(() => {
    setContent(reflection?.content || '');
  }, [reflection]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Clear existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    // Set new timeout to auto-save after 1 second of inactivity
    const timeout = setTimeout(() => {
      saveReflection.mutate({ date, content: newContent });
    }, 1000);

    setSaveTimeout(timeout);
  };

  return (
    <div className="space-y-3">
      <div className="text-center space-y-1">
        <h3 className="text-lg sm:text-xl font-bold text-primary">एकत्रा</h3>
        <p className="text-sm sm:text-base font-semibold text-muted-foreground">वीर भोग्या वसुंधरा</p>
      </div>
      
      <div className="relative">
        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Write your daily reflection..."
          className="min-h-[120px] resize-none border-primary/20 focus:border-primary text-sm sm:text-base"
          disabled={isLoading}
        />
        {saveReflection.isPending && (
          <div className="absolute top-2 right-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
