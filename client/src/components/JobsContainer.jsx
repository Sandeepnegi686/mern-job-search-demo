import { useEffect } from "react";
import { useAppContext } from "../context/appContext";

import Wrapper from "../assets/wrappers/JobsContainer";
import Loading from "./Loading";
import Job from "./Job";
import PageBtnContainer from "./PageBtnContainer";

const JobsContainer = () => {
  const {
    getJob,
    isLoading,
    jobs,
    totalJobs,
    search,
    searchStatus,
    searchType,
    sort,
    page,
  } = useAppContext();

  useEffect(
    function () {
      getJob();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, search, searchStatus, searchType, sort]
  );

  if (isLoading) return <Loading center />;
  if (jobs.length === 0)
    return (
      <Wrapper>
        <h2>No Jobs found.</h2>
      </Wrapper>
    );

  return (
    <Wrapper>
      <h2>
        {totalJobs} Job{totalJobs > 1 && "s"} found.{" "}
      </h2>
      <div className="jobs">
        {jobs.map((job) => (
          <Job key={job._id} {...job} />
        ))}
      </div>
      <PageBtnContainer />
    </Wrapper>
  );
};

export default JobsContainer;
