import React, { useEffect, useState } from "react";
import NoticeShowingBlock from "../../common/DataBlock/NoticeShowingBlock";
import { getAPI } from "../../utility/api/apiCall";

const ViewNotice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await getAPI("getAllNotice", {}, setNotices);
        console.log(response.data);
        setNotices(response.data);
      } catch (error) {
        setError("Error fetching data.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  if (loading) {
    return <div>Loading notices...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <NoticeShowingBlock notices={notices} />
    </div>
  );
};

export default ViewNotice;
