import { location } from "../store/location";
import { A } from "@solidjs/router";
import { logUserOut } from "../store/user";
import { icons } from "../../assets/icons";

// navs
const top_navs = [
  // { name: "Home", route: "/", icon: icons.home, click: null },
  { name: "Models", route: "/models", icon: icons.models, click: null },
];

const bottom_navs = [
  {
    name: "Settings",
    route: "/settings",
    icon: icons.settings,
    click: null,
  },
  {
    name: "Logout",
    route: "/",
    icon: icons.logout,
    click: () => logUserOut(),
  },
];

// Nav group
const NavGroup = (props) => (
  <section class="">
    <For each={props.nav_items}>
      {(page) => (
        <A
          href={page.route}
          class="flex items-center justify-start px-4 py-4 hover:bg-zinc-600"
          classList={{ "underline bg-zinc-600": location() === page.name }}
          onClick={page.click}
        >
          <div class="pr-4">{page.icon}</div>
          <div>{page.name}</div>
        </A>
      )}
    </For>
  </section>
);

export default function () {
  return (
    <>
      <NavGroup nav_items={top_navs} />
      <NavGroup nav_items={bottom_navs} />
    </>
  );
}
