import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { clickOutside } from "../helpers/modals";
import { modalNull, setModal } from "../store/modal";
import { params } from "../store/params";
import { user } from "../store/user";
import axios from "axios";
const USER_API = `https://user-api.${params.domainName}`;

const CreateModelModal = (props) => {
  const { filename, uploadProgress } = props;
  const uploaded = () => uploadProgress() === 100;
  const gotoModelPage = () => {
    setModal(modalNull);
    window.location.href = "/models";
  };
  return (
    <div class="modal flex-col space-y-8" use:clickOutside={gotoModelPage}>
      <h1 class="text-2xl text-center mb-12">Uploading model</h1>
      <div class="space-y-2 flex flex-col">
        <div class="flex justify-between">
          <span class="font-semibold">
            {filename || "<filename-missing error>"}
          </span>
          <span class=" self-end">{uploadProgress()}%</span>
        </div>
        <div class="w-full bg-zinc-600">
          <div
            class={`h-6 bg-violet-600`}
            style={{ width: `${uploadProgress()}%` }}
          ></div>
        </div>
      </div>
      <div class="flex justify-end">
        <button
          class="justify-self-end mt-4 px-4 py-2 text-lg border min-w-fit w-[40%] rounded"
          classList={{
            "text-normal text-violet-400 border-violet-400 text-opacity-50 border-opacity-50 font-light":
              !uploaded(),
            "font-bold text-violet-500 border-violet-500 hover:text-violet-300 hover:border-violet-300":
              uploaded(),
          }}
          onClick={gotoModelPage}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default function () {
  const [error, setError] = createSignal(null);
  const [fields, setFields] = createStore(null);
  const updateField = (e) => {
    const name = e.currentTarget.name;
    setFields([name], e.currentTarget.value);
  };
  const updateCheckbox = (e) => {
    const name = e.currentTarget.name;
    setFields([name], e.currentTarget.checked);
  };

  const [uploadProgress, setUploadProgress] = createSignal(0);
  const updateUploadProgress = (e) => {
    setUploadProgress(Math.round((100 * e.loaded) / e.total));
  };

  const submit = async (e) => {
    e.preventDefault();

    // make sure that all fields are present
    if (!("model_name" in fields)) {
      setError("Please provide a model name");
      return;
    }
    if (!("lib" in fields)) {
      setError("Please select an (ML library, Filetype) combination");
      return;
    }
    if (!("file" in fields)) {
      setError("Please select your ML model's file");
      return;
    }

    // set modal
    setModal({
      visible: true,
      content: (
        <CreateModelModal
          filename={fields.file.name}
          uploadProgress={uploadProgress}
        />
      ),
    });

    // Get presigned PUT url
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${user().jwt}`);
    const requestOptions = { method: "PUT", headers: myHeaders };
    try {
      const response = await fetch(
        `${USER_API}/ml-models/${fields.model_name}?lib=${fields.lib}&filetype=${fields.filetype}&is_public=${fields.is_public}`,
        requestOptions
      );
      const results = await response.json();
      console.log("results: ", results);

      // Upload file
      const formdata = new FormData();
      Object.entries(results.fields).forEach(([k, v]) => {
        formdata.append(k, v);
      });
      formdata.append("file", fields.file);

      await axios.post(results.url, formdata, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: updateUploadProgress,
      });
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

          {/* lib */}
          <label for="lib" class="flex justify-between text-gray-300 ">
            ML library + File type:
          </label>
          <select
            class="mt-1 mb-4 w-full px-3 py-2 rounded cursor-pointer text-black"
            name="lib"
            id="lib"
            required
            onChange={(e) => {
              const [lib, filetype] = e.currentTarget.value.split("|");
              setFields("lib", lib);
              setFields("filetype", filetype);
            }}
          >
            <option value="" disabled selected>
              Select an (ML library, Filetype) combination
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
                const f = e.target.files[0];
                handleClickOrDrop(f);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                handleClickOrDrop(f);
              }}
              onKeyDown={(e) => {
                e.preventDefault();
                if (e.code === "Space" || e.code === "Enter") {
                  // if they hit space or enter
                  const x = e.target.querySelector("input#model-file");
                  x.click();
                } else if (e.code === "Tab" && e.shiftKey) {
                  // if they hit shift-tab
                  const x = document.getElementById("lib");
                  x.focus();
                } else if (e.code === "Tab" && !e.shiftKey) {
                  // if they hit tab
                  const x = document.getElementById("is_public");
                  x.focus();
                } else if (e.code === "KeyR") {
                  // if they hit ctrl-r
                  window.location.reload();
                }
              }}
              tabIndex="0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="0.4"
                stroke="currentColor"
                class="w-20 h-20"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
              </svg>

              <p class="text-gray-300 text-lg cursor-pointer text-center">
                <span class="font-semibold">Drag & drop</span>
                <br />
                or
                <br />
                Browse file
              </p>
              <input id="model-file" class="w-fit p-4" type="file" />
            </label>
          </Show>

          {/* Check if open to public */}
          <div class="flex items-center mt-6 mb-2">
            <input
              id="is_public"
              name="is_public"
              type="checkbox"
              onInput={updateCheckbox}
            />
            <label for="is_public" class="block ml-2 text-sm text-gray-300">
              Allow public to execute model without API key
            </label>
          </div>

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
