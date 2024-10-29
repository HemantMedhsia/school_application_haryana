import React, { useEffect, useState } from "react";
import FormSection from "../components/Form/FormSection";
import SearchableSelect from "../components/Form/Select";
import TimeInput from "../common/TimeInput/TimeInput";
import FormButton from "../components/Form/FormButton";
import DynamicFilterBar2 from "../common/FilterBar/SelectDropDownFilterTimeTable";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { FaEdit } from "react-icons/fa";

const CreateTimetable = () => {
  const [classId, setClassId] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [classInterval, setClassInterval] = useState("30");
  const [periodRunningTime, setPeriodRunningTime] = useState("45");
  const [periodStartTiming, setPeriodStartTiming] = useState("07:00");
  const [lunchBreak, setLunchBreak] = useState("15");
  const [lunchBreakAfterPeriod, setLunchBreakAfterPeriod] = useState("2");
  const [subjectGroups, setSubjectGroups] = useState([]);
  const [entries, setEntries] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [data, setData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [currentDay, setCurrentDay] = useState("");
  const [loading, setLoading] = useState(false);
  const [subjectGroupId, setSubjectGroupId] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState([]);

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

  const fetchAvailableTeachers = async (dayOfWeek, periods) => {
    try {
      console.log("dayofweek", dayOfWeek, "periods", periods);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/available-teachers`,
        {
          params: {
            dayOfWeek,
            periods,
          },
        }
      );
      // setTeachers(response.data.data || []);
      return response.data.data || [];
      console.log("avl", teachers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDayOfWeekChange = (selectedDay) => {
    setCurrentDay(selectedDay);
    fetchAvailableTeachers(selectedDay, 1);
  };

  const handleClassChange = (selectedClassId) => {
    console.log("Selected Class:");
    const selectedClass = classes.find((cls) => cls._id === selectedClassId);
    setSubjectGroups(selectedClass?.subjectGroups || []);
  };

  const handleSubjectGroupChange = (selectedSubjectGroupId) => {
    const selectedSubjectGroup = subjectGroups.find(
      (group) => group._id === selectedSubjectGroupId
    );

    if (selectedSubjectGroup) {
      console.log("Selected Subject Group:", selectedSubjectGroup);

      // Set the subjects and data based on the selected subject group
      setSubjects(selectedSubjectGroup.subjects);
      setData(selectedSubjectGroup.subjects);

      // Log the subjects to verify the state has been updated
      console.log("Subjects:", selectedSubjectGroup.subjects);
    } else {
      setSubjects([]);
      setData([]);
    }
  };

  // Effect to log the current subjects state whenever it changes
  useEffect(() => {
    console.log("Current Subjects State:", subjects);
  }, [subjects]);

  // const handleAddPeriod = async () => {
  //   const intervalInMinutes = parseInt(classInterval);
  //   const periodDurationInMinutes = parseInt(periodRunningTime);
  //   const lunchBreakInMinutes = parseInt(lunchBreak);
  //   const lunchBreakAfterPeriodInt = parseInt(lunchBreakAfterPeriod);

  //   let nextStartTime;

  //   if (entries.length === 0) {
  //     nextStartTime = periodStartTiming;
  //   } else {
  //     const lastEntry = entries[entries.length - 1];
  //     nextStartTime = lastEntry.endTime;

  //     if (lastEntry.period !== "Lunch Break") {
  //       nextStartTime = calculateEndTime(nextStartTime, intervalInMinutes);
  //     }
  //   }

  //   if (!isValidTimeFormat(nextStartTime)) {
  //     console.error("Invalid start time format:", nextStartTime);
  //     return;
  //   }

  //   const newEndTime = calculateEndTime(nextStartTime, periodDurationInMinutes);
  //   const newPeriodNumber =
  //     entries.filter((entry) => entry.period !== "Lunch Break").length + 1;

  //   const newEntry = {
  //     period: newPeriodNumber,
  //     teacherId: "",
  //     subjectId: "",
  //     startTime: nextStartTime,
  //     endTime: newEndTime,
  //   };

  //   if (
  //     lunchBreakAfterPeriodInt &&
  //     entries.filter((entry) => entry.period !== "Lunch Break").length + 1 ===
  //       lunchBreakAfterPeriodInt
  //   ) {
  //     const lunchBreakEntry = {
  //       period: "Lunch Break",
  //       teacherId: "",
  //       subjectId: "",
  //       startTime: newEndTime,
  //       endTime: calculateEndTime(newEndTime, lunchBreakInMinutes),
  //     };

  //     setEntries((prevEntries) => [...prevEntries, newEntry,lunchBreakEntry]);
  //   } else {
  //     setEntries((prevEntries) => [...prevEntries, newEntry]);
  //   }
  //   console.log(
  //     "Fetching available teachers for:",
  //     currentDay,
  //     newPeriodNumber
  //   );
  //   const availableTeachers = await fetchAvailableTeachers(
  //     currentDay,
  //     newPeriodNumber
  //   );
  //   console.log("Available teachers fetched:", availableTeachers);

  //   setEntries((prevEntries) =>
  //     prevEntries.map((entry, index) =>
  //       index === prevEntries.length - 1
  //         ? { ...entry, availableTeachers }
  //         : entry
  //     )
  //   );
  // };

  const handleAddPeriod = async () => {
    const intervalInMinutes = parseInt(classInterval);
    const periodDurationInMinutes = parseInt(periodRunningTime);
    const lunchBreakInMinutes = parseInt(lunchBreak);
    const lunchBreakAfterPeriodInt = parseInt(lunchBreakAfterPeriod);

    let nextStartTime;

    // Determine the start time for the next period
    if (entries.length === 0) {
      nextStartTime = periodStartTiming;
    } else {
      const lastEntry = entries[entries.length - 1];
      nextStartTime = lastEntry.endTime;

      // Only add interval if the last period is not lunch break
      if (lastEntry.period !== "Lunch Break") {
        nextStartTime = calculateEndTime(nextStartTime, intervalInMinutes);
      }
    }

    // Validate start time format
    if (!isValidTimeFormat(nextStartTime)) {
      console.error("Invalid start time format:", nextStartTime);
      return;
    }

    const newEndTime = calculateEndTime(nextStartTime, periodDurationInMinutes);
    const newPeriodNumber =
      entries.filter((entry) => entry.period !== "Lunch Break").length + 1;

    const newEntry = {
      period: newPeriodNumber,
      teacherId: "",
      subjectId: "",
      startTime: nextStartTime,
      endTime: newEndTime,
      availableTeachers: [],
    };

    // Prepare new entries array
    let newEntries = [...entries, newEntry];

    // Fetch available teachers for the new period
    try {
      setLoading(true);
      const availableTeachers = await fetchAvailableTeachers(
        currentDay,
        newPeriodNumber
      );
      console.log("Available teachers fetched:", availableTeachers);

      newEntries[newEntries.length - 1].availableTeachers = availableTeachers;
    } catch (error) {
      console.error("Error fetching available teachers:", error);
    } finally {
      setLoading(false);
    }

    // If this period matches the lunch break schedule, add a lunch break entry
    if (
      lunchBreakAfterPeriodInt &&
      newPeriodNumber === lunchBreakAfterPeriodInt
    ) {
      const lunchBreakEntry = {
        period: "Lunch Break",
        teacherId: "",
        subjectId: "",
        startTime: newEndTime,
        endTime: calculateEndTime(newEndTime, lunchBreakInMinutes),
      };

      newEntries.push(lunchBreakEntry);
    }

    // Update the entries state with the new entries
    setEntries(newEntries);
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
        return { ...entry, [field]: value.target.value };
      }
      return entry;
    });
    setEntries(updatedEntries);
    console.log("Updated Entries:", updatedEntries);
  };

  const handleSubmit = () => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Map over entries to convert times to ISO format
    const formattedEntries = entries.map((entry) => ({
      ...entry,
      startTime: new Date(`${today}T${entry.startTime}:00Z`).toISOString(), // Combine date and time
      endTime: new Date(`${today}T${entry.endTime}:00Z`).toISOString(),
    }));

    const filteredEntries = formattedEntries.filter(
      (entry) => entry.period !== "Lunch Break"
    );

    const timetable = {
      classId,
      dayOfWeek,
      entries: filteredEntries,
    };

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/create-class-timetable`,
        timetable,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((response) => {
        toast.success("Timetable created successfully!");
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data.data &&
          error.response.data.message
        ) {
          toast.error(` ${error.response.data.data}`);
        } else {
          toast.error("Error creating timetable. Please try again.");
        }
      });
  };

  const handleDeletePeriod = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    console.log("Updated Entries after deletion:", updatedEntries);
  };

  const filterConfig = [
    {
      name: "classId",
      label: "Select Class",
      placeholder: "Select Class",
      required: true,
      type: "select",
      options: classes.map((classItem) => ({
        label: classItem?.name,
        value: classItem?._id,
      })),
      onChange: handleClassChange,
    },
    {
      name: "subjectGroup",
      label: "Select Subject Group",
      placeholder: "Select Subject Group",
      required: true,
      type: "select",
      options: subjectGroups.map((group) => ({
        label: group?.name,
        value: group?._id,
      })),
      onChange: handleSubjectGroupChange,
    },
    {
      name: "dayOfWeek",
      type: "select",
      placeholder: "Select Day",
      options: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ].map((day) => ({
        value: day,
        label: day,
      })),
      onChange: handleDayOfWeekChange,
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
      placeholder: "School / Period 1 Start Timing",
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

          toast.info(
            "Filter submitted successfully! Add period and create timetable now."
          );
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
            {entry.period !== "Lunch Break" && (
              <>
                <SearchableSelect
                  placeholder="Select Teacher"
                  value={entry.teacherId}
                  options={
                    entry.availableTeachers?.map((teacher) => ({
                      id: teacher._id,
                      name: teacher.name,
                    })) || []
                  }
                  onChange={(value) =>
                    handleEntryChange(index, "teacherId", value)
                  }
                />
                <SearchableSelect
                  labelName={""}
                  placeholder="Select Subject"
                  value={entries[index].subjectId}
                  options={subjects.map((subject) => ({
                    id: subject._id,
                    name: subject.name,
                  }))}
                  onChange={(value) =>
                    handleEntryChange(index, "subjectId", value)
                  }
                />
              </>
            )}

            <TimeInput
              value={entry.startTime}
              onChange={(value) => handleEntryChange(index, "startTime", value)}
              placeholder="Start Time"
            />
            <TimeInput value={entry.endTime} readOnly placeholder="End Time" />

            <button
              className="bg-red-500 text-white p-2 rounded-lg"
              onClick={() => handleDeletePeriod(index)}
            >
              <FaEdit size={18} color="black" />
            </button>
          </FormSection>
        </div>
      ))}

      <div className="flex gap-4">
        <FormButton onClick={handleAddPeriod} name="Add Period" />
        <FormButton onClick={handleSubmit} name="Submit Timetable" />
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default CreateTimetable;
