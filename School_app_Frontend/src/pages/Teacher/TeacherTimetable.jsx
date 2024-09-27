import { useState, useEffect } from "react";
import DynamicFilterBar from "../../common/FilterBar/DynamicFilterBar";
import { getAPI } from "../../utility/api/apiCall";
import axios from "axios";

const TeacherTimetable = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        await getAPI("getAllTeachers", {}, setTeachers);
      } catch (error) {
        console.error("Error fetching teachers", error);
      }
    };

    fetchTeachers();
  }, []);

  const handleTeacherChange = (teacherId) => {
    setSelectedTeacher(teacherId);
    setShowTable(false);
  };

  const handleSubmit = async (formData) => {
    const teacherId = formData.teacher;
    setSelectedTeacher(teacherId);
    console.log("Selected teacher:", selectedTeacher);

    if (teacherId) {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/get-teacher-timetable/${teacherId}`
        );
        setTimetable(response.data.data); // Set timetable from response
        console.log(response.data);
        console.log("Timetable data:", response.data.data);
        setShowTable(true);
      } catch (error) {
        console.error("Error fetching timetable", error);
      }
    }
  };

  const filterConfig = [
    {
      name: "teacher",
      label: "Select Teacher",
      placeholder: "Select Teacher",
      required: true,
      type: "select",
      options: teachers.map((teacherItem) => ({
        label: teacherItem.name,
        value: teacherItem._id,
      })),
      onChange: handleTeacherChange,
    },
  ];

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <>
      {/* Filter Bar */}
      <DynamicFilterBar filters={filterConfig} onSubmit={handleSubmit} />

      {/* Timetable Section */}
      <div className="mt-6">
        {showTable ? (
          <div className="flex flex-wrap gap-8">
            {daysOfWeek.map((day) => {
              const dayData = timetable.find((item) => item._id === day); // Get the correct day's data
              const subjects = dayData ? dayData.periods : []; // Access periods for the specific day

              return (
                <div key={day} className="flex-1">
                  {/* Day heading */}
                  <h2 className="text-xl font-bold mb-4 text-center">{day}</h2>
                  <div className="flex flex-col gap-4">
                    {subjects.length > 0 ? (
                      subjects.map((subjectData, index) => (
                        <div
                          key={index}
                          className="border border-gray-300 p-4 rounded-md bg-[#203046] text-white"
                        >
                          <h3 className="font-bold text-lg">
                            {subjectData.className}
                          </h3>
                          <p className="text-sm">{subjectData.period}</p>
                          <p className="text-sm">{subjectData.subject}</p>
                          <p className="text-sm">{`${new Date(
                            subjectData.startTime
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} - ${new Date(
                            subjectData.endTime
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-400">
                        No classes scheduled.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-red-500">
            {selectedTeacher
              ? ""
              : "Please select a teacher to view the timetable."}
          </p>
        )}
      </div>
    </>
  );
};

export default TeacherTimetable;
