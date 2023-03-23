import { showLogin } from "../store/showLogin";
import Signin from "../components/Signin";
import Signup from "../components/Signup";
import { grabfromCache } from "../store/user";

const Login = () => {
  grabfromCache();

  return (
    <div class="h-full bg-zinc-800">
      <div class="flex justify-center mt-24">
        <Show when={showLogin()} fallback={Signup}>
          <Signin />
        </Show>
      </div>
    </div>
  );
};

export default Login;
