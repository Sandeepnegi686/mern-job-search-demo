import {
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
  initialState,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  HANDLE_CLEAR,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
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
// import { initialState } from "./action";

export function reducer(currentState, action) {
  switch (action.type) {
    case DISPLAY_ALERT:
      return {
        ...currentState,
        showAlert: true,
        alertText: "Please provide all values",
        alertType: "danger",
      };
    case CLEAR_ALERT:
      return {
        ...currentState,
        showAlert: false,
        alertText: "",
        alertType: "",
      };
    case REGISTER_USER_BEGIN:
      return { ...currentState, isLoading: true };
    case REGISTER_USER_SUCCESS:
      return {
        ...currentState,
        isLoading: false,
        user: action.payload.user,
        userLocation: action.payload.user.location,
        jobLocation: action.payload.user.location,
        token: action.payload.token,
        showAlert: true,
        alertText: "Successfull, Redirecting...",
        alertType: "success",
      };
    case REGISTER_USER_ERROR:
      return {
        ...currentState,
        isLoading: false,
        showAlert: true,
        alertText: action.payload,
        alertType: "danger",
      };
    case LOGIN_USER_BEGIN:
      return { ...currentState, isLoading: true };
    case LOGIN_USER_SUCCESS:
      return {
        ...currentState,
        isLoading: false,
        user: action.payload.user,
        userLocation: action.payload.user.location,
        jobLocation: action.payload.user.location,
        token: action.payload.token,
        showAlert: true,
        alertText: "Logged In, Redirecting...",
        alertType: "success",
      };
    case LOGIN_USER_ERROR:
      return {
        ...currentState,
        isLoading: false,
        showAlert: true,
        alertText: action.payload,
        alertType: "danger",
      };
    case TOGGLE_SIDEBAR:
      return { ...currentState, showSidebar: !currentState.showSidebar };
    case LOGOUT_USER:
      return {
        ...initialState,
        user: null,
        token: null,
        userLocation: "",
        jobLocation: "",
      };
    case UPDATE_USER_BEGIN:
      return { ...currentState, isLoading: true };
    case UPDATE_USER_SUCCESS:
      return {
        ...currentState,
        isLoading: false,
        user: action.payload.user,
        userLocation: action.payload.user.location,
        jobLocation: action.payload.user.location,
        token: action.payload.token,
        showAlert: true,
        alertText: "User Updated Successfully",
        alertType: "success",
      };
    case UPDATE_USER_ERROR:
      return {
        ...currentState,
        isLoading: false,
        showAlert: true,
        alertText: action.payload.msg,
        alertType: "danger",
      };
    case HANDLE_CHANGE:
      return {
        ...currentState,
        page: 1,
        [action.payload.name]: action.payload.value,
      };
    case HANDLE_CLEAR:
      return {
        ...currentState,
        isEditing: false,
        editJobId: "",
        position: "",
        company: "",
        jobLocation: currentState.userLocation,
        jobType: "full-time",
        jobStatus: "pending",
      };
    case CREATE_JOB_BEGIN:
      return { ...currentState, isLoading: true };
    case CREATE_JOB_SUCCESS:
      return {
        ...currentState,
        isLoading: false,
        showAlert: true,
        alertText: "Job Created Successfully",
        alertType: "success",
      };
    case CREATE_JOB_ERROR:
      return {
        ...currentState,
        isLoading: false,
        showAlert: true,
        alertText: action.payload.msg,
        alertType: "danger",
      };
    case GET_JOBS_BEGIN:
      return { ...currentState, isLoading: true, showAlert: false };
    case GET_JOBS_SUCCESS:
      return {
        ...currentState,
        isLoading: false,
        jobs: action.payload.jobs,
        totalJobs: action.payload.totalJobs,
        numOfPages: action.payload.numOfPages,
      };
    case DELETE_JOB_BEGIN:
      return {
        ...currentState,
        isLoading: true,
      };
    case EDIT_JOB_BEGIN:
      return { ...currentState, isLoading: true };
    case EDIT_JOB_SUCCESS:
      return {
        ...currentState,
        isLoading: false,
        showAlert: true,
        alertText: "Job Edited Successfully",
        alertType: "success",
      };
    case EDIT_JOB_ERROR:
      return {
        ...currentState,
        isLoading: false,
        showAlert: true,
        alertText: action.payload.msg,
        alertType: "danger",
      };
    case SHOW_STATS_BEGIN:
      return { ...currentState, isLoading: true, showAlert: false };
    case SHOW_STATS_SUCCESS:
      return {
        ...currentState,
        isLoading: false,
        stats: action.payload.stats,
        monthlyApplications: action.payload.monthlyApplications,
      };
    case CLEAR_FILTERS:
      return {
        ...currentState,
        search: "",
        searchStatus: "all",
        searchType: "all",
        sort: "latest",
      };
    case CHANGE_PAGE:
      return {
        ...currentState,
        page: action.payload,
      };
    default:
    // return currentState;
  }
  if (action.type === SET_EDIT_JOB) {
    const job = currentState.jobs.find((job) => job._id === action.payload);
    const { position, company, jobType, jobStatus, jobLocation } = job;

    return {
      ...currentState,
      isEditing: true,
      editJobId: action.payload,
      position,
      jobLocation,
      company,
      jobType,
      jobStatus,
    };
  }
}
