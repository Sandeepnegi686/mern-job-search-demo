import { useAppContext } from "../../context/appContext";
import Alert from "../../components/Alert";
import Wrapper from "../../assets/wrappers/Job";
import FormRow from "../../components/FormRow";
import FormRowSelect from "../../components/FormRowSelect";

function AddJob() {
  const {
    isEditing,
    showAlert,
    clearAlert,
    displayAlert,
    isLoading,
    position,
    company,
    jobLocation,
    jobType,
    jobTypeOptions,
    jobStatus,
    statusOptions,
    handleChange,
    handleClear,
    createJob,
    editJob,
  } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!position || !company || !jobLocation) {
      displayAlert();
      clearAlert();
      return;
    }
    if (isEditing) {
      //Editing job
      editJob();
      return;
    }
    createJob();
  };
  const handleJobInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    handleChange({ name, value });
  };

  return (
    <Wrapper>
      <form className="form">
        <h3>{isEditing ? "edit job" : "add job"}</h3>
        {showAlert && <Alert />}

        {/* position */}
        <div className="form-center">
          <FormRow
            type="text"
            name="position"
            value={position}
            handleChange={handleJobInput}
          />
          {/* company */}
          <FormRow
            type="text"
            name="company"
            value={company}
            handleChange={handleJobInput}
          />
          {/* location */}
          <FormRow
            type="text"
            labelText="location"
            name="jobLocation"
            value={jobLocation}
            handleChange={handleJobInput}
          />

          {/* job status */}
          <FormRowSelect
            name="jobStatus"
            label="Job Status"
            value={jobStatus}
            list={statusOptions}
            handleChange={handleJobInput}
          />
          {/* job type */}
          <FormRowSelect
            label="Job Type"
            name="jobType"
            value={jobType}
            list={jobTypeOptions}
            handleChange={handleJobInput}
          />

          {/* submit button */}
          <div className="btn-container">
            <button
              className="btn btn-block submit-btn"
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              submit
            </button>
            <button
              className="btn btn-block clear-btn"
              onClick={(e) => {
                e.preventDefault();
                handleClear();
              }}
            >
              clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
}

export default AddJob;
