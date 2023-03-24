import { A } from "@solidjs/router";
import { createSignal, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { user } from "../store/user";

const USER_API = "https://user-api.playingwithml.com";

export default function () {
  const [error, setError] = createSignal(null);
  const [fields, setFields] = createStore(null);

  const updateField = (e) => {
    const name = e.currentTarget.name;
    setFields([name], e.currentTarget.value);
  };

  const submit = async (e) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${user().jwt}`);
    myHeaders.append("credential_name", fields.creds_name);
    myHeaders.append("description", fields.description);
    const requestOptions = { method: "POST", headers: myHeaders };

    try {
      const response = await fetch(`${USER_API}/credentials`, requestOptions);
      const results = await response.json();
      console.log("creds results: ", results);
      // Show creds to user
    } catch (e) {
      console.error(e);
    }

    window.location.href = "/settings";
  };

  return (
    <>
      <h2 class="mb-10 text-3xl underline">Create credentials</h2>

      <div class="flex flex-col items-center">
        <form
          class="px-8 py-10 h-fit w-[40rem] max-w-full rounded-md bg-zinc-700"
          onSubmit={submit}
        >
          {/* username */}
          <label for="creds-name" class="flex justify-between text-gray-300 ">
            Credential name:
          </label>
          <input
            name="creds_name"
            id="creds-name"
            type="text"
            placeholder="credentials name"
            class="w-full p-2 mt-1 mb-4 text-black rounded ring-indigo-900"
            required
            onInput={updateField}
          />

          {/* creds type */}
          <label for="description" class="flex justify-between text-gray-300 ">
            Description:
          </label>
          <input
            class="mt-1 mb-4 w-full px-3 py-2 rounded cursor-pointer  text-black"
            name="description"
            id="description"
            type="text"
            placeholder="description"
            required
            onChange={updateField}
          ></input>

          {/* Submit button */}
          <div className="flex justify-center">
            <button
              type="submit"
              class="text-lg text-violet-500 border-violet-500 border shadow-sm drop-shadow-lg w-[70%] py-2 mt-10 rounded"
            >
              Create
            </button>
          </div>
          {/* Show errors */}
          <Show when={error()}>
            <div class="mt-4 flex justify-center text-red-400">{error()}</div>
          </Show>
        </form>

        {/* <div>
          <h2>Creds info</h2>
        </div> */}
      </div>
    </>
  );
}
