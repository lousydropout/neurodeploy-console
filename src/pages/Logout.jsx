import { createSignal, createEffect, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { location, setLocation } from "../store/location";

const Logout = () => {
  setLocation("Logout");
  return <h2>Logout</h2>;
};

export default Logout;
