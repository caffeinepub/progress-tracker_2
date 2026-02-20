import { Calendar } from './components/Calendar';
import { TaskList } from './components/TaskList';
import { DailyChecklist } from './components/DailyChecklist';
import { FutureGoals } from './components/FutureGoals';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Calendar Section - Takes full width on mobile, 2 columns on large screens */}
            <div className="md:col-span-2 lg:col-span-2">
              <Calendar />
            </div>

            {/* Daily Checklist - Full width on mobile, 1 column on larger screens */}
            <div className="md:col-span-2 lg:col-span-1">
              <DailyChecklist />
            </div>

            {/* Future Goals - Full width on mobile, 1 column on larger screens */}
            <div className="md:col-span-2 lg:col-span-1">
              <FutureGoals />
            </div>

            {/* Task List - Full width on all screens */}
            <div className="md:col-span-2 lg:col-span-3">
              <TaskList />
            </div>
          </div>
        </main>
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
