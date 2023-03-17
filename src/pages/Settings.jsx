import { onMount } from "solid-js";
import { location, setLocation } from "../store/location";

const Settings = () => {
  setLocation("Settings");
  return <h2>Settings</h2>;
};

export default Settings;
