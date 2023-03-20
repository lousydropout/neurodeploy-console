import { location } from "../store/location";
import { A } from "@solidjs/router";
import { logoutUser } from "../store/user";
import { icons } from "../assets/icons";

const top_navs = [
  { name: "Home", route: "/", icon: icons.home },
  { name: "Models", route: "/models", icon: icons.models },
];

const onPage = (page, value) => (location() === page ? value : "");

const NavGroup = (props) => (
  <section>
    <For each={props.nav_items}>
      {(page) => (
        <A
          href={page.route}
          class={
            "flex justify-start items-center px-4 py-4 hover:bg-gray-600" +
            onPage(page.name, " underline bg-gray-600")
          }
        >
          <div class="pr-4">{page.icon}</div>
          <div>{page.name}</div>
        </A>
      )}
    </For>
  </section>
);

const BottomNav = () => {
  return (
    <section>
      <A
        href="/settings"
        class={
          "flex justify-start items-center px-4 py-4 hover:bg-gray-600" +
          onPage("Settings", " underline bg-gray-600")
        }
      >
        <div class="pr-4">{icons.settings}</div>
        <div>Settings</div>
      </A>
      <A
        href="/"
        class={
          "flex justify-start items-center px-4 py-4 hover:bg-gray-600" +
          onPage("Logout", " underline bg-gray-600")
        }
        onClick={() => logoutUser()}
      >
        <div class="pr-4">{icons.logout}</div>
        <div>Logout</div>
      </A>
    </section>
  );
};

export default function () {
  return (
    <>
      <NavGroup nav_items={top_navs} />
      <BottomNav />
    </>
  );
}
