import { createSignal } from "solid-js";
import { params } from "./params";

const KEY = `${params.domainName.slice(0, -4)}User`;

const LOGGED_OUT = {
  loggedIn: false,
  username: null,
  jwt: null,
  expires: null,
};

const [user, setUser] = createSignal(LOGGED_OUT);

const grabfromCache = () => {
  const cache = localStorage.getItem(KEY);

  if (cache && !user().loggedIn) {
    const x = JSON.parse(cache);
    setUser(x);
    return true;
  }
  return cache !== null;
};

const updateUser = (val) => {
  localStorage.setItem(KEY, JSON.stringify(val));
  setUser(val); // do this after storing in localStorage
};

const logUserOut = () => {
  setUser(LOGGED_OUT);
  localStorage.removeItem(KEY);
};

export { user, grabfromCache, updateUser, logUserOut };
