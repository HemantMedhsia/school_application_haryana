import React, { useEffect, useState } from "react";
import StudentTimeTable from "../../components/StudentDashBoard/StudentTimeTable";
import NoticeShowingBlock from "../../common/DataBlock/NoticeShowingBlock";
import { getAPI } from "../../utility/api/apiCall";

const TeacherDashboard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await getAPI("getAllNotices", {}, setNotices);
      console.log(response.data);
      setNotices(response.data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  if (loading) {
    return (
      <div className="loader-wrapper">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="flex justify-between w-full gap-6">
      <div className="w-[300px] p-2 mt-4 bg-[#283046] flex flex-col  items-center rounded-lg shadow-md">
        <StudentTimeTable />
      </div>
      <NoticeShowingBlock notices={notices} />
    </div>
  );
};

export default TeacherDashboard;
