import Wrapper from "../assets/wrappers/SearchContainer";
import FormRow from "./FormRow";
import FormRowSelect from "./FormRowSelect";
import { useAppContext } from "../context/appContext";
import { useMemo, useState } from "react";

const SearchContainer = () => {
  const {
    isLoading,
    searchStatus,
    searchType,
    sort,
    sortOptions,
    jobTypeOptions,
    statusOptions,
    handleChange,
    clearFilters,
  } = useAppContext();

  function handleSearch(e) {
    if (isLoading) return;
    const name = e.target.name;
    const value = e.target.value;
    handleChange({ name, value });
  }

  const [localSearch, setLocalSearch] = useState("");

  function debounce() {
    let timeOutId;
    return (e) => {
      setLocalSearch(e.target.value);
      clearTimeout(timeOutId);
      timeOutId = setTimeout(function () {
        handleChange({ name: e.target.name, value: e.target.value });
      }, 1000);
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    clearFilters();
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const optimizedDebounce = useMemo(() => debounce(), []);

  return (
    <Wrapper>
      <form className="form">
        <h4>Search Jobs</h4>
        <div className="form-center">
          <FormRow
            name="search"
            type="text"
            value={localSearch}
            handleChange={optimizedDebounce}
          />
          <FormRowSelect
            name={"searchStatus"}
            label={"Search Status"}
            value={searchStatus}
            handleChange={handleSearch}
            list={["all", ...statusOptions]}
          />
          <FormRowSelect
            name={"searchType"}
            label={"Search Type"}
            value={searchType}
            handleChange={handleSearch}
            list={["all", ...jobTypeOptions]}
          />
          <FormRowSelect
            name={"sort"}
            label={"Sort Jobs"}
            value={sort}
            handleChange={handleSearch}
            list={sortOptions}
          />
          <button
            type="submit"
            className="btn btn-block btn-danger"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            Clear Filters
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default SearchContainer;
