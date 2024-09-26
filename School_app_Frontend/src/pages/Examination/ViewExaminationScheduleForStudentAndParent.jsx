import React, { useEffect, useState } from "react";
import Datatable from "../../common/Datatables/Datatable";
import Modal from "../../common/Modal/ExamScheduleView"; // Import the modal component
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const ViewExaminationScheduleForStudentAndParent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState({});
  const [data, setData] = useState([]);

  const columns = [
    { header: "Serial No.", accessor: "serial", type: "text" },
    { header: "Exam Type", accessor: "examType", type: "text" },
  ];

  const examNotes = [
    "Arrive at the examination hall at least 30 minutes before the start time.",
    "Bring your student ID and admit card to the examination hall.",
    "Electronic devices such as phones and smartwatches are not allowed.",
    "Ensure that you have all the necessary stationery, including pens, pencils, and erasers.",
    "Follow the instructions of the invigilators during the exam.",
  ];
  
  useEffect(() => {
    let decodeTokenRole;
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
        if (token) {
             decodeTokenRole = jwtDecode(token).role;
        }
        else {
            console.error("Token not found");
            return;
        }

        let endPoint;
        if (decodeTokenRole === "Student") {
            endPoint = "get-examschedule-bystudent";
        }
        else if (decodeTokenRole === "Parent") {
            endPoint = "get-examschedule-byparent";
        }
        else {
            console.error("Invalid role");
        }
      const apiResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/${endPoint}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Exam schedule data:", apiResponse);

      setData(apiResponse.data.data);
    };

    fetchData();
  }, []);

  const handleView = (rowData) => {
    setSelectedExam(rowData); // Set the selected exam details
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-[#7367F0] mb-4 text-xl font-semibold">
          View Examination Schedule
        </h2>

        <Datatable
          columns={columns}
          data={data}
          actions={{
            onView: handleView,
          }}
        />

        <div className=" p-4 rounded-md mb-6">
          <h3 className="text-lg font-medium text-[#7367F0] mb-2">
            Important Notes:
          </h3>
          <ul className="list-disc list-inside leading-loose tracking-wide text-[#65FA9E]">
            {examNotes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal for viewing exam details */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        examDetails={selectedExam}
      />
    </div>
  );
};

export default ViewExaminationScheduleForStudentAndParent;
