import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  const { user } = useAppContext();

  useEffect(
    function () {
      if (!user) {
        navigate("/landing");
      }
    },
    [navigate, user]
  );

  return children;
};

export default ProtectedRoute;
