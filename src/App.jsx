import { Routes, Route } from "@solidjs/router";
import { lazy } from "solid-js";

const Home = lazy(() => import("./pages/Home"));
const Models = lazy(() => import("./pages/Models"));
const Settings = lazy(() => import("./pages/Settings"));

function App() {
  return (
    <Routes>
      <Route path="/" component={Home}></Route>
      <Route path="/models" component={Models}></Route>
      <Route path="/settings" component={Settings}></Route>
    </Routes>
  );
}

export default App;
