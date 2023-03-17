import { createSignal, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { setLocation } from "../store/location";

const Models = () => {
  setLocation("Models");

  return <h2>Models</h2>;
};

export default Models;
