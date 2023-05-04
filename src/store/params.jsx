import { createStore } from "solid-js/store";

const [params, setParams] = createStore({ domainName: "playingwithml.com" });

export { params };
