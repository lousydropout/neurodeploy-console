import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";

const [user, setUser] = createStore({
  loggedIn: false,
  username: null,
  jwt: null,
  expires: null,
});
createEffect(() => {
  console.log("user: ", user);
});

export { user, setUser };
