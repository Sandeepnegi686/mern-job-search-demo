import { useState } from "react";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import Alert from "../../components/Alert";
import FormRow from "../../components/FormRow";
import { useAppContext } from "../../context/appContext";
import axios from "axios";

function Profile() {
  const { displayAlert, isLoading, showAlert, clearAlert, user, updateUser } =
    useAppContext();

  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [lastName, setLastName] = useState(user?.lastName);
  const [location, setLocation] = useState(user?.location);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !lastName || !location) {
      displayAlert();
      clearAlert();
      return;
    }
    const currentUser = { name, email, lastName, location };
    updateUser(currentUser);
  };

  return (
    <Wrapper>
      <form className="form" onSubmit={handleFormSubmit}>
        <h1>Profile</h1>
        {showAlert && <Alert />}
        <div className="form-center">
          <FormRow
            type="text"
            name={name}
            value={name}
            handleChange={(e) => setName(e.target.value)}
            labelText="Name"
          />
          <FormRow
            type="text"
            name={lastName}
            value={lastName}
            handleChange={(e) => setLastName(e.target.value)}
            labelText="Last Name"
          />
          <FormRow
            type="email"
            name={email}
            value={email}
            handleChange={(e) => setEmail(e.target.value)}
            labelText="Email"
          />
          <FormRow
            type="text"
            name={location}
            value={location}
            handleChange={(e) => setLocation(e.target.value)}
            labelText="location"
          />
          <button className="btn btn-block" type="submit" disabled={isLoading}>
            {isLoading ? "Please Wait..." : "save changes"}
          </button>
        </div>
      </form>
    </Wrapper>
  );
}

export default Profile;
