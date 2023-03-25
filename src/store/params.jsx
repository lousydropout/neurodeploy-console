import { createStore } from "solid-js/store";

const [params, setParams] = createStore({ domainName: "neurodeploy.com" });

export { params };
