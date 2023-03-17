import { A } from "@solidjs/router";
import { location } from "../store/location";

const Logo = () => (
  <div class="text-2xl">
    <A href="/" class="flex items-center mt-8 space-x-3">
      <img src="/src/assets/logo.png" alt="Neurodeploy logo" class="w-8 ml-2" />
      <span class="">Neurodeploy</span>
    </A>
  </div>
);
export default function () {
  return (
    <>
      <Logo />
      <h2>{location()}</h2>
    </>
  );
}
