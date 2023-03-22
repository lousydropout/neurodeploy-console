import { createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { toggleShowLogin } from "../store/showLogin";
import { updateUser } from "../store/user";
import logoUrl from "../../assets/logo.png";

const SigninComponent = () => {
  const [error, setError] = createSignal(null);
  const [fields, setFields] = createStore();

  const updateField = (e) => {
    const name = e.currentTarget.name;
    setFields([name], e.currentTarget.value);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null); // reset error

    const myHeaders = new Headers();
    myHeaders.append("username", fields.username);
    myHeaders.append("password", fields.password);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      // redirect: "follow",
    };

    // sign in
    let result;
    try {
      const response = await fetch(
        "https://user-api.playingwithml.com/sign-in",
        requestOptions
      );
      result = await response.json();
      console.log("result:  ", result);

      if ("errorMessage" in result) {
        console.error(result["errorMessage"]);
        setError("Invalid username and/or password.");
        return;
      }
    } catch (err) {
      console.error(err);
      setError("Invalid username and/or password.");
      return;
    }

    updateUser({
      loggedIn: true,
      username: fields.username,
      jwt: result["token"],
      expires: result["expiration"],
    });
  };

  return (
    <div class="flex flex-col">
      {/* header */}
      <header class="flex flex-col items-center">
        <img src={logoUrl} alt="Neurodeploy logo" class="mb-6 ml-2 w-14" />
        <h1 class="text-3xl text-gray-200">Log in</h1>
        <p class="mt-2 text-sm text-center max-w">
          Don't have an account?
          <A
            class="ml-1 font-semibold underline text-violet-400"
            href="#"
            onClick={toggleShowLogin}
          >
            Register here
          </A>
          .
        </p>
        <hr class="my-4 border-zinc-400" />
      </header>

      {/* form */}
      <form
        class="px-8 py-10 h-fit w-96 rounded-md bg-zinc-600"
        onSubmit={submit}
      >
        {/* username */}
        <label for="username" class="flex justify-between text-gray-300 ">
          Username:
        </label>
        <input
          name="username"
          id="username"
          type="username"
          placeholder="Username"
          class="w-full p-2 mt-1 mb-4 text-black bg-zinc-300 rounded ring-indigo-900"
          required
          onInput={updateField}
        />

        {/* Password */}
        <label for="password" class="flex justify-between text-gray-300">
          Password:
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          required
          class="w-full p-2 mt-1 mb-4 text-black bg-zinc-300 rounded"
          onInput={updateField}
        />

        {/* Submit button */}
        <div className="flex justify-center">
          <button
            type="submit"
            class="bg-violet-900 shadow-purple-800 shadow-sm w-[70%] py-2 mt-8 rounded text-gray-300"
          >
            Log in
          </button>
        </div>

        {/* Show errors */}
        <Show when={error()}>
          <div class="mt-4 flex justify-center text-red-400">{error()}</div>
        </Show>
      </form>
    </div>
  );
};

export default SigninComponent;
