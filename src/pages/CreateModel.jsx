import { A } from "@solidjs/router";
import { createSignal, createEffect } from "solid-js";
import { createStore } from "solid-js/store";

export default function () {
  const [error, setError] = createSignal(null);
  const [fields, setFields] = createStore();

  createEffect(() => console.log("fields: ", { ...fields }));

  const updateField = (e) => {
    const name = e.currentTarget.name;
    setFields([name], e.currentTarget.value);
  };

  const submit = async (e) => {
    e.preventDefault();
    if ("mo")
      if ("file" in fields) {
        console.log("file in fields");
      } else {
        console.log("file not in fields");
      }

    console.log("submit: ", { ...fields });
  };

  const handleClickOrDrop = (f) => {
    setFields("file", f);
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
            Model + persistence type:
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
              Select a Language
            </option>
            <option value="scikit-learn|pickle">Scikit-learn + pickle</option>
            <option value="tensorflow|h5">Tensorflow + h5</option>
          </select>

          {/* file upload */}
          <h3 class="flex justify-between text-gray-300 ">
            Upload your model:
          </h3>
          {/* drag and drop */}
          <label
            for="model-file"
            class=" h-80 w-full flex justify-center mt-1 mb-4 items-center  text-gray-300 border-gray-400 border-dashed border-2 rounded hover:bg-zinc-500 cursor-pointer"
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
            <p class="flex justify-between text-gray-300 text-lg font-semibold cursor-pointer">
              Browse...
            </p>

            <input id="model-file" class="w-fit p-4" type="file" />
          </label>

          {/* Submit button */}
          <div className="flex justify-center">
            <button
              type="submit"
              class="text-lg font-semibold text-violet-500 border-violet-500 border-2 shadow-sm drop-shadow-lg w-[70%] py-2 mt-10 rounded"
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
