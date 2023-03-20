import { createSignal } from "solid-js";
import { A } from "@solidjs/router";
import { setLocation } from "../store/location";
import { user } from "../store/user";

const USER_API = "https://user-api.playingwithml.com";
const API_DOMAIN = "https://api.playingwithml.com";

const [models, setModels] = createSignal([]);

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

const Models = () => {
  setLocation("Models");
  getModels(user().jwt);

  return (
    <>
      <h2 class="mb-10 text-3xl underline">Models</h2>
      <ul class="mx-auto max-w-[70rem]">
        <For each={models()}>
          {(model) => (
            <li class="mt-4 mb-10 flex justify-between space-x-12">
              <div class="py-8 px-10 w-full bg-gray-700 rounded-lg">
                <h3 class="text-xl font-semibold">{model.model_name}</h3>
                <hr class="border-gray-400 my-2 mb-4" />
                <p>
                  <span class="text-gray-400">model type: </span>
                  {model.model_type}
                </p>
                <p>
                  <span class="text-gray-400">persistence type: </span>
                  {model.persistence_type}
                </p>
                <p>
                  <span class="text-gray-400">uploaded at: </span>
                  {formatDatetime(model.uploaded_at)}
                </p>
                <p>
                  <span class="text-gray-400">model endpoint: </span>
                  <span class="underline text-gray-400">
                    {`${API_DOMAIN}/${user().username}/${model.model_name}`}
                  </span>
                </p>
              </div>
              <div class="flex flex-col justify-between space-y-6 h-full text">
                <A
                  name={model.model_name}
                  class="block text-violet-400 border-violet-400 border px-3 py-2 rounded text-center"
                  href={`/models/${model.model_name}`}
                >
                  view
                </A>
                <button
                  name={model.model_name}
                  class="block text-red-400 border-red-400 border px-3 py-2 rounded text-center"
                  onClick={(e) => {
                    console.log("delete: ", e.currentTarget.name);
                  }}
                >
                  delete
                </button>
              </div>
            </li>
          )}
        </For>
      </ul>
    </>
  );
};

export default Models;
