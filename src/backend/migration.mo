import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";

module {
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

  type Goal = {
    text : Text;
    targetDate : Time.Time;
    isCompleted : Bool;
  };

  type PerformanceRating = {
    date : Time.Time;
    score : Nat;
  };

  type Reflection = {
    content : Text;
    date : Text;
  };

  type OldActor = {
    tasks : Map.Map<Text, Task>;
    dailies : Map.Map<Text, ChecklistItem>;
    goals : Map.Map<Text, Goal>;
    performanceRatings : Map.Map<Time.Time, PerformanceRating>;
  };

  type NewActor = {
    tasks : Map.Map<Text, Task>;
    dailies : Map.Map<Text, ChecklistItem>;
    goals : Map.Map<Text, Goal>;
    performanceRatings : Map.Map<Time.Time, PerformanceRating>;
    reflections : Map.Map<Text, Reflection>; // New reflections Map
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      reflections = Map.empty<Text, Reflection>() // Initialize for existing users
    };
  };
};
