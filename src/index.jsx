/* @refresh reload */
import { render } from "solid-js/web";
import { lazy } from "solid-js";
import { Router, A } from "@solidjs/router";
import { location } from "./store/location";
import { user, logUserOut, isCached } from "./store/user";

import "./index.css";
import App from "./App";
import Nav from "./components/Nav";
const root = document.getElementById("root");

const Login = lazy(() => import("./pages/Login"));

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?"
  );
}

const Logo = () => (
  <div class="text-3xl">
    <A href="/" class="flex items-center space-x-3">
      <img
        src="/src/assets/logo.png"
        alt="Neurodeploy logo"
        class=" w-12 ml-2"
      />
      <span>Neurodeploy</span>
    </A>
  </div>
);

// Log out user from all tabs if logged out from one
setInterval(() => {
  let expires_in = new Date(user().expires);
  let now = new Date();

  if (!isCached() && user().loggedIn) {
    logUserOut();
  } else if (expires_in <= now) {
    console.log("User token expired");
    logUserOut();
  }
}, 2000);

render(
  () => (
    <Router>
      <Show when={user().loggedIn} fallback={() => Login()}>
        {/* Header */}
        <header class="flex flex-row p-4 justify-between items-center h-20 bg-gray-800 border-b-4 border-gray-700">
          <Logo />
          <h2>user: {user().username}</h2>
        </header>

        {/* Center */}
        <div className="flex h-full overflow-hidden bg-gray-800">
          <div class="grid grid-cols-[15rem_1fr] w-full">
            {/* SideNav */}
            <nav class="col-span-1 flex flex-col justify-between h-full p-6  bg-gray-800 border-r-4 border-gray-700">
              <Nav />
            </nav>

            {/* Main */}
            <main className="w-full col-span-1 p-6 overflow-auto">
              <App />
            </main>
          </div>
        </div>
      </Show>

      {/* Footer */}
      <footer class="flex flex-row p-4 justify-between items-center h-12 bg-gray-800 border-t-4 border-gray-700 text-gray-400">
        <div class="mx-4">Copyright &copy; 2023 Neurodeploy</div>
        {/* Terms and Conditions */}
        <div class="flex items-center space-x-2  mx-4">
          <A class="underline" href="#">
            terms
          </A>
          <A class="underline" href="#">
            privacy policy
          </A>
        </div>
      </footer>
    </Router>
  ),
  root
);
