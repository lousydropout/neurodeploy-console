import { setLocation } from "../store/location";

const Home = () => {
  setLocation("Home");
  window.location.href = "/models";

  return (
    <>
      <h2>Home</h2>
    </>
  );
};

export default Home;
