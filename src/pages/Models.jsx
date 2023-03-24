import { createSignal, Show, Switch, Match } from "solid-js";
import { A } from "@solidjs/router";
import { setLocation } from "../store/location";
import { user } from "../store/user";
import { deleteModal, modelNull, setDeleteModal } from "../store/deleteModal";
import { Loading, clickOutside } from "../helpers/modals";

const USER_API = "https://user-api.playingwithml.com";
const API_DOMAIN = "https://api.playingwithml.com";

const [models, setModels] = createSignal({ ready: false, models: [] });

const getModels = async (token) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${USER_API}/ml-models`, requestOptions);
    const results = await response.json();
    const x = results["models"];
    x.sort((a, b) => (a.uploaded_at < b.uploaded_at ? -1 : 1));
    setModels({ ready: true, models: x.reverse() });
  } catch (err) {
    console.error("error", err);
  }
};

const formatDatetime = (x) => {
  const y = new Date(x);
  return `${y.toLocaleDateString()} ${y.toLocaleTimeString()}`;
};

const deleteModel = async () => {
  const modelName = deleteModal().name;
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${user().jwt}`);

  try {
    const response = await fetch(`${USER_API}/ml-models/${modelName}`, {
      method: "DELETE",
      headers: myHeaders,
    });
    const results = await response.json();
    console.log("delete model results: ", results);
  } catch (e) {
    console.error(e);
  }
  setDeleteModal(modelNull);
  getModels(user().jwt);
};

const Models = () => {
  setLocation("Models");
  getModels(user().jwt);

  return (
    <>
      <h2 class="mb-10 text-3xl underline">Models</h2>
      <Show when={deleteModal().visible == "delete"}>
        <div
          use:clickOutside={() => setDeleteModal(modelNull)}
          class="text-xl text-zinc-300 fixed py-12 px-16 w-1/3 h-fit ml-[13%] mt-[5%] bg-zinc-900 shadow-xl shadow-zinc-600 drop-shadow-xl border-zinc-600 rounded-md"
        >
          Are you sure you wanna delete model{" "}
          <span class="font-semibold">{deleteModal().name}</span>?
          <div class="flex justify-between w-full mt-12">
            <button
              class="px-4 py-2 text-gray-300 bg-zinc-700 hover:bg-zinc-600 border border-gray-300 rounded-md"
              onClick={() => setDeleteModal(modelNull)}
            >
              Cancel
            </button>
            <button
              class="px-4 py-2 text-gray-300 bg-red-900 hover:bg-red-800  border border-red-800 hover:border-red-700 rounded-md"
              onClick={deleteModel}
            >
              Delete
            </button>
          </div>
        </div>
      </Show>

      <A
        class="flex justify-between w-fit space-x-2 px-4 py-3 mb-10 text-violet-400 border border-violet-400 hover:text-violet-300 hover:border-violet-300 rounded-md"
        href="/create_model"
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
        <span>New model</span>
      </A>

      <Switch fallback={<Loading />}>
        {/* let user know if no models were found */}
        <Match when={models().ready && models().models.length === 0}>
          <div>No models found</div>
        </Match>

        {/* Show list of models */}
        <Match when={models().ready && models().models.length > 0}>
          <ul class="mx-auto max-w-[70rem] text-zinc-100">
            <For each={models().models}>
              {(model) => (
                <li class="flex justify-between mt-4 mb-10 space-x-12">
                  <div class="w-full px-10 py-8 bg-zinc-700 rounded-lg">
                    <h3 class="text-xl font-semibold">{model.model_name}</h3>
                    <hr class="my-2 mb-4 border-gray-900" />
                    <p class="font-semibold">
                      <span class="text-gray-300 mr-1">model type: </span>
                      {model.model_type}
                    </p>
                    <p class="font-semibold">
                      <span class="text-gray-300 mr-1">persistence type: </span>
                      {model.persistence_type}
                    </p>
                    <p class="font-semibold">
                      <span class="text-gray-300 mr-1">uploaded at: </span>
                      {formatDatetime(model.uploaded_at)}
                    </p>
                    <p class="font-semibold">
                      <span class="text-gray-300 mr-1">model endpoint: </span>
                      <span class="text-gray-300 underline">
                        {`${API_DOMAIN}/${user().username}/${model.model_name}`}
                      </span>
                    </p>
                  </div>
                  <button
                    name={model.model_name}
                    class="block px-6 py-2 text-center text-red-400 border border-red-400 rounded hover:text-red-300 hover:border-red-300"
                    onClick={(e) => {
                      setDeleteModal({
                        visible: "delete",
                        name: model.model_name,
                      });
                    }}
                  >
                    delete
                  </button>
                  {/* </div> */}
                </li>
              )}
            </For>
          </ul>
        </Match>
      </Switch>
    </>
  );
};

export default Models;
