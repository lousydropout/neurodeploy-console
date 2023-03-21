import { setLocation } from "../store/location";

const Home = () => {
  setLocation("Home");

  return (
    <>
      <h2>Home</h2>
    </>
  );
};

export default Home;
