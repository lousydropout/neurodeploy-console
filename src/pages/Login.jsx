import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";

const ErrorMessage = (props) => (
  <span class="text-red-400 text-right text-sm">{props.error}</span>
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

  // field validations
  const validateUsername = () => {
    if (!fields.username) return "Please enter a username";
    if (/^[a-zA-Z0-9]+$/.test(fields.username)) {
      return true;
    }
    return "Username must consist solely of alphanumeric characters";
  };

  const validateEmail = () => {
    if (!fields.email) return "Please enter an email";
    if (
      /^[A-Za-z0-9+_.-]+\@[A-Za-z0-9.-]+.[A-Za-z0-9.-]+$/.test(fields.email)
    ) {
      return true;
    }
    return "Please enter a valid email";
  };

  const validatePassword = () => {
    if (!fields.password) return "Please enter a password";
    if (fields.password.length >= 8) {
      return true;
    }
    return "Password must be at least 8 characters long";
  };

  const confirmPassword = () => {
    if (fields.password === fields.confirmpassword) {
      return true;
    }
    return "Passwords must match";
  };

  const validateFunctions = {
    username: validateUsername,
    email: validateEmail,
    password: validatePassword,
    confirmpassword: confirmPassword,
  };

  const validate = (name = null) => {
    if (name === "password") {
      return {
        password: validateFunctions.password(),
        confirmpassword: validateFunctions.confirmpassword(),
      };
    } else if (name)
      return {
        [name]: validateFunctions[name](),
      };

    return {
      username: validateFunctions.username(),
      email: validateFunctions.email(),
      password: validateFunctions.password(),
      confirmpassword: validateFunctions.confirmpassword(),
    };
  };

  const validated = () => {
    let result = true;
    for (const x of Object.values(errors())) {
      if (x !== true) result = false;
    }
    return result;
  };

  const updateField = (e) => {
    const name = e.currentTarget.name;
    setFields([name], e.currentTarget.value);
    setErrors((prev) => ({ ...prev, ...validate(name) }));
  };

  const submit = (e) => {
    e.preventDefault();
    setErrors(validate());

    if (!validated()) {
      return;
    }
    console.log("valid");
  };

  return (
    <form class="h-fit w-96 rounded-md bg-zinc-600 p-6" onSubmit={submit}>
      <h1 class="text-2xl text-center">Sign Up</h1>
      <hr class="my-4 border-zinc-500" />

      {/* username */}
      <label for="username" class="flex justify-between">
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
        class="text-black p-2 mt-1 mb-4 rounded w-full"
        required
        onInput={updateField}
        onBlur={updateField}
      />

      {/* Email */}
      <label for="email" class="flex justify-between">
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
        class="text-black p-2 mt-1 mb-4 rounded w-full"
        required
        onBlur={updateField}
        onInput={(e) => {
          errors().email && updateField(e);
        }}
      />

      {/* Password */}
      <label for="password" class="flex justify-between">
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
        class="text-black p-2 mt-1 mb-4 rounded w-full"
        onInput={(e) => {
          (errors().password || errors().confirmpassword) && updateField(e);
        }}
        onBlur={updateField}
      />

      {/* Confirm password */}
      <label for="confirmpassword" class="flex justify-between">
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
        class="text-black p-2 mt-1 mb-4 rounded w-full"
        onInput={updateField}
        onBlur={updateField}
        onKeyUp={updateField}
      />

      {/* Submit button */}
      <div className="flex justify-start">
        <button
          type="submit"
          class="bg-blue-600 px-6 py-2 mt-6 rounded"
          classList={{
            "bg-opacity-70": !validated(),
            "text-gray-300": !validated(),
            "text-opacity-80": !validated(),
          }}
          disabled={!validated()}
        >
          Submit
        </button>
      </div>
      <hr class="my-4 border-zinc-500" />

      {/* Let user toggle to create new account */}
    </form>
  );
};

const Login = () => {
  const [showLogin, setShowLogin] = createSignal(false);

  return (
    <div class="h-full bg-gray-800">
      <div class="flex justify-center mt-24">
        <Show when={showLogin} fallback={SignupComponent}>
          <SignupComponent />
        </Show>
      </div>
    </div>
  );
};

export default Login;
