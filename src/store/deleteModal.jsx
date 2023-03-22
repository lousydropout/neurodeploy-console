import { createSignal } from "solid-js";
const modelNull = {
  visible: false,
  model_name: "",
};
const [deleteModal, setDeleteModal] = createSignal(modelNull);

export { modelNull, deleteModal, setDeleteModal };
