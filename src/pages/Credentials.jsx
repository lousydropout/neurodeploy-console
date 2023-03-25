import { onMount, createSignal, Show, Switch, Match } from "solid-js";
import { location, setLocation } from "../store/location";
import { user } from "../store/user";
import { Loading, clickOutside } from "../helpers/modals";
import { deleteModal, modelNull, setDeleteModal } from "../store/deleteModal";
import { A } from "@solidjs/router";
import { params } from "../store/params";

const USER_API = `https://user-api.${params.domainName}`;

const [creds, setCreds] = createSignal({ ready: false, creds: [] });

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
    setCreds({ ready: true, creds: results["creds"] });
  } catch (err) {
    console.error("error", err);
  }
};

const Credentials = () => {
  onMount(() => {});
  getCreds(user().jwt);

  setLocation("Credentials");

  const deleteCreds = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${user().jwt}`);

    try {
      const response = await fetch(
        `${USER_API}/credentials/${deleteModal().name}`,
        {
          method: "DELETE",
          headers: myHeaders,
        }
      );
      const results = await response.json();
      console.log("delete creds results: ", results);
    } catch (e) {
      console.error(e);
    }
    setDeleteModal(modelNull);
    getCreds(user().jwt);
  };

  return (
    <>
      <h2 class="mb-10 text-3xl underline">Credentials</h2>
      <Show when={deleteModal().visible === "delete"}>
        <div
          use:clickOutside={() => setDeleteModal(modelNull)}
          class="text-xl text-zinc-300 fixed py-12 px-16 w-1/3 h-fit ml-[13%] mt-[5%] bg-zinc-900 shadow-xl shadow-zinc-600 drop-shadow-xl border-zinc-600 rounded-md"
        >
          Are you sure you wanna delete credential{" "}
          <span class="font-semibold">{deleteModal().name}</span>?
          <div class="flex justify-between w-full mt-12">
            <button
              class="px-4 py-2 text-gray-300 bg-zinc-700 hover:bg-zinc-600 border border-gray-300 rounded-md"
              onClick={() => setDeleteModal(modelNull)}
            >
              Cancel
            </button>
            <button
              class="px-4 py-2 text-gray-300 bg-red-900 hover:bg-red-800 border border-red-800 rounded-md"
              onClick={deleteCreds}
            >
              Delete
            </button>
          </div>
        </div>
      </Show>

      {/* create new creds */}
      <A
        class="flex justify-between w-fit space-x-2 px-4 py-3 mb-10 text-violet-400 border border-violet-400 hover:text-violet-300 hover:border-violet-300 rounded-md"
        href="/create_creds"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
        <span>New credentials</span>
      </A>

      <Switch fallback={<Loading />}>
        {/* let user know if no credentials were found */}
        <Match when={creds().ready && creds().creds.length === 0}>
          <div>No credentials found</div>
        </Match>

        {/* Show list of models */}
        <Match when={creds().ready && creds().creds.length > 0}>
          <ul class="mx-auto max-w-[70rem] text-zinc-100">
            <For each={creds().creds}>
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
                    class="block px-6 py-2 text-center text-red-400 border border-red-400 rounded hover:text-red-300 hover:border-red-300"
                    onClick={(e) => {
                      setDeleteModal({
                        visible: "delete",
                        name: cred.name,
                      });
                    }}
                  >
                    delete
                  </button>
                </li>
              )}
            </For>
          </ul>
        </Match>
      </Switch>
    </>
  );
};

export default Credentials;
