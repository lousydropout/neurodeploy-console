import { createSignal, createEffect } from "solid-js";

const KEY = "neurodeployUser";

const LOGGED_OUT = {
  loggedIn: false,
  username: null,
  jwt: null,
  expires: null,
};

const [user, setUser] = createSignal(LOGGED_OUT);

if (localStorage.getItem(KEY)) {
  const x = JSON.parse(localStorage.getItem(KEY));
  setUser(x);
}

const updateUser = (val) => {
  setUser(val);
  localStorage.setItem("neurodeployUser", JSON.stringify(val));
};

const logoutUser = () => {
  setUser(LOGGED_OUT);
  localStorage.removeItem("neurodeployUser");
};

export { user, updateUser, logoutUser };
