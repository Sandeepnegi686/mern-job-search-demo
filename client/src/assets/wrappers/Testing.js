import styled from "styled-components";

const Wrapper = styled.main`
  nav {
    width: var(--fixed-width);
    max-width: var(--max-width);
    margin: 0 auto;
    height: var(--nav-height);
    display: flex;
    align-items: center;
  }
  .page {
    min-height: calc(100vh - var(--nav-height));
    display: grid;
    align-items: center;
    /* margin-top: -3rem; */
  }
  h1 {
    font-weight: 700;
    span {
      color: var(--primary-500);
    }
  }
  .main-img {
    display: none;
  }
  @media (min-width: 990px) {
    .page {
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }
    .main-img {
      display: block;
    }
  }
`;

export default Wrapper;
