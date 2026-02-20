# Specification

## Summary
**Goal:** Add a daily reflection area where users can write notes for each day, with a custom header displaying "एकत्रा" and "वीर भोग्या वसुंधरा".

**Planned changes:**
- Create a DailyReflection component with text area for writing daily notes
- Add header text showing "एकत्रा" on the first line and "वीर भोग्या वसुंधरा" on the second line
- Implement backend storage for daily reflections associated with dates
- Create React Query hooks for saving and retrieving reflections
- Integrate DailyReflection component into DateDetailsPanel to show reflections for selected dates
- Apply warm earth-tone styling and mobile-responsive layout consistent with existing components

**User-visible outcome:** Users can select any date in the calendar and write/edit a reflection note for that day in a dedicated text area with custom header text, with their notes automatically saved and loaded.
