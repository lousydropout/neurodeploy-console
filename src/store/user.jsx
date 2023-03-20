import { createSignal } from "solid-js";

const KEY = "neurodeployUser";

const LOGGED_OUT = {
  loggedIn: false,
  username: null,
  jwt: null,
  expires: null,
};

const [user, setUser] = createSignal(LOGGED_OUT);

const isCached = () => localStorage.getItem(KEY);

if (isCached()) {
  const x = JSON.parse(localStorage.getItem(KEY));
  setUser(x);
}

const updateUser = (val) => {
  setUser(val);
  localStorage.setItem(KEY, JSON.stringify(val));
};

const logUserOut = () => {
  setUser(LOGGED_OUT);
  localStorage.removeItem(KEY);
};

export { user, isCached, updateUser, logUserOut };
