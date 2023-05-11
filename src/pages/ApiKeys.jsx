import { createSignal, Switch, Match } from "solid-js";
import { A } from "@solidjs/router";
import { setLocation } from "../store/location";
import { user } from "../store/user";
import { setModal, modalNull } from "../store/modal";
import { Loading, clickOutside } from "../components/Modals";
import { USER_API_URL } from "../params/params";
import { formatDatetime } from "../helpers/formatTime";

const KEY_PREFIX = "********-****-****-****-****";

const [apiKeys, setApiKeys] = createSignal({ ready: false, apiKeys: [] });

const getApiKeys = async (token) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${USER_API_URL}/api-keys`, requestOptions);
    const results = await response.json();
    const x = results["api-keys"];
    x.sort((a, b) => (a.uploaded_at < b.uploaded_at ? -1 : 1));
    setApiKeys({ ready: true, apiKeys: x.reverse() });
  } catch (err) {
    console.error("error", err);
  }
};

const deleteApiKey = async (hashed_key) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${user().jwt}`);
  console.log("hashed_key: ", hashed_key);
  console.log("url: ", `${USER_API_URL}/api-keys/${hashed_key}`);

  try {
    console.log("hashed_key: ", hashed_key);
    const response = await fetch(`${USER_API_URL}/api-keys/${hashed_key}`, {
      method: "DELETE",
      headers: myHeaders,
    });
    const results = await response.json();
    console.log("delete api-key result: ", results);
  } catch (e) {
    console.error(e);
  }
  setModal(modalNull);
  getApiKeys(user().jwt);
};

const ApiKeys = () => {
  setLocation("API Keys");
  getApiKeys(user().jwt);

  const DeleteModal = (props) => (
    <div class="modal" use:clickOutside={() => setModal(modalNull)}>
      Are you sure you wanna delete API key{" "}
      <span class="font-semibold">{`${KEY_PREFIX}${props.last8}`}</span>?
      <div class="flex justify-between w-full mt-12 space-x-4">
        <button
          class="px-4 py-2 text-gray-300 bg-zinc-700 hover:bg-zinc-600 border border-gray-300 rounded-md"
          onClick={() => setModal(modalNull)}
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 text-gray-300 bg-red-900 hover:bg-red-800  border border-red-800 hover:border-red-700 rounded-md"
          onClick={() => deleteApiKey(props.key)}
        >
          Delete
        </button>
      </div>
    </div>
  );

  const DeleteThisApiKey = (props) => {
    const { key, last8 } = props;
    return (
      <button
        name={last8}
        class="block px-2 py-1 text-center text-red-400 border border-red-400 rounded hover:text-red-300 hover:border-red-300"
        onClick={() => {
          setModal({
            visible: true,
            content: <DeleteModal last8={last8} key={key} />,
          });
        }}
      >
        delete
      </button>
    );
  };

  return (
    <div class="h-full">
      <h2 class="mb-10 text-3xl underline">API Keys</h2>
      <A
        class="flex justify-between w-fit space-x-2 px-4 py-3 mb-10 text-violet-400 border border-violet-400 hover:text-violet-300 hover:border-violet-300 rounded-md"
        href="/create_api_key"
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
        <span>New API Key</span>
      </A>

      <Switch fallback={<Loading />}>
        {/* let user know if no apiKeys were found */}
        <Match when={apiKeys().ready && apiKeys().apiKeys.length === 0}>
          <div>No API keys found</div>
        </Match>

        {/* Show list of API keys */}
        <Match when={apiKeys().ready && apiKeys().apiKeys.length > 0}>
          <ul class="md:min-w-[25rem] max-w-[70rem] text-zinc-100">
            <For each={apiKeys().apiKeys}>
              {(key) => (
                <li class="flex justify-between p-0 mx-0 mt-4 mb-10 space-x-4 sm:space-x-8 lg:space-x-12">
                  <div class="w-full p-4 sm:px-10 sm:py-8 bg-zinc-700 rounded-lg overflow-x-auto">
                    <div class="flex justify-between items-end">
                      <h3 class="text-xl">
                        <span class="font-semibold">
                          {`${KEY_PREFIX}${key.last8}`}
                        </span>
                      </h3>
                      <div>
                        <DeleteThisApiKey
                          key={key.hashed_key}
                          last8={key.last8}
                        />
                      </div>
                    </div>
                    <hr class="my-2 mb-4 border-gray-900" />
                    <p class="font-light">
                      <span class="text-gray-300 mr-1 font-bold">
                        applies to model:{" "}
                      </span>
                      {key.model_name == "*" ? "ALL models" : key.model_name}
                    </p>
                    <p class="font-light">
                      <span class="text-gray-300 mr-1 font-bold">
                        description:{" "}
                      </span>
                      {key.description}
                    </p>
                    <p class="font-light">
                      <span class="text-gray-300 mr-1 font-bold">
                        created at:{" "}
                      </span>
                      {formatDatetime(key.created_at)}
                    </p>
                    <p class="font-light">
                      <span class="text-gray-300 mr-1 font-bold">
                        expires on:{" "}
                      </span>
                      {key.expires_at
                        ? formatDatetime(key.expires_at)
                        : "NEVER"}
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
    </div>
  );
};

export default ApiKeys;
