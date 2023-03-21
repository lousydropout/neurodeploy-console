import { createSignal } from "solid-js";
const modelNull = {
  visible: false,
  modal_name: null,
};
const [deleteModal, setDeleteModal] = createSignal(modelNull);

export { modelNull, deleteModal, setDeleteModal };
