import { useState, useEffect } from "react";
import JobList from "./JobList";
import { getJobs } from "../graphql/queries";

function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    getJobs()
      .then((data) => setJobs(data))
      .catch((err) => setError(err));
  }, []);
  console.log(jobs);

  if (error) {
    return <h1>Oops, something went wrong</h1>;
  }
  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default JobBoard;
