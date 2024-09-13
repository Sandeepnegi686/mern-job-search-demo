import { useEffect, useState } from "react";
import Logo from "../components/Logo";
import Wrapper from "../assets/wrappers/RegisterPage";
import FormRow from "../components/FormRow";
import Alert from "../components/Alert";
import { useAppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";

const initialState = {
  name: "",
  email: "",
  password: "",
  isMember: true,
};

function Register() {
  const [value, setValue] = useState(initialState);
  const {
    displayAlert,
    isLoading,
    showAlert,
    clearAlert,
    registerUser,
    loginUser,
    user,
  } = useAppContext();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (user) {
        navigate("/");
      }
    },
    [user, navigate]
  );

  // global context and useNavigate later

  function toggleMember() {
    setValue((value) => ({
      ...value,
      isMember: !value.isMember,
    }));
  }

  const handleChange = (e) => {
    setValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isMember } = value;
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      clearAlert();
      return;
    }
    if (isMember) {
      loginUser({ email, password });
    } else {
      registerUser(value);
    }
  };

  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />

        <h3> {value.isMember ? "Login" : "Register"} </h3>

        {showAlert && <Alert />}

        {/* name field */}
        {value.isMember || (
          <FormRow
            type={"name"}
            name="name"
            value={value.name}
            handleChange={handleChange}
            labelText={"Name"}
          />
        )}

        {/* name field */}
        <FormRow
          type={"email"}
          name="email"
          value={value.email}
          handleChange={handleChange}
          labelText={"Email"}
        />

        {/* name field */}
        <FormRow
          type={"password"}
          name="password"
          value={value.password}
          handleChange={handleChange}
          labelText={"password"}
        />

        <button type="submit" className="btn btn-block" disabled={isLoading}>
          submit
        </button>

        <p>
          {value.isMember ? "Not a member yet?" : "Already a member?"}

          <button type="button" onClick={toggleMember} className="member-btn">
            {value.isMember ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </Wrapper>
  );
}

export default Register;
