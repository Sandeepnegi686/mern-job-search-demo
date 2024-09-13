import { useEffect } from "react";
import { useAppContext } from "../../context/appContext";
import Loading from "../../components/Loading";
import StatsContainer from "../../components/StatsContainer";
import ChartsContainer from "../../components/ChartsContainer";

function Stats() {
  const { getStats } = useAppContext();
  const { isLoading, monthlyApplications } = useAppContext();

  useEffect(function () {
    getStats();
  }, []);

  if (isLoading) return <Loading center />;

  return (
    <>
      <StatsContainer />
      {monthlyApplications.length > 0 && <ChartsContainer />}
    </>
  );
}

export default Stats;
