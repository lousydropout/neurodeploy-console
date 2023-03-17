import { createSignal, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { setLocation } from "../store/location";

const Home = () => {
  setLocation("Home");

  return (
    <>
      <h2>Home</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt fuga
        exercitationem doloremque sapiente maiores est quis eveniet provident
        ipsa magni suscipit delectus beatae quaerat assumenda dicta quibusdam
        inventore molestiae, dolores ratione. Harum, voluptas qui culpa delectus
        ex quos animi quas ea soluta, dolorem reiciendis doloremque nulla
        exercitationem id corrupti debitis porro, beatae itaque voluptates nihil
        sit vitae praesentium? Hic, provident.
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit atque ad
        animi, corporis eveniet magni libero vitae hic itaque sapiente!
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente odit
        reiciendis non beatae, ipsa nostrum numquam ut doloremque minus sit,
        nihil, nemo in ad enim doloribus. Ut nemo, quis in accusamus eveniet,
        hic architecto voluptate maiores et qui, vel voluptatum.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente odit
        reiciendis non beatae, ipsa nostrum numquam ut doloremque minus sit,
        nihil, nemo in ad enim doloribus. Ut nemo, quis in accusamus eveniet,
        hic architecto voluptate maiores et qui, vel voluptatum.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente odit
        reiciendis non beatae, ipsa nostrum numquam ut doloremque minus sit,
        nihil, nemo in ad enim doloribus. Ut nemo, quis in accusamus eveniet,
        hic architecto voluptate maiores et qui, vel voluptatum.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente odit
        reiciendis non beatae, ipsa nostrum numquam ut doloremque minus sit,
        nihil, nemo in ad enim doloribus. Ut nemo, quis in accusamus eveniet,
        hic architecto voluptate maiores et qui, vel voluptatum.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente odit
        reiciendis non beatae, ipsa nostrum numquam ut doloremque minus sit,
        nihil, nemo in ad enim doloribus. Ut nemo, quis in accusamus eveniet,
        hic architecto voluptate maiores et qui, vel voluptatum.
      </p>
    </>
  );
};

export default Home;
