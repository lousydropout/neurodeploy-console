import { createSignal } from "solid-js";
import { A } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { toggleShowLogin } from "../store/showLogin";

const ErrorMessage = (props) => (
  <span class="text-red-400 text-right text-sm">{props.error}</span>
);

const FIELDS = {
  username: null,
  email: null,
  password: null,
  confirmpassword: null,
};

const SigninComponent = () => {
  const [fields, setFields] = createStore();

  const updateField = (e) => {
    const name = e.currentTarget.name;
    setFields([name], e.currentTarget.value);
  };

  const submit = (e) => {
    e.preventDefault();
    console.log("log in");
  };

  return (
    <div class="flex flex-col">
      <div class="flex flex-col items-center">
        <span class="flex items-center mb-6">
          <img
            src="/src/assets/logo.png"
            alt="Neurodeploy logo"
            class=" w-14 ml-2"
          />
          {/* <p class="text-3xl pl-4">Neurodeploy</p> */}
        </span>
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
      </div>

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
        {/* <hr class="my-4 border-zinc-500" /> */}

        {/* Let user toggle to create new account */}
      </form>
    </div>
  );
};

export default SigninComponent;
