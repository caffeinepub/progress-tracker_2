import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Task {
    status: boolean;
    title: string;
    dueDate: Time;
    description: string;
}
export interface Reflection {
    content: string;
    date: string;
}
export interface PerformanceRating {
    date: Time;
    score: bigint;
}
export type Time = bigint;
export interface ChecklistItem {
    text: string;
    isComplete: boolean;
}
export interface Goal {
    isCompleted: boolean;
    text: string;
    targetDate: Time;
}
export interface backendInterface {
    addDaily(text: string): Promise<void>;
    addGoal(text: string, targetDate: Time): Promise<void>;
    addTask(title: string, description: string, dueDate: Time): Promise<void>;
    getAllPerformanceRatings(): Promise<Array<PerformanceRating>>;
    getAllReflections(): Promise<Array<Reflection>>;
    getDailies(): Promise<Array<ChecklistItem>>;
    getGoals(): Promise<Array<Goal>>;
    getPerformanceRating(date: Time): Promise<PerformanceRating | null>;
    getReflection(date: string): Promise<Reflection | null>;
    getTasks(): Promise<Array<Task>>;
    saveReflection(date: string, content: string): Promise<void>;
    setPerformanceRating(date: Time, score: bigint): Promise<void>;
    toggleDaily(text: string): Promise<void>;
    toggleTaskStatus(taskId: string): Promise<void>;
    updateGoalStatus(goalText: string, isCompleted: boolean): Promise<void>;
}
