import React, { useEffect, useState } from "react";
import Datatable from "../../common/Datatables/Datatable";
import Modal from "../../common/Modal/ExamScheduleView"; // Import the modal component

const ViewExaminationScheduleForStudentAndParent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState({});
  const [data, setData] = useState([]);

  const columns = [
    { header: "Serial No.", accessor: "Sno", type: "text" },
    { header: "Exam Type", accessor: "examType", type: "text" },
  ];

  const examNotes = [
    "Arrive at the examination hall at least 30 minutes before the start time.",
    "Bring your student ID and admit card to the examination hall.",
    "Electronic devices such as phones and smartwatches are not allowed.",
    "Ensure that you have all the necessary stationery, including pens, pencils, and erasers.",
    "Follow the instructions of the invigilators during the exam.",
  ];

  // Sample data including multiple subjects for each exam
  // Fetch data from the API
  useEffect(() => {
    // Simulating API call
    const fetchData = async () => {
      const apiResponse = {
        statusCode: 200,
        data: [
          {
            serial: 1,
            examType: "Half Yearly",
            examDetails: [
              {
                subject: "Science 101",
                examDate: "2024-01-01T00:00:00.000Z",
                startTime: "10:20",
                endTime: "12:20",
                _id: "66f3be82d1659ff2650d8765",
              },
              {
                subject: "Hindi",
                examDate: "2024-01-02T00:00:00.000Z",
                startTime: "10:20",
                endTime: "12:20",
                _id: "66f3be82d1659ff2650d8766",
              },
              {
                subject: "History",
                examDate: "2024-01-03T00:00:00.000Z",
                startTime: "10:20",
                endTime: "12:20",
                _id: "66f3be82d1659ff2650d8767",
              },
            ],
          },
          {
            serial: 2,
            examType: "Unit Test",
            examDetails: [
              {
                subject: "Science 101",
                examDate: "2024-01-01T00:00:00.000Z",
                startTime: "08:20",
                endTime: "10:20",
                _id: "66f3c0742e1a7cf2911b6c8e",
              },
              {
                subject: "Hindi",
                examDate: "2024-01-01T00:00:00.000Z",
                startTime: "08:20",
                endTime: "10:20",
                _id: "66f3c0742e1a7cf2911b6c8f",
              },
            ],
          },
        ],
        message: "Exam Schedules fetched successfully",
        success: true,
      };

      setData(apiResponse.data);
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
