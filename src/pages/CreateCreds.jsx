import { createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { modal, modalNull, setModal } from "../store/modal";
import { user } from "../store/user";
import { clickOutside } from "../helpers/modals";
import { USER_API_URL } from "../params/params";

export default function () {
  const [error, setError] = createSignal(null);
  const [fields, setFields] = createStore(null);

  const updateField = (e) => {
    const name = e.currentTarget.name;
    setFields([name], e.currentTarget.value);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null); // reset error

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${user().jwt}`);
    myHeaders.append("credentials_name", fields.creds_name);
    myHeaders.append("description", fields.description);
    const requestOptions = { method: "POST", headers: myHeaders };

    // send create cred request
    try {
      const response = await fetch(
        `${USER_API_URL}/credentials`,
        requestOptions
      );
      const results = await response.json();
      console.log("results: ", results);
      if ("errorMessage" in results) {
        throw Error(results.errorMessage);
      }

      // Show creds to user
      const creds = {
        name: results.credential_name,
        accessKey: results.access_key,
        secretKey: results.secret_key,
        description: results.description,
        expiration: results.expiration,
      };
      setModal({
        visible: true,
        content: <CredsModal creds={creds} />,
        states: ["created"],
      });
    } catch (e) {
      console.error(e);
      setError(e.toString());
    }
  };

  const CredsModal = (props) => (
    <div
      class="modal"
      use:clickOutside={() => {
        setModal(modalNull);
        window.location.href = "/credentials";
      }}
    >
      <div class="w-full px-8 py-6 bg-zinc-700 rounded">
        <h3 class="font-semibold">{props.creds.name}</h3>
        <hr class="my-2 mb-4 border-gray-900" />
        <span class="block text-gray-400 mr-1">access_key: </span>
        <p class="pl-4 font-semibold">{props.creds.accessKey}</p>
        <span class="block text-gray-400 mr-1">secret_key: </span>
        <p class="pl-4 font-semibold">{props.creds.secretKey}</p>
        <span class="block text-gray-400 mr-1">expires_on: </span>
        <p class="pl-4 font-semibold">
          {props.creds.expiration
            ? formatDatetime(props.creds.expiration)
            : "Never"}
        </p>
        <span class="block text-gray-400 mr-1">description: </span>
        <p class="pl-4 font-semibold">{modal()?.description}</p>
      </div>
      <p class="mt-8 text-red-300">
        Note: It is not possible to see the secret key once you close this
        modal. Please make sure you have it saved somewhere.{" "}
      </p>
      <button
        class="block mx-auto items-center text-lg text-violet-500 border-violet-500 border shadow-sm drop-shadow-lg w-[70%] py-2 mt-10 rounded"
        onClick={() => {
          setModal(modalNull);
          window.location.href = "/credentials";
        }}
      >
        Done
      </button>
    </div>
  );

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
            class="mt-1 mb-4 w-full px-3 py-2 rounded cursor-pointer text-black"
            name="description"
            id="description"
            type="text"
            placeholder="description"
            required
            onChange={updateField}
          ></input>

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
    </>
  );
}
