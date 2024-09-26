import React, { useState } from "react";
import FormSection from "../components/Form/FormSection";
import SearchableSelect from "../components/Form/Select";
import TimeInput from "../common/TimeInput/TimeInput";
import FormButton from "../components/Form/FormButton";
import DynamicFilterBar2 from "../common/FilterBar/SelectDropDownFilterTimeTable";

const CreateTimetable = () => {
  const [classId, setClassId] = useState("");
  const [subjectGroupId, setSubjectGroupId] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [classInterval, setClassInterval] = useState("30"); // Period running time in minutes
  const [periodStartTiming, setPeriodStartTiming] = useState("07:00"); // Default period start time
  const [lunchBreak, setLunchBreak] = useState("15"); // Lunch break duration
  const [lunchBreakAfterPeriod, setLunchBreakAfterPeriod] = useState("2"); // Lunch break after period
  const [entries, setEntries] = useState([]);

  const handleAddPeriod = () => {
    const intervalInMinutes = parseInt(classInterval);
    const lunchBreakInMinutes = parseInt(lunchBreak);
    const lunchBreakAfterPeriodInt = parseInt(lunchBreakAfterPeriod);
  
    let nextStartTime;
  
    if (entries.length === 0) {
      // First period starts at the initial start timing
      nextStartTime = periodStartTiming;
    } else {
      // Subsequent periods start after the last period's end time
      const lastEntry = entries[entries.length - 1];
      nextStartTime = lastEntry.endTime;
  
      // If the last period was a Lunch Break, we don't add an interval
      if (lastEntry.period !== "Lunch Break") {
        nextStartTime = calculateEndTime(nextStartTime, 5); // Add interval between periods
      }
    }
  
    // Validate nextStartTime format before processing
    if (!isValidTimeFormat(nextStartTime)) {
      console.error("Invalid start time format:", nextStartTime);
      return; // Exit if the time format is invalid
    }
  
    // Calculate end time for the new period
    const newEndTime = calculateEndTime(nextStartTime, intervalInMinutes);
  
    // Create new entry for the period
    const newEntry = {
      period: entries.length + 1,
      teacherId: "",
      subjectId: "",
      startTime: nextStartTime,
      endTime: newEndTime,
    };
  
    // Check if a lunch break should be added after the specified period
    if (lunchBreakAfterPeriodInt && (entries.length + 1) === lunchBreakAfterPeriodInt) {
      // Add a lunch break entry after the specified period
      const lunchBreakEntry = {
        period: "Lunch Break",
        teacherId: "",
        subjectId: "",
        startTime: newEndTime,
        endTime: calculateEndTime(newEndTime, lunchBreakInMinutes), // Set lunch break end time
      };
  
      setEntries((prevEntries) => [...prevEntries, newEntry, lunchBreakEntry]);
    } else {
      setEntries((prevEntries) => [...prevEntries, newEntry]);
    }
  };
  

  const isValidTimeFormat = (time) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:mm format
    return regex.test(time);
  };

  const calculateEndTime = (startTime, interval) => {
    if (!isValidTimeFormat(startTime)) {
      console.error("Invalid start time format:", startTime);
      return ""; // Return empty string for invalid format
    }

    const start = new Date(`1970-01-01T${startTime}:00`);
    start.setMinutes(start.getMinutes() + interval);
    return start.toTimeString().slice(0, 5); // Format to HH:mm
  };

  const handleEntryChange = (index, field, value) => {
    const updatedEntries = entries.map((entry, i) => {
      if (i === index) {
        return { ...entry, [field]: value };
      }
      return entry;
    });
    setEntries(updatedEntries);
  };

  const handleSubmit = () => {
    const timetable = {
      classId,
      subjectGroupId,
      dayOfWeek,
      classInterval,
      periodStartTiming,
      lunchBreak,
      lunchBreakAfterPeriod,
      entries,
    };
    console.log("Submitted Timetable:", timetable);
    // Submit timetable to backend (API call)
  };

  return (
    <div className="mx-auto">
      <h2 className="text-xl text-[#7367F0] font-bold mb-6 text-left ">Create Class Timetable</h2>

      {/* Dynamic Filter Bar */}
      <DynamicFilterBar2 
        filters={[
          {
            name: 'classId',
            type: 'select',
            placeholder: 'Select Class',
            options: [
              { value: 'class1', label: 'Class 1' },
              { value: 'class2', label: 'Class 2' },
            ],
          },
          {
            name: 'subjectGroupId',
            type: 'select',
            placeholder: 'Select Subject Group',
            options: [
              { value: 'group1', label: 'Group 1' },
              { value: 'group2', label: 'Group 2' },
            ],
          },
          {
            name: 'dayOfWeek',
            type: 'select',
            placeholder: 'Select Day',
            options: [
              { value: 'monday', label: 'Monday' },
              { value: 'tuesday', label: 'Tuesday' },
              // Add other days as needed
            ],
          },
          {
            name: 'classInterval',
            type: 'select',
            placeholder: 'Select Interval Duration Between Classes (minutes)',
            options: [
              { value: '5', label: '5 minutes' },
              { value: '10', label: '10 minutes' },
              { value: '15', label: '15 minutes' },
              { value: '30', label: '30 minutes' },
              { value: '45', label: '45 minutes' },
              { value: '60', label: '60 minutes' },
            ],
          },
          {
            name: 'periodStartTiming',
            type: 'time',
            placeholder: 'Period Start Timing',
          },
          {
            name: 'periodRunningTime',
            type: 'select',
            placeholder: 'Select Period Running Time (minutes)',
            options: [
              { value: '5', label: '5 minutes' },
              { value: '10', label: '10 minutes' },
              { value: '15', label: '15 minutes' },
              { value: '30', label: '30 minutes' },
              { value: '45', label: '45 minutes' },
              { value: '60', label: '60 minutes' },
            ],
          },
          {
            name: 'lunchBreak',
            type: 'select',
            placeholder: 'Select Lunch Break Duration (minutes)',
            options: [
              { value: '15', label: '15 minutes' },
              { value: '30', label: '30 minutes' },
              { value: '45', label: '45 minutes' },
              { value: '60', label: '60 minutes' },
            ],
          },
          {
            name: 'lunchBreakAfterPeriod',
            type: 'select',
            placeholder: "Select Lunch Break After Period",
            options: [
              { value: '1', label: 'After 1st Period' },
              { value: '2', label: 'After 2nd Period' },
              { value: '3', label: 'After 3rd Period' },
              { value: '4', label: 'After 4th Period' },
              { value: '5', label: 'After 5th Period' },
              { value: '6', label: 'After 6th Period' },
              { value: '7', label: 'After 7th Period' },
              { value: '8', label: 'After 8th Period' },
              { value: '9', label: 'After 9th Period' },
              { value: '10', label: 'After 10th Period' },
            ],
          },
        ]}
        onSubmit={({ classId, subjectGroupId, dayOfWeek, classInterval, periodStartTiming, lunchBreak, lunchBreakAfterPeriod }) => {
          setClassId(classId);
          setSubjectGroupId(subjectGroupId);
          setDayOfWeek(dayOfWeek);
          setClassInterval(classInterval);
          setPeriodStartTiming(periodStartTiming);
          setLunchBreak(lunchBreak);
          setLunchBreakAfterPeriod(lunchBreakAfterPeriod);
        }}
      />

      {/* Timetable Entries */}
      {entries.map((entry, index) => (
        <div key={index} className="p-4 rounded-lg border border-gray-300 mb-4">
          <h4 className="text-md text-left font-bold mb-2">{entry.period === "Lunch Break" ? "Lunch Break" : `Period ${entry.period}`}</h4>
          <FormSection>
            <SearchableSelect
              placeholder="Select Teacher"
              options={[
                { value: 'teacher1', label: 'Teacher 1' },
                { value: 'teacher2', label: 'Teacher 2' },
              ]}
              onChange={(value) => handleEntryChange(index, "teacherId", value)}
            />
            <SearchableSelect
              placeholder="Select Subject"
              options={[
                { value: 'subject1', label: 'Subject 1' },
                { value: 'subject2', label: 'Subject 2' },
              ]}
              onChange={(value) => handleEntryChange(index, "subjectId", value)}
            />
            <TimeInput
              label="Start Time"
              value={entry.startTime}
              onChange={(value) => handleEntryChange(index, "startTime", value)}
              isEditable={false} // Make this field read-only
            />
            <TimeInput
              label="End Time"
              value={entry.endTime}
              onChange={(value) => handleEntryChange(index, "endTime", value)}
              isEditable={false} // Make this field read-only
            />
          </FormSection>
        </div>
      ))}

      {/* Add Period Button */}
      <FormButton onClick={handleAddPeriod}>Add Period</FormButton>

      {/* Submit Button */}
      <FormButton onClick={handleSubmit}>Submit Timetable</FormButton>
    </div>
  );
};

export default CreateTimetable;
