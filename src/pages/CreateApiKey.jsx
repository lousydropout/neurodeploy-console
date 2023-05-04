import { createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { modal, modalNull, setModal } from "../store/modal";
import { user } from "../store/user";
import { clickOutside } from "../helpers/modals";
import { params } from "../store/params";

const USER_API = `https://user-api.${params.domainName}`;

export default function () {
  const [error, setError] = createSignal(null);
  const [fields, setFields] = createStore(null);
  const [candidateModels, setCandidateModels] = createSignal({
    ready: false,
    candidateModels: [],
  });

  const getModels = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${user().jwt}`);
    const requestOptions = { method: "GET", headers: myHeaders };

    try {
      const response = await fetch(`${USER_API}/ml-models`, requestOptions);
      const results = await response.json();
      if ("error_message" in results) {
        throw Error(results.error_message);
      }

      setCandidateModels({
        ready: true,
        candidateModels: results.models.map((x) => x.model_name),
      });
    } catch (e) {
      console.error(e);
      setError(e.toString());
    }
  };

  getModels();

  const updateField = (e) => {
    const name = e.currentTarget.name;
    setFields([name], e.currentTarget.value);
  };

  const submit = async (e) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${user().jwt}`);
    const requestOptions = { method: "POST", headers: myHeaders };

    try {
      const response = await fetch(
        `${USER_API}/api-keys?model_name=${fields.model_name}&description=${fields.description}&expires_after=${fields.expires_after}`,
        requestOptions
      );
      const results = await response.json();
      if ("error_message" in results) {
        throw Error(results.error_message);
      }

      // Show apiKey to user
      const apiKey = {
        model_name: fields.model_name,
        description: fields.description,
        expires_after: fields.expires_after,
        apiKey: results["api-key"],
      };
      setModal({
        visible: true,
        content: <ApiKeyModal apiKey={apiKey} />,
        states: ["created"],
      });
    } catch (e) {
      console.error(e);
      setError(e.toString());
    }
  };

  const ApiKeyModal = (props) => (
    <div
      class="modal"
      use:clickOutside={() => {
        setModal(modalNull);
        window.location.href = "/api-keys";
      }}
    >
      <div class="w-full px-8 py-6 bg-zinc-700 rounded">
        <h3 class="font-semibold">API Key</h3>
        <hr class="my-2 mb-4 border-gray-900" />
        <span class="block text-gray-400 mr-1">API Key: </span>
        <p class="pl-4 font-semibold">{props.apiKey.apiKey}</p>
        <span class="block text-gray-400 mr-1">description: </span>
        <p class="pl-4 font-semibold">{props.apiKey.description}</p>
        <span class="block text-gray-400 mr-1">expires_after: </span>
        <p class="pl-4 font-semibold">{props.apiKey.expires_after} minutes</p>
      </div>
      <p class="mt-8 text-red-300">
        Note: It is not possible to see the API key once you close this modal.
        Please make sure you have it saved somewhere.{" "}
      </p>
      <button
        class="block mx-auto items-center text-lg text-violet-500 border-violet-500 border shadow-sm drop-shadow-lg w-[70%] py-2 mt-10 rounded"
        onClick={() => {
          setModal(modalNull);
          window.location.href = "/api-keys";
        }}
      >
        Done
      </button>
    </div>
  );

  return (
    <Show when={candidateModels().ready} fallback={<></>}>
      <h2 class="mb-10 text-3xl underline">Create API key</h2>
      <h4>{candidateModels()}</h4>
      <div class="flex flex-col items-center">
        <form
          class="px-8 py-10 h-fit w-[40rem] max-w-full rounded-md bg-zinc-700"
          onSubmit={submit}
        >
          {/* For model */}
          <label for="model_name" class="flex justify-between text-gray-300 ">
            Create API key for model:
          </label>
          <select
            class="mt-1 mb-4 w-full px-3 py-2 rounded cursor-pointer text-black"
            name="model_name"
            id="model_name"
            required
            onChange={updateField}
          >
            <option value="" disabled selected>
              Select which ML model the API key is for
            </option>
            <option value="*">ALL</option>
            <For each={candidateModels().candidateModels}>
              {(x) => <option value={x}>{x}</option>}
            </For>
          </select>

          {/* description */}
          <label for="description" class="flex justify-between text-gray-300 ">
            Description:
          </label>
          <input
            name="description"
            id="description"
            type="text"
            placeholder="Something to help you remember what this key is for"
            class="w-full p-2 mt-1 mb-4 text-black rounded ring-indigo-900"
            onInput={updateField}
          />

          {/* Expires after */}
          <label for="model-name" class="flex justify-between text-gray-300 ">
            Expires after (# of minutes):
          </label>
          <input
            name="expires_after"
            id="expires_after"
            type="text"
            placeholder=""
            class="w-full p-2 mt-1 mb-4 text-black rounded ring-indigo-900"
            onInput={updateField}
          />

          {/* Submit button */}
          <div className="flex justify-center">
            <Show when={!("created" in modal().states)}>
              <button
                type="submit"
                class="text-lg text-violet-500 border-violet-500 border shadow-sm drop-shadow-lg w-[70%] py-2 mt-10 rounded"
              >
                Create
              </button>
            </Show>
          </div>
          {/* Show errors */}
          <Show when={error()}>
            <div class="mt-4 flex justify-center text-red-400">{error()}</div>
          </Show>
        </form>
      </div>
    </Show>
  );
}
