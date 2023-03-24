import { Routes, Route } from "@solidjs/router";
import { lazy } from "solid-js";

const Home = lazy(() => import("./pages/Home"));
const Model = lazy(() => import("./pages/models/[model_name]"));
const Models = lazy(() => import("./pages/Models"));
const CreateModel = lazy(() => import("./pages/CreateModel"));
const Settings = lazy(() => import("./pages/Settings"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));

function App() {
  return (
    <Routes>
      <Route path="/" component={Home}></Route>
      <Route path="/models" component={Models}></Route>
      <Route path="/create_model" component={CreateModel}></Route>
      <Route path="/models/:model_name" component={Model}></Route>
      <Route path="/settings" component={Settings}></Route>
      <Route path="/privacy" component={Privacy}></Route>
      <Route path="/terms" component={Terms}></Route>
    </Routes>
  );
}

export default App;
