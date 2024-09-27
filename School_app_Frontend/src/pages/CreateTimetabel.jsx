import React, { useEffect, useState } from "react";
import FormSection from "../components/Form/FormSection";
import SearchableSelect from "../components/Form/Select";
import TimeInput from "../common/TimeInput/TimeInput";
import FormButton from "../components/Form/FormButton";
import DynamicFilterBar2 from "../common/FilterBar/SelectDropDownFilterTimeTable";
import axios from "axios";

const CreateTimetable = () => {
  const [classId, setClassId] = useState("");
  const [subjectGroupId, setSubjectGroupId] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [classInterval, setClassInterval] = useState("30");
  const [periodRunningTime, setPeriodRunningTime] = useState("45");
  const [periodStartTiming, setPeriodStartTiming] = useState("07:00");
  const [lunchBreak, setLunchBreak] = useState("15");
  const [lunchBreakAfterPeriod, setLunchBreakAfterPeriod] = useState("2");
  const [subjectGroups, setSubjectGroups] = useState([]);
  const [entries, setEntries] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/all-class`),
        ]);

        setClasses(classesResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleClassChange = (selectedClassId) => {
    console.log("Selected Class:");
    const selectedClass = classes.find((cls) => cls._id === selectedClassId);
    setSubjectGroups(selectedClass?.subjectGroups || []);
  };

  const handleAddPeriod = () => {
    const intervalInMinutes = parseInt(classInterval);
    const periodDurationInMinutes = parseInt(periodRunningTime);
    const lunchBreakInMinutes = parseInt(lunchBreak);
    const lunchBreakAfterPeriodInt = parseInt(lunchBreakAfterPeriod);

    let nextStartTime;

    if (entries.length === 0) {
      nextStartTime = periodStartTiming;
    } else {
      const lastEntry = entries[entries.length - 1];
      nextStartTime = lastEntry.endTime;

      if (lastEntry.period !== "Lunch Break") {
        nextStartTime = calculateEndTime(nextStartTime, intervalInMinutes);
      }
    }

    if (!isValidTimeFormat(nextStartTime)) {
      console.error("Invalid start time format:", nextStartTime);
      return;
    }

    const newEndTime = calculateEndTime(nextStartTime, periodDurationInMinutes);

    const newEntry = {
      period:
        entries.filter((entry) => entry.period !== "Lunch Break").length + 1,
      teacherId: "",
      subjectId: "",
      startTime: nextStartTime,
      endTime: newEndTime,
    };

    if (
      lunchBreakAfterPeriodInt &&
      entries.filter((entry) => entry.period !== "Lunch Break").length + 1 ===
        lunchBreakAfterPeriodInt
    ) {
      const lunchBreakEntry = {
        period: "Lunch Break",
        teacherId: "",
        subjectId: "",
        startTime: newEndTime,
        endTime: calculateEndTime(newEndTime, lunchBreakInMinutes),
      };

      setEntries((prevEntries) => [...prevEntries, newEntry, lunchBreakEntry]);
    } else {
      setEntries((prevEntries) => [...prevEntries, newEntry]);
    }
  };

  const isValidTimeFormat = (time) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  };

  const calculateEndTime = (startTime, interval) => {
    if (!isValidTimeFormat(startTime)) {
      console.error("Invalid start time format:", startTime);
      return "";
    }

    const start = new Date(`1970-01-01T${startTime}:00`);
    start.setMinutes(start.getMinutes() + interval);
    return start.toTimeString().slice(0, 5);
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
      periodRunningTime,
      lunchBreak,
      lunchBreakAfterPeriod,
      entries,
    };
    console.log("Submitted Timetable:", timetable);
    // Submit timetable to backend (API call)
    // Example: axios.post('/api/timetables', timetable)
  };

  const filterConfig = [
    {
      name: "class",
      label: "Select Class",
      placeholder: "Select Class",
      required: true,
      type: "select",
      options: classes.map((classItem) => ({ label: classItem?.name, value: classItem?._id })),
      onChange: handleClassChange,
    },
    {
      name: "subjectGroup",
      label: "Select Subject Group",
      placeholder: "Select Subject Group",
      required: true,
      type: "select",
      options: subjectGroups.map((group) => ({ label: group?.name, value: group?._id })),
    },
    {
      name: "dayOfWeek",
      type: "select",
      placeholder: "Select Day",
      options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => ({
        value: day.toLowerCase(),
        label: day,
      })),
    },
    {
      name: "classInterval",
      type: "select",
      placeholder: "Select Interval Duration Between Classes (minutes)",
      options: [
        { value: "0", label: "No interval between periods" },
        { value: "5", label: "5 minutes" },
        { value: "10", label: "10 minutes" },
        { value: "15", label: "15 minutes" },
        { value: "30", label: "30 minutes" },
        { value: "35", label: "35 minutes" },
        { value: "40", label: "40 minutes" },
        { value: "45", label: "45 minutes" },
        { value: "50", label: "50 minutes" },
        { value: "55", label: "55 minutes" },
        { value: "60", label: "60 minutes" },
        { value: "65", label: "65 minutes" },
        { value: "70", label: "70 minutes" },
        { value: "75", label: "75 minutes" },
        { value: "80", label: "80 minutes" },
        { value: "85", label: "85 minutes" },
        { value: "90", label: "90 minutes" },
        { value: "95", label: "95 minutes" },
        { value: "100", label: "100 minutes" },
        { value: "105", label: "105 minutes" },
        { value: "110", label: "110 minutes" },
        { value: "115", label: "115 minutes" },
        { value: "120", label: "120 minutes" },
      ],
    },
    {
      name: "periodStartTiming",
      type: "time",
      placeholder: "Period Start Timing",
    },
    {
      name: "periodRunningTime",
      type: "select",
      placeholder: "Select Period Running Time (minutes)",
      options: [
        { value: "0", label: "No interval between periods" },
        { value: "5", label: "5 minutes" },
        { value: "10", label: "10 minutes" },
        { value: "15", label: "15 minutes" },
        { value: "30", label: "30 minutes" },
        { value: "35", label: "35 minutes" },
        { value: "40", label: "40 minutes" },
        { value: "45", label: "45 minutes" },
        { value: "50", label: "50 minutes" },
        { value: "55", label: "55 minutes" },
        { value: "60", label: "60 minutes" },
        { value: "65", label: "65 minutes" },
        { value: "70", label: "70 minutes" },
        { value: "75", label: "75 minutes" },
        { value: "80", label: "80 minutes" },
        { value: "85", label: "85 minutes" },
        { value: "90", label: "90 minutes" },
        { value: "95", label: "95 minutes" },
        { value: "100", label: "100 minutes" },
        { value: "105", label: "105 minutes" },
        { value: "110", label: "110 minutes" },
        { value: "115", label: "115 minutes" },
        { value: "120", label: "120 minutes" },
      ],
    },
    {
      name: "lunchBreak",
      type: "select",
      placeholder: "Select Lunch Break Duration (minutes)",
      options: [
        { value: "0", label: "No Lunch Break" },
        { value: "5", label: "5 minutes" },
        { value: "10", label: "10 minutes" },
        { value: "15", label: "15 minutes" },
        { value: "20", label: "20 minutes" },
        { value: "25", label: "25 minutes" },
        { value: "30", label: "30 minutes" },
        { value: "45", label: "45 minutes" },
        { value: "60", label: "60 minutes" },
      ],
    },
    {
      name: "lunchBreakAfterPeriod",
      type: "select",
      placeholder: "Select Lunch Break After Period",
      options: [
        { value: "1", label: "After 1st Period" },
        { value: "2", label: "After 2nd Period" },
        { value: "3", label: "After 3rd Period" },
        { value: "4", label: "After 4th Period" },
        { value: "5", label: "After 5th Period" },
        { value: "6", label: "After 6th Period" },
      ],
    },
  ];

  return (
    <div className="mx-auto">
      <h2 className="text-xl text-[#7367F0] font-bold mb-6 text-left">
        Create Class Timetable
      </h2>

      <DynamicFilterBar2
        filters={filterConfig}
        onSubmit={({
          classId,
          subjectGroupId,
          dayOfWeek,
          classInterval,
          periodStartTiming,
          periodRunningTime,
          lunchBreak,
          lunchBreakAfterPeriod,
        }) => {
          setClassId(classId);
          setSubjectGroupId(subjectGroupId);
          setDayOfWeek(dayOfWeek);
          setClassInterval(classInterval);
          setPeriodStartTiming(periodStartTiming);
          setPeriodRunningTime(periodRunningTime);
          setLunchBreak(lunchBreak);
          setLunchBreakAfterPeriod(lunchBreakAfterPeriod);
        }}
      />

      {/* Timetable Entries */}
      {entries.map((entry, index) => (
        <div
          key={index}
          className="p-4 rounded-lg border border-[#7367F0] mb-4"
        >
          <h4 className="text-md text-left font-bold mb-2">
            {entry.period === "Lunch Break"
              ? "Lunch Break"
              : `Period ${entry.period}`}
          </h4>
          <FormSection>
            <SearchableSelect
              placeholder="Select Teacher"
              options={[
                { value: "teacher1", label: "Teacher 1" },
                { value: "teacher2", label: "Teacher 2" },
              ]}
              onChange={(value) => handleEntryChange(index, "teacherId", value)}
            />
            <SearchableSelect
              placeholder="Select Subject"
              options={[
                { value: "subject1", label: "Subject 1" },
                { value: "subject2", label: "Subject 2" },
              ]}
              onChange={(value) => handleEntryChange(index, "subjectId", value)}
            />
            <TimeInput
              value={entry.startTime}
              onChange={(value) => handleEntryChange(index, "startTime", value)}
              placeholder="Start Time"
            />
            <TimeInput value={entry.endTime} readOnly placeholder="End Time" />
          </FormSection>
        </div>
      ))}

      <FormButton onClick={handleAddPeriod} text="Add Period" />
      <FormButton onClick={handleSubmit} text="Submit Timetable" />
    </div>
  );
};

export default CreateTimetable;
