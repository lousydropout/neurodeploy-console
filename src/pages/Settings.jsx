import { onMount, createSignal } from "solid-js";
import { location, setLocation } from "../store/location";
import { user } from "../store/user";
import { Loading, clickOutside } from "../helpers/modals";
import { deleteModal, modelNull, setDeleteModal } from "../store/deleteModal";

const USER_API = "https://user-api.playingwithml.com";

const [creds, setCreds] = createSignal([]);

const getCreds = async (token) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${USER_API}/credentials`, requestOptions);
    const results = await response.json();
    setCreds(results["creds"]);
    console.log("creds: ", results["creds"]);
  } catch (err) {
    console.error("error", err);
  }
};

const Settings = () => {
  onMount(() => {});
  getCreds(user().jwt);

  setLocation("Settings");
  return (
    <>
      <h2 class="mb-10 text-3xl underline">Credentials</h2>
      <Show when={deleteModal().visible}>
        <div
          use:clickOutside={() => setDeleteModal(false)}
          class="text-xl text-zinc-300 fixed py-12 px-16 w-1/3 h-fit ml-[13%] mt-[5%] bg-zinc-900 shadow-xl shadow-zinc-600 drop-shadow-xl border-zinc-600 rounded-md"
        >
          Are you sure you wanna delete credential{" "}
          <span class="font-semibold">{deleteModal().model_name}</span>?
          <div class="flex justify-between w-full mt-12">
            <button
              class="px-4 py-2 text-gray-300 bg-zinc-700 border border-gray-300 rounded-md"
              onClick={() => setDeleteModal(modelNull)}
            >
              Cancel
            </button>
            <button class="px-4 py-2 text-gray-300 bg-red-900  border border-red-800 rounded-md">
              Delete
            </button>
          </div>
        </div>
      </Show>

      <Show when={creds().length > 0} fallback={Loading}>
        <ul class="mx-auto max-w-[70rem] text-zinc-100">
          <For each={creds()}>
            {(cred) => (
              <li class="flex justify-between mt-4 mb-10 space-x-12">
                <div class="w-full px-10 py-8 bg-zinc-700 rounded-lg">
                  <h3 class="text-xl font-semibold">{cred.name}</h3>
                  <hr class="my-2 mb-4 border-gray-900" />
                  <p class="font-semibold">
                    <span class="text-gray-300 mr-1">access_token: </span>
                    {cred.access_token}
                  </p>
                  <p class="font-semibold">
                    <span class="text-gray-300 mr-1">expires on: </span>
                    {cred.expiration
                      ? formatDatetime(cred.expiration)
                      : "Never"}
                  </p>
                  <p class="font-semibold">
                    <span class="text-gray-300 mr-1">description: </span>
                    {cred.description}
                  </p>
                </div>
                <button
                  name={cred.name}
                  class="block px-6 py-2 text-center text-red-400 border border-red-400 rounded"
                  onClick={(e) => {
                    setDeleteModal({
                      visible: true,
                      name: cred.name,
                    });
                    console.log("delete: ", e.currentTarget.name);
                  }}
                >
                  delete
                </button>
                {/* </div> */}
              </li>
            )}
          </For>
        </ul>
      </Show>
    </>
  );
};

export default Settings;
