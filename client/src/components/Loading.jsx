// eslint-disable-next-line react/prop-types
const Loading = ({ center }) => {
  return <div className={center ? "loading loading-center" : "loading"}></div>;
};

export default Loading;
