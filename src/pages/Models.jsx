import { createSignal, Show, onCleanup } from "solid-js";
import { A } from "@solidjs/router";
import { setLocation } from "../store/location";
import { user } from "../store/user";
import { deleteModal, modelNull, setDeleteModal } from "../store/deleteModal";

const USER_API = "https://user-api.playingwithml.com";
const API_DOMAIN = "https://api.playingwithml.com";

const [models, setModels] = createSignal([]);

const clickOutside = (el, accessor) => {
  console.log("el: ", el);
  console.log("accessor: ", accessor);
  // implement here
  const onClick = (e) => !el.contains(e.target) && accessor()?.();
  document.body.addEventListener("click", onClick);

  onCleanup(() => document.body.removeEventListener("click", onClick));
};

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
    setModels(x.reverse());
  } catch (err) {
    console.error("error", err);
  }
};

const formatDatetime = (x) => {
  const y = new Date(x);
  return `${y.toLocaleDateString()} ${y.toLocaleTimeString()}`;
};

const Loading = () => <h1>Loading...</h1>;

const Models = () => {
  setLocation("Models");
  getModels(user().jwt);

  const clickOutside = (el, accessor) => {
    console.log("el: ", el);
    console.log("accessor: ", accessor);
    // implement here
    const onClick = (e) => !el.contains(e.target) && accessor()?.();
    document.body.addEventListener("click", onClick);

    onCleanup(() => document.body.removeEventListener("click", onClick));
  };

  return (
    <>
      <h2 class="mb-10 text-3xl underline">Models</h2>
      <Show when={deleteModal().visible}>
        <div
          use:clickOutside={() => setDeleteModal(false)}
          class="text-xl text-zinc-300 fixed py-12 px-16 w-1/3 h-fit ml-[13%] mt-[5%] bg-zinc-900 shadow-xl shadow-zinc-600 drop-shadow-xl border-zinc-600 rounded-md"
        >
          Are you sure you wanna delete model{" "}
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
      <Show when={models().length > 0} fallback={Loading}>
        <ul class="mx-auto max-w-[70rem] text-zinc-100">
          <For each={models()}>
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
                {/* <div class="flex flex-col justify-between h-full space-y-6 text"> */}
                {/* <A
                    name={model.model_name}
                    class="block px-3 py-2 text-center border rounded text-violet-400 border-violet-400"
                    href={`/models/${model.model_name}`}
                  >
                    view
                  </A> */}
                <button
                  name={model.model_name}
                  class="block px-6 py-2 text-center text-red-400 border border-red-400 rounded"
                  onClick={(e) => {
                    setDeleteModal({
                      visible: true,
                      model_name: model.model_name,
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

export default Models;
