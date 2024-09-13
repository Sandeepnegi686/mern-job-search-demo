import { useAppContext } from "../context/appContext";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import Wrapper from "../assets/wrappers/PageBtnContainer";

const PageBtnContainer = () => {
  const { numOfPages, page, changePage } = useAppContext();

  const pages = Array.from({ length: numOfPages }, (_, i) => i + 1);

  function handlePrevBtn() {
    let p = page - 1;
    if (p < 1) {
      p = numOfPages;
    }
    changePage(p);
  }

  function handleNextBtn() {
    let p = page + 1;
    if (p > numOfPages) {
      p = 1;
    }
    changePage(p);
  }

  return (
    <Wrapper>
      <button className="prev-btn" onClick={handlePrevBtn}>
        <HiChevronDoubleLeft />
        Prev
      </button>
      <div className="btn-container">
        {pages.map((pgNum, i) => {
          return (
            <button
              key={i}
              className={pgNum === page ? "pageBtn active" : "pageBtn"}
              onClick={() => changePage(pgNum)}
            >
              {pgNum}
            </button>
          );
        })}
      </div>
      <button className="next-btn" onClick={handleNextBtn}>
        Next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  );
};

export default PageBtnContainer;
