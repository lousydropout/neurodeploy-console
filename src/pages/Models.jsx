import { createSignal, Switch, Match } from "solid-js";
import { A } from "@solidjs/router";
import { setLocation } from "../store/location";
import { user } from "../store/user";
import { setModal, modalNull } from "../store/modal";
import { Loading, clickOutside } from "../helpers/modals";
import { params } from "../store/params";
import { formatDatetime } from "../helpers/formatTime";

const USER_API = `https://user-api.${params.domainName}`;
const API_DOMAIN = `https://api.${params.domainName}`;

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

const deleteModel = async (modelName) => {
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
  setModal(modalNull);
  getModels(user().jwt);
};

const Models = () => {
  setLocation("Models");
  getModels(user().jwt);

  const DeleteModal = (props) => (
    <div class="modal" use:clickOutside={() => setModal(modalNull)}>
      Are you sure you wanna delete model{" "}
      <span class="font-semibold">{props.name}</span>?
      <div class="flex justify-between w-full mt-12 space-x-4">
        <button
          class="px-4 py-2 text-gray-300 bg-zinc-700 hover:bg-zinc-600 border border-gray-300 rounded-md"
          onClick={() => setModal(modalNull)}
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 text-gray-300 bg-red-900 hover:bg-red-800  border border-red-800 hover:border-red-700 rounded-md"
          onClick={() => deleteModel(props.name)}
        >
          Delete
        </button>
      </div>
    </div>
  );

  const DeleteThisModel = (props) => {
    const { name } = props;
    return (
      <button
        name={name}
        class="block px-6 py-2 text-center text-red-400 border border-red-400 rounded hover:text-red-300 hover:border-red-300"
        onClick={() => {
          setModal({
            visible: true,
            content: <DeleteModal name={name} />,
          });
        }}
      >
        delete
      </button>
    );
  };

  return (
    <>
      <h2 class="mb-10 text-3xl underline">Models</h2>
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
          <ul class="mx-auto min-w-[25rem] max-w-[70rem] text-zinc-100">
            <For each={models().models}>
              {(model) => (
                <li class="flex justify-between mt-4 mb-10 space-x-4 sm:space-x-8 lg:space-x-12">
                  <div class="w-full px-10 py-8 bg-zinc-700 rounded-lg overflow-x-auto">
                    <div class="flex justify-between items-end">
                      <h3 class="text-xl font-semibold">{model.model_name}</h3>
                      <div>
                        <DeleteThisModel name={model.model_name} />
                      </div>
                    </div>
                    <hr class="my-2 mb-4 border-gray-900" />
                    <p class="font-light">
                      <span class="text-gray-300 mr-1 font-bold">
                        Requires API key:{" "}
                      </span>
                      {model.is_public ? "No" : "Yes"}
                    </p>
                    <p class="font-light">
                      <span class="text-gray-300 mr-1 font-bold">
                        library:{" "}
                      </span>
                      {model.library}
                    </p>
                    <p class="font-light">
                      <span class="text-gray-300 mr-1 font-bold">
                        filetype:{" "}
                      </span>
                      {model.filetype}
                    </p>
                    <p class="font-light">
                      <span class="text-gray-300 mr-1 font-bold">
                        last updated at:{" "}
                      </span>
                      {formatDatetime(model.updated_at)}
                    </p>
                    <p class="font-light">
                      <span class="text-gray-300 mr-1 font-bold">
                        model endpoint:{" "}
                      </span>
                      <span class="text-gray-300 underline">
                        {`${API_DOMAIN}/${user().username}/${model.model_name}`}
                      </span>
                    </p>
                  </div>
                  {/* <div class="hidden md:block">
                    <DeleteThisModel name={model.model_name} />
                  </div> */}
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
