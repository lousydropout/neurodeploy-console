// field validations
const validateUsername = (fields) => {
  if (!fields.username) return "Please enter a username";
  if (/^[a-zA-Z0-9]+$/.test(fields.username)) {
    return true;
  }
  return "Username must consist solely of alphanumeric characters";
};

const validateEmail = (fields) => {
  if (!fields.email) return "Please enter an email";
  if (/^[A-Za-z0-9+_.-]+\@[A-Za-z0-9.-]+.[A-Za-z0-9.-]+$/.test(fields.email)) {
    return true;
  }
  return "Please enter a valid email";
};

const validatePassword = (fields) => {
  if (!fields.password) return "Please enter a password";
  if (fields.password.length >= 8) {
    return true;
  }
  return "Password must be at least 8 characters long";
};

const confirmPassword = (fields) => {
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

const validated = (errors) => {
  let result = true;
  for (const x of Object.values(errors)) {
    if (x !== true) result = false;
  }
  return result;
};

export { validate, validated };
