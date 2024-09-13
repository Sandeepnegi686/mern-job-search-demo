import { createContext, useContext, useReducer } from "react";
import { reducer } from "./reducer";
import {
  initialState,
  CLEAR_ALERT,
  DISPLAY_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  HANDLE_CLEAR,
  CREATE_JOB_BEGIN,
  CREATE_JOB_ERROR,
  CREATE_JOB_SUCCESS,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
} from "./action";
import axios from "axios";

const serverURL = import.meta.env.VITE_SERVER_URL;
const appContext = createContext();

// eslint-disable-next-line react/prop-types
function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const authFetch = axios.create({
    baseURL: `${serverURL}/api/v1/`,
    headers: { Authorization: `Bearer ${state.token}` },
  });

  //request
  authFetch.interceptors.request.use(
    function (config) {
      config.headers["Authorization"] = `Bearer ${state.token}`;
      return config;
    },
    function (error) {
      console.log(error);
      return Promise.reject(error);
    }
  );

  //response
  authFetch.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response.status == 400) {
        logoutUser();
        console.log(error);
      }
      return Promise.reject(error);
    }
  );

  const addUserToLocalStorage = ({ user, token, location }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("location", location);
  };

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("location");
  };

  function displayAlert() {
    dispatch({ type: DISPLAY_ALERT });
  }

  function clearAlert() {
    setTimeout(function () {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  }

  async function registerUser(currentUser) {
    dispatch({ type: REGISTER_USER_BEGIN });
    try {
      const { data } = await axios.post(
        `${serverURL}/api/v1/auth/register`,
        currentUser
      );
      const { user, token } = data;
      const location = data.user.location;
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: data,
      });
      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      dispatch({ type: REGISTER_USER_ERROR, payload: error.response.data.msg });
    }
    clearAlert();
  }

  const loginUser = async function (currentUser) {
    dispatch({ type: LOGIN_USER_BEGIN });

    try {
      const { data } = await axios.post(
        `${serverURL}/api/v1/auth/login`,
        currentUser
      );
      const { user, token } = data;
      const location = data.user.location;
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: data,
      });
      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      dispatch({ type: LOGIN_USER_ERROR, payload: error.response.data.msg });
    }
    clearAlert();
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromLocalStorage();
  };

  const updateUser = async (currentUser) => {
    try {
      dispatch({ type: UPDATE_USER_BEGIN });
      const { data } = await authFetch.patch("/auth/updateuser", currentUser);
      addUserToLocalStorage(data);
      dispatch({ type: UPDATE_USER_SUCCESS, payload: data });
    } catch (error) {
      if (error.response.status === 400) return;
      dispatch({
        type: UPDATE_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
      logoutUser();
    }
    clearAlert();
  };

  const handleChange = ({ name, value }) => {
    // console.log(name, value);
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };

  const handleClear = () => {
    dispatch({ type: HANDLE_CLEAR });
  };

  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {
      const { position, company, jobType, jobStatus, jobLocation } = state;
      await authFetch.post("jobs/create", {
        position,
        company,
        jobType,
        jobStatus,
        jobLocation,
      });
      dispatch({ type: CREATE_JOB_SUCCESS });
      dispatch({ type: HANDLE_CLEAR }); //clear all the input values in Add Job form
    } catch (error) {
      console.log(error);
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
      // if (error.response.status === 400) return;
    }
    clearAlert();
  };

  const getJob = async () => {
    dispatch({ type: GET_JOBS_BEGIN });
    const { search, searchStatus, searchType, sort, page } = state;
    let url = `jobs/getalljobs?page=${page}&jobStatus=${searchStatus}&jobType=${searchType}&sort=${sort}`;
    if (search) {
      url += `&search=${search}`;
    }
    try {
      const { data } = await authFetch.get(url);
      const { jobs, totalJobs, numOfPages } = data;
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: { jobs, totalJobs, numOfPages },
      });
    } catch (error) {
      console.log(error);
      logoutUser();
    }
    clearAlert();
  };

  const editJob = async () => {
    dispatch({ EDIT_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobStatus, jobType, editJobId } =
        state;
      await authFetch.patch(`jobs/${editJobId}`, {
        position,
        company,
        jobLocation,
        jobStatus,
        jobType,
      });
      dispatch({ type: EDIT_JOB_SUCCESS });
      dispatch({ type: HANDLE_CLEAR });
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) return;
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: id });
  };

  const deleteJob = async (jobID) => {
    dispatch({ type: DELETE_JOB_BEGIN, payload: jobID });
    try {
      await authFetch.delete(`jobs/${jobID}`);
      getJob();
    } catch (error) {
      logoutUser();
    }
  };

  const getStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      const { data } = await authFetch.get("jobs/stats");
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      logoutUser();
    }
  };

  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };

  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: page });
  };

  return (
    <appContext.Provider
      value={{
        ...state,
        displayAlert,
        clearAlert,
        registerUser,
        loginUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        handleClear,
        createJob,
        getJob,
        setEditJob,
        deleteJob,
        editJob,
        getStats,
        clearFilters,
        changePage,
      }}
    >
      {children}
    </appContext.Provider>
  );
}

export const useAppContext = () => {
  return useContext(appContext);
};

export { AppProvider };
