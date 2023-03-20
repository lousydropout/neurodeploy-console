import { A } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { toggleShowLogin } from "../store/showLogin";
import { updateUser } from "../store/user";

const SigninComponent = () => {
  const [fields, setFields] = createStore();

  const updateField = (e) => {
    const name = e.currentTarget.name;
    setFields([name], e.currentTarget.value);
  };

  const submit = async (e) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("username", fields.username);
    myHeaders.append("password", fields.password);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      // redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://user-api.playingwithml.com/sign-in",
        requestOptions
      );
      const result = await response.json();

      updateUser({
        loggedIn: true,
        username: fields.username,
        jwt: result["token"],
        expires: result["expiration"],
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div class="flex flex-col">
      {/* header */}
      <header class="flex flex-col items-center">
        <img
          src="/src/assets/logo.png"
          alt="Neurodeploy logo"
          class="w-14 ml-2 mb-6"
        />
        <h1 class="text-3xl text-gray-200">Log in</h1>
        <p class="mt-2 text-center text-sm max-w">
          Don't have an account?
          <A
            class="ml-1 underline text-violet-400 font-semibold"
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
        class="h-fit w-96 rounded-md bg-zinc-700 px-8 py-10"
        onSubmit={submit}
      >
        {/* username */}
        <label for="username" class="flex justify-between  text-gray-300">
          Username:
        </label>
        <input
          name="username"
          id="username"
          type="username"
          placeholder="Username"
          class="text-black p-2 mt-1 mb-4 rounded w-full bg-gray-300 ring-indigo-900"
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
          class="text-black p-2 mt-1 mb-4 rounded w-full bg-gray-300"
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
      </form>
    </div>
  );
};

export default SigninComponent;
