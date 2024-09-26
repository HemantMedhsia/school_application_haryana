import { useEffect, useState } from "react";
import DynamicFilterBar from "../common/FilterBar/DynamicFilterBar";
import { getAPI } from "../utility/api/apiCall";
import axios from "axios";

const scheduleData = {
  "Class 1": {
    Monday: [
      {
        subject: "HINDI (HIN)",
        time: "8:20 AM - 9:05 AM",
        teacher: "Shivani Singh (VIS/010)",
        room: "Room No: 1",
      },
      {
        subject: "HINDI (HIN)",
        time: "8:20 AM - 9:05 AM",
        teacher: "Shivani Singh (VIS/010)",
        room: "Room No: 1",
      },
      {
        subject: "HINDI (HIN)",
        time: "8:20 AM - 9:05 AM",
        teacher: "Shivani Singh (VIS/010)",
        room: "Room No: 1",
      },
      {
        subject: "HINDI (HIN)",
        time: "8:20 AM - 9:05 AM",
        teacher: "Shivani Singh (VIS/010)",
        room: "Room No: 1",
      },
    ],
    Tuesday: [
      {
        subject: "MATHEMATICS (MATH)",
        time: "9:05 AM - 9:50 AM",
        teacher: "Jamuna Prasad Maurya (VIS/05)",
        room: "Room No: 1",
      },
      {
        subject: "MATHEMATICS (MATH)",
        time: "9:05 AM - 9:50 AM",
        teacher: "Jamuna Prasad Maurya (VIS/05)",
        room: "Room No: 1",
      },
      {
        subject: "MATHEMATICS (MATH)",
        time: "9:05 AM - 9:50 AM",
        teacher: "Jamuna Prasad Maurya (VIS/05)",
        room: "Room No: 1",
      },
    ],
    Wednesday: [
      {
        subject: "HINDI (HIN)",
        time: "8:20 AM - 9:05 AM",
        teacher: "Shivani Singh (VIS/010)",
        room: "Room No: 1",
      },
      {
        subject: "HINDI (HIN)",
        time: "8:20 AM - 9:05 AM",
        teacher: "Shivani Singh (VIS/010)",
        room: "Room No: 1",
      },
      {
        subject: "HINDI (HIN)",
        time: "8:20 AM - 9:05 AM",
        teacher: "Shivani Singh (VIS/010)",
        room: "Room No: 1",
      },
      {
        subject: "HINDI (HIN)",
        time: "8:20 AM - 9:05 AM",
        teacher: "Shivani Singh (VIS/010)",
        room: "Room No: 1",
      },
    ],
    Thursday: [
      {
        subject: "HINDI (HIN)",
        time: "8:20 AM - 9:05 AM",
        teacher: "Shivani Singh (VIS/010)",
        room: "Room No: 1",
      },
      {
        subject: "HINDI (HIN)",
        time: "8:20 AM - 9:05 AM",
        teacher: "Shivani Singh (VIS/010)",
        room: "Room No: 1",
      },
      {
        subject: "HINDI (HIN)",
        time: "8:20 AM - 9:05 AM",
        teacher: "Shivani Singh (VIS/010)",
        room: "Room No: 1",
      },
      {
        subject: "HINDI (HIN)",
        time: "8:20 AM - 9:05 AM",
        teacher: "Shivani Singh (VIS/010)",
        room: "Room No: 1",
      },
    ],
    Friday: [
      {
        subject: "HINDI (HIN)",
        time: "8:20 AM - 9:05 AM",
        teacher: "Shivani Singh (VIS/010)",
        room: "Room No: 1",
      },
      {
        subject: "HINDI (HIN)",
        time: "8:20 AM - 9:05 AM",
        teacher: "Shivani Singh (VIS/010)",
        room: "Room No: 1",
      },
      {
        subject: "HINDI (HIN)",
        time: "8:20 AM - 9:05 AM",
        teacher: "Shivani Singh (VIS/010)",
        room: "Room No: 1",
      },
      {
        subject: "HINDI (HIN)",
        time: "8:20 AM - 9:05 AM",
        teacher: "Shivani Singh (VIS/010)",
        room: "Room No: 1",
      },
    ],
    Saturday: [
      {
        subject: "HINDI (HIN)",
        time: "8:20 AM - 9:05 AM",
        teacher: "Shivani Singh (VIS/010)",
        room: "Room No: 1",
      },
      {
        subject: "HINDI (HIN)",
        time: "8:20 AM - 9:05 AM",
        teacher: "Shivani Singh (VIS/010)",
        room: "Room No: 1",
      },
      {
        subject: "HINDI (HIN)",
        time: "8:20 AM - 9:05 AM",
        teacher: "Shivani Singh (VIS/010)",
        room: "Room No: 1",
      },
      {
        subject: "HINDI (HIN)",
        time: "8:20 AM - 9:05 AM",
        teacher: "Shivani Singh (VIS/010)",
        room: "Room No: 1",
      },
    ],
  },
  "Class 2": {
    Wednesday: [
      {
        subject: "ENGLISH (ENG)",
        time: "10:00 AM - 10:45 AM",
        teacher: "Rahul Sharma (VIS/02)",
        room: "Room No: 2",
      },
    ],
  },
};
  
const ClassTimetable = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [timetable, setTimetable] = useState(null);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        await getAPI("getAllClasses", {}, setClasses);
      } catch (error) {
        console.error("Error fetching classes", error);
      }

      // Mock data
      // const mockClasses = [
      //   { name: "Class 1" },
      //   { name: "Class 2" },
      //   { name: "Class 3" },
      // ];

      // setClasses(mockClasses);
    };

    fetchClasses();
  }, []);

  const handleClassChange = (selectedClass) => {
    setSelectedClass(selectedClass);
    setShowTable(false); // Reset the table view when the class changes
  };

  const handleFilterSubmit = (filterData) => {
    const selectedClassName = filterData.class;
    const timetableData = scheduleData[selectedClassName];
    console.log("Timetable data:", timetableData);
    console.log("Selected class:", selectedClassName);
    console.log("filterData:", filterData);

    if (timetableData) {
      setTimetable(timetableData);
      setShowTable(true);
    } else {
      setTimetable(null);
      setShowTable(false);
    }
  };

  const filterConfig = [
    {
      name: "class",
      label: "Select Class",
      placeholder: "Select Class",
      required: true,
      type: "select",
      options: classes.map((classItem) => ({
        label: classItem.name,
        value: classItem.name, 
      })),
      onChange: handleClassChange,
    },
  ];

  return (
    <>
      {/* Filter Bar */}
      <DynamicFilterBar filters={filterConfig} onSubmit={handleFilterSubmit} />

      {/* Timetable Section */}
      <div className="mt-6">
        {showTable ? (
          <div className="flex flex-wrap gap-8">
            {Object.entries(timetable).map(([day, subjects], dayIndex) => (
              <div key={dayIndex} className="flex-1">
                {/* Day heading */}
                <h2 className="text-xl font-bold mb-4 text-center">{day}</h2>
                <div className="flex flex-col gap-4">
                  {subjects.map((subjectData, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 p-4 rounded-md bg-[#203046] text-white"
                    >
                      <h3 className="font-bold text-lg">
                        {subjectData.subject}
                      </h3>
                      <p className="text-sm">{subjectData.time}</p>
                      <p className="text-sm">{subjectData.teacher}</p>
                      <p className="text-sm">{subjectData.room}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-red-500">
            {selectedClass
              ? "No timetable available for this class."
              : "Please select a class to view the timetable."}
          </p>
        )}
      </div>
    </>
  );
};

export default ClassTimetable;
