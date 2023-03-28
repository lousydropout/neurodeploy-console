import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { params } from "../store/params";
import { user } from "../store/user";

const USER_API = `https://user-api.${params.domainName}`;

export default function () {
  const [error, setError] = createSignal(null);
  const [fields, setFields] = createStore(null);

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

      await fetch(results.url, uploadOptions);

      window.location.href = "/models";
    } catch (e) {
      console.error(e);
    }
  };

  const handleClickOrDrop = async (f) => setFields("file", f);

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
            <option value="scikit-learn|joblib">(Scikit-learn, joblib)</option>
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
                class="border border-red-600 text-red-600 hover:border-red-500 hover:text-red-500 rounded px-4 py-1 cursor-pointer"
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
              class="h-80 w-full flex flex-col justify-center mt-1 mb-4 items-center border-gray-400 border-dashed border rounded hover:bg-zinc-600 cursor-pointer"
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1"
                stroke="currentColor"
                class="w-20 h-20"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
              </svg>

              <p class="text-gray-300 text-lg font-semibold cursor-pointer text-center">
                <span class="font-bold">Drag & drop</span>
                <br />
                or
                <br />
                Browse file
              </p>
              <input id="model-file" class="w-fit p-4" type="file" />
            </label>
          </Show>

          {/* Submit button */}
          <div className="flex justify-center">
            <button
              type="submit"
              class="text-lg text-violet-500 border-violet-500 hover:text-violet-400 hover:border-violet-400 border shadow-sm drop-shadow-lg w-[70%] py-2 mt-10 rounded"
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
