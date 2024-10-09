import logo from "../../assets/logo.png";

const StudentAdmitCard = ({ student, commonInfo }) => {
  const { schoolName, schoolLogo, term, examType, examDetails,standard } = commonInfo;

  return (
    <div
      className="max-w-3xl mx-auto p-8 border border-gray-300 shadow-xl bg-white mb-12"
    >
      {/* School Header */}
      <div className="text-center mb-6">
        <div className="flex justify-start gap-10 items-center mb-4">
          <img
            src={logo} // fallback to local logo if API logo is unavailable
            alt="School Logo"
            className="w-20 h-20 mr-4"
          />
          <div>
            <h1 className="text-4xl font-bold text-blue-800">
              {schoolName || "Vardhan International School"}
            </h1>
            <p className="text-sm text-gray-600">
              Plot No. 30, Nibiya Lathiya, Bypass, Varanasi, Uttar Pradesh 221011
            </p>
            <p className="text-sm text-gray-600">Phone: 123-456-7890</p>
          </div>
        </div>
      </div>

      {/* Admit Card Title */}
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800">
          {examType} Admit Card - {term}
        </h2>
      </div>

      {/* Student Details Section */}
      <div className="flex justify-between mb-8">
        {/* Left: Student Info */}
        <div>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Name:</span> {student.studentName}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Roll No:</span> {student.rollNumber}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Class:</span> {standard}
          </p>
        </div>

        {/* Right: Student Photo */}
        <div className="w-24 h-24 border border-gray-300">
          <img
            src={student.studentPhoto}
            alt={`${student.studentName}`}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Exams Table */}
      <div className="overflow-x-auto mb-12">
        <table className="min-w-full table-auto border-collapse border border-gray-400">
          <thead>
            <tr className="bg-blue-200 text-gray-900">
              <th className="border border-gray-300 px-4 py-2 text-left">Subject</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Exam Date</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Start Time</th>
              <th className="border border-gray-300 px-4 py-2 text-left">End Time</th>
            </tr>
          </thead>
          <tbody>
            {examDetails.map((exam, index) => (
              <tr key={index} className="hover:bg-gray-50 text-gray-700">
                <td className="border border-gray-300 px-4 py-2">{exam.subject}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(exam.examDate).toLocaleDateString('en-GB')}
                </td>
                <td className="border border-gray-300 px-4 py-2">{exam.startTime}</td>
                <td className="border border-gray-300 px-4 py-2">{exam.endTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Signature Section */}
      <div className="mt-12 flex justify-end">
        <div className="text-center">
          <p className="font-semibold text-gray-700">Signature of Principal</p>
          <p className="mt-4 text-gray-700">_________________________</p>
        </div>
      </div>
    </div>
  );
};

  
const AdmitCardList = ({ students, commonInfo }) => {
  return (
    <div>
      {students?.map((student, index) => (
        <StudentAdmitCard
          key={index}
          student={student}
          commonInfo={commonInfo}
        />
      ))}
    </div>
  );
};

export default AdmitCardList;
