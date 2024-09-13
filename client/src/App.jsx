import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import NoPage from "./pages/NoPage";
import Register from "./pages/Register";
import "./App.css";
import { AppProvider } from "./context/appContext";
import Stats from "./pages/Dashboard/Stats";
import Profile from "./pages/Dashboard/Profile";
import AddJob from "./pages/Dashboard/AddJob";
import AllJobs from "./pages/Dashboard/AllJobs";
import SharedLayout from "./pages/Dashboard/SharedLayout";
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <SharedLayout />
              </ProtectedRoute>
            }
          >
            <Route path="" element={<Stats />} />
            <Route path="profile" element={<Profile />} />
            <Route path="add-job" element={<AddJob />} />
            <Route path="all-jobs" element={<AllJobs />} />
          </Route>
          <Route path="landing" element={<Landing />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
