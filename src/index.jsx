/* @refresh reload */
import { render } from "solid-js/web";
import { Router, A } from "@solidjs/router";
import { user, grabfromCache, logUserOut } from "./store/user";
import { modal } from "./store/modal";
import Login from "./pages/Login";
import logoUrl from "../assets/logo.png";

import "./index.css";
import App from "./App";
import Nav from "./components/Nav";
import { createEffect } from "solid-js";

const Logo = () => (
  <div class="text-3xl">
    <A href="/" class="flex items-center space-x-3">
      <img src={logoUrl} alt="Neurodeploy logo" class="w-12 ml-2 " />
      <span>Neurodeploy</span>
    </A>
  </div>
);

// Log out user from all tabs if logged out from one
setInterval(() => {
  const cached = grabfromCache();
  if (!user().expires) return;

  const now = new Date();
  const expires_on = new Date(user().expires);

  if (!cached && user().loggedIn) {
    logUserOut();
  } else if (expires_on <= now) {
    logUserOut();
  }
}, 5000);

createEffect(() => {
  if (modal().visible) {
    console.log("modal().visible");
    document.getElementById("root").style.opacity = 0.5;
  } else {
    console.log("not modal().visible");
    document.getElementById("root").style.opacity = 1;
  }
});

render(
  () => (
    <Router>
      <Show when={user().loggedIn} fallback={() => Login()}>
        {/* Header */}
        <header
          class="flex flex-row items-center justify-between h-20 p-4 bg-zinc-800 border-b-2 border-zinc-700"
          classList={{ "opacity-[85%]": modal().visible }}
        >
          <Logo />
          <h2 class="pr-4">Welcome, {user().username}!</h2>
        </header>

        {/* Center */}
        <div
          className="flex h-full overflow-hidden bg-zinc-800"
          classList={{ "opacity-[85%]": modal().visible }}
        >
          <div class="grid grid-cols-[15rem_1fr] w-full">
            {/* SideNav */}
            <nav class="flex flex-col justify-between h-full p-6 bg-zinc-800 border-r-2 border-zinc-700 col-span-1 ">
              <Nav />
            </nav>

            {/* Main */}
            <main className="w-full p-12 overflow-auto col-span-1">
              <App />
            </main>
          </div>
        </div>
      </Show>

      {/* Footer */}
      <footer
        class="flex flex-row items-center justify-between h-12 p-4 text-gray-400 bg-zinc-800 border-t-2 border-zinc-700"
        classList={{ "opacity-[85%]": modal().visible }}
      >
        <div class="mx-4">Copyright &copy; 2023 Neurodeploy</div>
        {/* Terms and Conditions */}
        <div class="flex items-center mx-4 space-x-2 ">
          <A class="underline" href="/terms">
            terms
          </A>
          <A class="underline" href="/privacy">
            privacy policy
          </A>
        </div>
      </footer>
    </Router>
  ),
  document.getElementById("root")
);

// Modal
render(
  () => (
    <Show when={modal().visible}>
      <div class="flex justify-center">{modal().content}</div>
    </Show>
  ),
  document.getElementById("modal")
);
