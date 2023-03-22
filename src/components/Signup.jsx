import { createSignal } from "solid-js";
import { A } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { toggleShowLogin } from "../store/showLogin";
import { validate, validated } from "../helpers/validations";
import { updateUser } from "../store/user";
import logoUrl from "../../assets/logo.png";

const ErrorMessage = (props) => (
  <span class="text-sm text-right text-red-400">{props.error}</span>
);

const FIELDS = {
  username: null,
  email: null,
  password: null,
  confirmpassword: null,
};

const SignupComponent = () => {
  const [fields, setFields] = createStore();
  const [errors, setErrors] = createSignal(FIELDS);

  const updateField = (e) => {
    const name = e.currentTarget.name;
    setFields([name], e.currentTarget.value);
    setErrors((prev) => ({ ...prev, ...validate(fields, name) }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErrors(validate(fields));

    if (!validated(errors())) {
      return;
    }
    const myHeaders = new Headers();
    myHeaders.append("username", fields.username);
    myHeaders.append("password", fields.password);
    myHeaders.append("email", fields.email);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    // sign up
    try {
      const response = await fetch(
        "https://user-api.playingwithml.com/sign-up",
        requestOptions
      );
      const result = await response.json();
      console.log("signup: ", result);

      updateUser({
        loggedIn: true,
        username: fields.username,
        jwt: result["jwt"]["token"],
        expires: result["jwt"]["expiration"],
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div class="flex flex-col">
      {/* header */}
      <header class="flex flex-col items-center">
        <img src={logoUrl} alt="Neurodeploy logo" class="mb-6 ml-2 w-14" />
        <h1 class="text-3xl text-gray-200">Create your account</h1>
        <p class="mt-2 text-sm text-center max-w">
          Already registered?
          <A
            class="ml-1 font-semibold underline text-violet-400"
            href="#"
            onClick={toggleShowLogin}
          >
            Sign in
          </A>
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
          <Show when={errors().username}>
            <ErrorMessage error={errors().username} />
          </Show>
        </label>
        <input
          name="username"
          id="username"
          type="username"
          placeholder="Username"
          class="w-full p-2 mt-1 mb-4 text-black bg-zinc-300 rounded ring-indigo-900"
          required
          onInput={updateField}
          onBlur={updateField}
        />

        {/* Email */}
        <label for="email" class="flex justify-between text-gray-300">
          Email:
          <Show when={errors().email}>
            <ErrorMessage error={errors().email} />
          </Show>
        </label>
        <input
          name="email"
          id="email"
          type="email"
          placeholder="Email"
          class="w-full p-2 mt-1 mb-4 text-black bg-zinc-300 rounded"
          required
          onBlur={updateField}
          onInput={(e) => {
            errors().email && updateField(e);
          }}
        />

        {/* Password */}
        <label for="password" class="flex justify-between text-gray-300">
          Password:
          <Show when={errors().password}>
            <ErrorMessage error={errors().password} />
          </Show>
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          required
          minlength="8"
          class="w-full p-2 mt-1 mb-4 text-black bg-zinc-300 rounded"
          onInput={(e) => {
            (errors().password || errors().confirmpassword) && updateField(e);
          }}
          onBlur={updateField}
        />

        {/* Confirm password */}
        <label for="confirmpassword" class="flex justify-between text-gray-300">
          Confirm password:
          <Show when={errors().confirmpassword}>
            <ErrorMessage error={errors().confirmpassword} />
          </Show>
        </label>
        <input
          type="password"
          name="confirmpassword"
          id="confirmpassword"
          placeholder="Confirm Password"
          required
          class="w-full p-2 mt-1 mb-4 text-black bg-zinc-300 rounded"
          onInput={updateField}
          onBlur={updateField}
          onKeyUp={updateField}
        />

        {/* Terms and Conditions */}
        <div class="flex items-center mt-6 mb-2">
          <input
            id="terms-and-privacy"
            name="terms-and-privacy"
            type="checkbox"
            required
          />
          <label
            for="terms-and-privacy"
            class="block ml-2 text-sm text-gray-300"
          >
            I agree to the
            <A class="mx-1 font-semibold underline text-violet-400" href="#">
              terms
            </A>
            and
            <A class="ml-1 font-semibold underline text-violet-400" href="#">
              privacy policy
            </A>
            .
          </label>
        </div>

        {/* Submit button */}
        <div className="flex justify-center">
          <button
            type="submit"
            class="bg-violet-900 shadow-purple-800 shadow-sm w-[70%] py-2 mt-2 rounded text-gray-300"
            classList={{
              "bg-opacity-[60%] text-gray-400": !validated(errors()),
            }}
            disabled={!validated(errors())}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupComponent;
