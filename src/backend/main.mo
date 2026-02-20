import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Task = {
    title : Text;
    description : Text;
    dueDate : Time.Time;
    status : Bool;
  };

  type ChecklistItem = {
    text : Text;
    isComplete : Bool;
  };

  type Reflection = {
    content : Text;
    date : Text;
  };

  module Task {
    public func compare(a : Task, b : Task) : Order.Order {
      Text.compare(a.title, b.title);
    };
  };

  type Goal = {
    text : Text;
    targetDate : Time.Time;
    isCompleted : Bool;
  };

  type PerformanceRating = {
    date : Time.Time;
    score : Nat;
  };

  let tasks = Map.empty<Text, Task>();
  let dailies = Map.empty<Text, ChecklistItem>();
  let goals = Map.empty<Text, Goal>();
  let performanceRatings = Map.empty<Time.Time, PerformanceRating>();
  let reflections = Map.empty<Text, Reflection>();

  //-------------------
  // Reflections
  //-------------------

  public shared ({ caller }) func saveReflection(date : Text, content : Text) : async () {
    let reflection = {
      content;
      date;
    };
    reflections.add(date, reflection);
  };

  public query ({ caller }) func getReflection(date : Text) : async ?Reflection {
    reflections.get(date);
  };

  public query ({ caller }) func getAllReflections() : async [Reflection] {
    reflections.values().toArray();
  };

  //-------------------
  // Tasks
  //-------------------

  public shared ({ caller }) func addTask(title : Text, description : Text, dueDate : Time.Time) : async () {
    if (tasks.containsKey(title)) {
      Runtime.trap("Task with this title already exists");
    };
    let task : Task = {
      title;
      description;
      dueDate;
      status = false;
    };
    tasks.add(title, task);
  };

  public shared ({ caller }) func toggleTaskStatus(taskId : Text) : async () {
    switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) {
        let updatedTask = { task with status = not task.status };
        tasks.add(taskId, updatedTask);
      };
    };
  };

  public query ({ caller }) func getTasks() : async [Task] {
    tasks.values().toArray().sort();
  };

  //-------------------
  // Dailies
  //-------------------

  public shared ({ caller }) func addDaily(text : Text) : async () {
    if (dailies.containsKey(text)) {
      Runtime.trap("Daily with this text already exists");
    };
    let daily : ChecklistItem = {
      text;
      isComplete = false;
    };
    dailies.add(text, daily);
  };

  public shared ({ caller }) func toggleDaily(text : Text) : async () {
    switch (dailies.get(text)) {
      case (null) { Runtime.trap("Item not found") };
      case (?item) {
        let updatedItem = { item with isComplete = not item.isComplete };
        dailies.add(text, updatedItem);
      };
    };
  };

  public query ({ caller }) func getDailies() : async [ChecklistItem] {
    dailies.values().toArray();
  };

  //-------------------
  // Goal Setting
  //-------------------

  public shared ({ caller }) func addGoal(text : Text, targetDate : Time.Time) : async () {
    if (goals.containsKey(text)) {
      Runtime.trap("Goal with this text already exists");
    };
    let goal : Goal = {
      text;
      targetDate;
      isCompleted = false;
    };
    goals.add(text, goal);
  };

  public shared ({ caller }) func updateGoalStatus(goalText : Text, isCompleted : Bool) : async () {
    switch (goals.get(goalText)) {
      case (null) { Runtime.trap("Goal not found") };
      case (?goal) {
        let updatedGoal = { goal with isCompleted };
        goals.add(goalText, updatedGoal);
      };
    };
  };

  public query ({ caller }) func getGoals() : async [Goal] {
    goals.values().toArray();
  };

  //-------------------
  // Performance Rating
  //-------------------

  public shared ({ caller }) func setPerformanceRating(date : Time.Time, score : Nat) : async () {
    if (score < 1 or score > 10) {
      Runtime.trap("Score must be a number between 1 and 10");
    };
    let rating : PerformanceRating = {
      date;
      score;
    };
    performanceRatings.add(date, rating);
  };

  public query ({ caller }) func getPerformanceRating(date : Time.Time) : async ?PerformanceRating {
    performanceRatings.get(date);
  };

  public query ({ caller }) func getAllPerformanceRatings() : async [PerformanceRating] {
    performanceRatings.values().toArray();
  };
};
