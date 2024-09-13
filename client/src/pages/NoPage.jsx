import Wrapper from "../assets/wrappers/ErrorPage";
import img from "../assets/images/not-found.svg";
import { Link } from "react-router-dom";
function NoPage() {
  return (
    <Wrapper className="full-page">
      <div>
        <img src={img} alt={"page not found"} />
        <h3>Oh!! Page Not Found</h3>
        <p>We can&apos;t seem to find the page you are looking for</p>
        <Link to={"/"}>back home</Link>
      </div>
    </Wrapper>
  );
}

export default NoPage;
