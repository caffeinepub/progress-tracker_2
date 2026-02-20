import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Task, ChecklistItem, Goal, PerformanceRating, Reflection } from '../backend';
import { toast } from 'sonner';

// Tasks
export function useGetTasks() {
  const { actor, isFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTasks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, description, dueDate }: { title: string; description: string; dueDate: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addTask(title, description, dueDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add task');
    },
  });
}

export function useToggleTaskStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.toggleTaskStatus(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task status updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update task');
    },
  });
}

// Daily Checklist
export function useGetDailies() {
  const { actor, isFetching } = useActor();

  return useQuery<ChecklistItem[]>({
    queryKey: ['dailies'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDailies();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddDaily() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (text: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addDaily(text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailies'] });
      toast.success('Checklist item added');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add item');
    },
  });
}

export function useToggleDaily() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (text: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.toggleDaily(text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailies'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update item');
    },
  });
}

// Goals
export function useGetGoals() {
  const { actor, isFetching } = useActor();

  return useQuery<Goal[]>({
    queryKey: ['goals'],
    queryFn: async () => {
      if (!actor) return [];
      const goals = await actor.getGoals();
      // Sort by target date
      return goals.sort((a, b) => Number(a.targetDate - b.targetDate));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ text, targetDate }: { text: string; targetDate: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addGoal(text, targetDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Goal added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add goal');
    },
  });
}

export function useToggleGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ goalText, isCompleted }: { goalText: string; isCompleted: boolean }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateGoalStatus(goalText, isCompleted);
    },
    onMutate: async ({ goalText, isCompleted }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['goals'] });

      // Snapshot the previous value
      const previousGoals = queryClient.getQueryData<Goal[]>(['goals']);

      // Optimistically update to the new value
      queryClient.setQueryData<Goal[]>(['goals'], (old) => {
        if (!old) return old;
        return old.map((goal) =>
          goal.text === goalText ? { ...goal, isCompleted } : goal
        );
      });

      return { previousGoals };
    },
    onError: (error: Error, _variables, context) => {
      // Rollback on error
      if (context?.previousGoals) {
        queryClient.setQueryData(['goals'], context.previousGoals);
      }
      toast.error(error.message || 'Failed to update goal');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Goal updated');
    },
  });
}

// Performance Ratings
export function useGetPerformanceRating(date: Date) {
  const { actor, isFetching } = useActor();
  const dateNanos = BigInt(date.getTime()) * BigInt(1000000);

  return useQuery<PerformanceRating | null>({
    queryKey: ['performanceRating', dateNanos.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPerformanceRating(dateNanos);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetPerformanceRating() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, score }: { date: Date; score: number }) => {
      if (!actor) throw new Error('Actor not initialized');
      const dateNanos = BigInt(date.getTime()) * BigInt(1000000);
      return actor.setPerformanceRating(dateNanos, BigInt(score));
    },
    onMutate: async ({ date, score }) => {
      const dateNanos = BigInt(date.getTime()) * BigInt(1000000);
      const queryKey = ['performanceRating', dateNanos.toString()];

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousRating = queryClient.getQueryData<PerformanceRating | null>(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData<PerformanceRating | null>(queryKey, {
        date: dateNanos,
        score: BigInt(score),
      });

      return { previousRating, queryKey };
    },
    onError: (error: Error, _variables, context) => {
      // Rollback on error
      if (context?.queryKey && context?.previousRating !== undefined) {
        queryClient.setQueryData(context.queryKey, context.previousRating);
      }
      toast.error(error.message || 'Failed to set performance rating');
    },
    onSuccess: (_data, { date }) => {
      const dateNanos = BigInt(date.getTime()) * BigInt(1000000);
      queryClient.invalidateQueries({ queryKey: ['performanceRating', dateNanos.toString()] });
      queryClient.invalidateQueries({ queryKey: ['allPerformanceRatings'] });
      toast.success('Performance rating saved');
    },
  });
}

export function useGetAllPerformanceRatings() {
  const { actor, isFetching } = useActor();

  return useQuery<PerformanceRating[]>({
    queryKey: ['allPerformanceRatings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPerformanceRatings();
    },
    enabled: !!actor && !isFetching,
  });
}

// Reflections
export function useReflection(date: Date) {
  const { actor, isFetching } = useActor();
  const dateString = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD

  return useQuery<Reflection | null>({
    queryKey: ['reflection', dateString],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getReflection(dateString);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveReflection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, content }: { date: Date; content: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      const dateString = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      return actor.saveReflection(dateString, content);
    },
    onMutate: async ({ date, content }) => {
      const dateString = date.toISOString().split('T')[0];
      const queryKey = ['reflection', dateString];

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousReflection = queryClient.getQueryData<Reflection | null>(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData<Reflection | null>(queryKey, {
        date: dateString,
        content,
      });

      return { previousReflection, queryKey };
    },
    onError: (error: Error, _variables, context) => {
      // Rollback on error
      if (context?.queryKey && context?.previousReflection !== undefined) {
        queryClient.setQueryData(context.queryKey, context.previousReflection);
      }
      toast.error(error.message || 'Failed to save reflection');
    },
    onSuccess: (_data, { date }) => {
      const dateString = date.toISOString().split('T')[0];
      queryClient.invalidateQueries({ queryKey: ['reflection', dateString] });
      toast.success('Reflection saved');
    },
  });
}
