import { A } from "@solidjs/router";
import { createSignal, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { user } from "../store/user";

const USER_API = "https://user-api.playingwithml.com";

export default function () {
  const [error, setError] = createSignal(null);
  const [fields, setFields] = createStore(null);

  createEffect(() => console.log("fields: ", { ...fields }));

  const updateField = (e) => {
    const name = e.currentTarget.name;
    setFields([name], e.currentTarget.value);
  };

  const submit = async (e) => {
    e.preventDefault();

    // make sure that all fields are present
    if (!("model_name" in fields)) {
      setError("Please provide a model name");
      return;
    }
    if (!("model_type" in fields)) {
      setError("Please select a (model_type, file_format) combo");
      return;
    }
    if (!("file" in fields)) {
      setError("Please select your ML model's file");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${user().jwt}`);
    const requestOptions = { method: "PUT", headers: myHeaders };

    // Get presigned PUT url
    try {
      const response = await fetch(
        `${USER_API}/ml-models/${fields.model_name}?model_type=${fields.model_type}&persistence_type=${fields.persistence_type}`,
        requestOptions
      );
      const results = await response.json();

      // Upload file
      const formdata = new FormData();
      Object.entries(results.fields).forEach(([k, v]) => {
        formdata.append(k, v);
      });
      formdata.append("file", fields.file);

      const uploadOptions = { method: "POST", body: formdata };

      const upload_resonse = await fetch(results.url, uploadOptions);
    } catch (e) {
      console.error(e);
    }

    window.location.href = "/models";
  };

  const handleClickOrDrop = async (f) => {
    setFields("file", f);
    const results = await fetch(f);
    console.log("results: ", results);
  };

  return (
    <>
      <h2 class="mb-10 text-3xl underline">Create model</h2>

      <div class="flex flex-col items-center">
        <form
          class="px-8 py-10 h-fit w-[40rem] max-w-full rounded-md bg-zinc-700"
          onSubmit={submit}
        >
          {/* username */}
          <label for="model-name" class="flex justify-between text-gray-300 ">
            Model name:
          </label>
          <input
            name="model_name"
            id="model-name"
            type="text"
            placeholder="model name"
            class="w-full p-2 mt-1 mb-4 text-black rounded ring-indigo-900"
            required
            onInput={updateField}
          />

          {/* model type */}
          <label for="model-type" class="flex justify-between text-gray-300 ">
            Model type + file format:
          </label>
          <select
            class="mt-1 mb-4 w-full px-3 py-2 rounded cursor-pointer  text-black"
            name="model-type"
            id="model-type"
            required
            onChange={(e) => {
              const [model_type, persistence_type] =
                e.currentTarget.value.split("|");
              setFields("model_type", model_type);
              setFields("persistence_type", persistence_type);
            }}
          >
            <option value="" disabled selected>
              Select a (model_type, file_format) combination
            </option>
            <option value="scikit-learn|pickle">(Scikit-learn, pickle)</option>
            <option value="tensorflow|h5">(Tensorflow, h5)</option>
          </select>

          {/* file upload */}
          <Show
            when={fields.file}
            fallback={
              <div class="flex w-full justify-between items-center text-gray-300 ">
                <span>Upload your model:</span>
              </div>
            }
          >
            <div class="flex items-center justify-between">
              <div class="">
                File: <span class=" mx-1 underline">{fields.file.name}</span>
              </div>
              <button
                // class="underline text-red-500 px-4 py-1 cursor-pointer"
                class="border border-red-600 text-red-600 rounded px-4 py-1 cursor-pointer"
                onClick={(e) => setFields("file", null)}
              >
                remove file
              </button>
            </div>
          </Show>

          {/* drag and drop */}
          <Show when={!fields.file}>
            <label
              for="model-file"
              class="h-80 w-full flex justify-center mt-1 mb-4 items-center border-gray-400 border-dashed border rounded hover:bg-zinc-500 cursor-pointer"
              onDragEnter={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              onDragEnd={(e) => e.preventDefault()}
              onDragExit={(e) => e.preventDefault()}
              onDragLeave={(e) => e.preventDefault()}
              onDragOver={(e) => e.preventDefault()}
              onChange={(e) => {
                e.preventDefault();
                const f = e.explicitOriginalTarget.files[0];
                handleClickOrDrop(f);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                handleClickOrDrop(f);
              }}
            >
              <p class="text-gray-300 text-lg font-semibold cursor-pointer">
                Select File...
              </p>
              <input id="model-file" class="w-fit p-4" type="file" />
            </label>
          </Show>

          {/* Submit button */}
          <div className="flex justify-center">
            <button
              type="submit"
              class="text-lg text-violet-500 border-violet-500 border shadow-sm drop-shadow-lg w-[70%] py-2 mt-10 rounded"
            >
              Create
            </button>
          </div>
          {/* Show errors */}
          <Show when={error()}>
            <div class="mt-4 flex justify-center text-red-400">{error()}</div>
          </Show>
        </form>
      </div>
    </>
  );
}