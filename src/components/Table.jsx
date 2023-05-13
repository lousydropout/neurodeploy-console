import { A } from "@solidjs/router";
import { formatDatetime } from "../helpers/formatTime";
import { For } from "solid-js";

const FormattedJSON = (props) => {
  const { jsonString } = props;
  const parsedJSON = JSON.parse(jsonString);
  const formattedJSON = JSON.stringify(parsedJSON, null, 2);

  return (
    <pre class="whitespace-pre-wrap max-h-32 overflow-auto">
      {formattedJSON}
    </pre>
  );
};

const Checkmark = () => (
  <svg
    class="h-4 w-4 text-green-500 inline-block"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fill-rule="evenodd"
      d="M18.293 5.293a1 1 0 00-1.414-1.414L7 14.586 3.707 11.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l12-12z"
      clip-rule="evenodd"
    />
  </svg>
);

const X = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="w-4 h-4 text-red-500"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export const Table = (props) => {
  const headers = [
    "",
    "Timestamp",
    "Status Code",
    "Duration",
    "Output / Error",
    "Link",
  ];

  return (
    <div class="">
      <table class="table-fixed bg-zinc-800 text-white">
        <thead class="text-violet-400 bg-opacity-40 border-b-2 border-b-zinc-200">
          <tr class="items-center">
            <For each={headers}>
              {(header) => (
                <th class="px-4 py-2 font-medium text-left">{header}</th>
              )}
            </For>
          </tr>
        </thead>
        <tbody class="">
          <For each={props.logs}>
            {(log) => (
              <tr
                class="border-b border-zinc-600 items-center"
                classList={{
                  "text-red-300": Math.floor(log.status_code / 100) > 2,
                }}
              >
                {/* Checkmark or an X */}
                <td class="px-4 py-4">
                  <Show
                    when={Math.floor(log.status_code / 100) === 2}
                    fallback={<X />}
                  >
                    <Checkmark />
                  </Show>
                </td>

                {/* Datetime, formatted to local time */}
                <td class="px-4 py-4">{formatDatetime(log.timestamp)}</td>

                {/* Status code */}
                <td
                  class="px-4 py-4"
                  classList={{
                    "font-bold": Math.floor(log.status_code / 100) > 2,
                  }}
                >
                  {log.status_code}
                </td>
                <td class="px-4 py-4">{log.duration} ms</td>

                {/* Input */}
                {/* <td class="px-4 py-4">
                    <FormattedJSON jsonString={log.input || ""} />
                  </td> */}

                {/* Output */}
                <td class="px-4 py-4">{log.output || log.error}</td>

                {/* Click for more */}
                <td class="px-4 py-4 text-center">
                  <A
                    href={`/models/${props.model_name}/${log.timestamp}`}
                    class="border border-violet-500 text-violet-500 hover:border-violet-600 hover:text-violet-500 font-bold py-1 px-2 rounded-lg"
                  >
                    More
                  </A>
                </td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
};
