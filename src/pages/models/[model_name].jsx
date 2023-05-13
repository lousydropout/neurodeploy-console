import { useParams } from "@solidjs/router";
import { createSignal } from "solid-js";
import { user } from "../../store/user";
import { setLocation } from "../../store/location";
import { USER_API_URL } from "../../params/params";
import { Loading } from "../../components/Modals";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Pagination } from "../../components/Pagination";
import { Table } from "../../components/Table";

export default function () {
  setLocation("Models");
  const model_name = useParams().model_name;
  const [logs, setLogs] = createSignal({
    ready: false,
    logs: [],
    pages: [],
    hasNext: false,
    hasPrevious: false,
    latestHasNext: null,
  });

  const getLogs = async (token, next = false, previous = false) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      let append = "";
      if (logs().hasNext && next) {
        const currentFirst = logs().logs[0];
        const filtered = logs().logs.filter((x) => x < currentFirst);
        if (filtered.length > 0) {
          append = `start-from=${filtered[0]}`;
        } else {
          append = `start-from=${
            logs().logs[logs().logs.length - 1].timestamp
          }&inclusive=false`;
        }
      } else if (logs().pages && previous) {
        const currentFirst = logs().logs[0].timestamp;
        const filtered = logs()
          .pages.sort()
          .filter((x) => x > currentFirst);
        append = `start-from=${filtered[0]}`;
      }

      const response = await fetch(
        `${USER_API_URL}/ml-models/${model_name}/logs?sort-by=desc&${append}`,
        requestOptions
      );
      const results = await response.json();

      if (results.logs.length === 0) {
        setLogs((prev) => ({
          ...prev,
          hasNext: false,
          nextToken: null,
          ready: true,
        }));
        return;
      }

      const latestHasNext =
        results.logs.length > 0
          ? results.logs[0].timestamp
          : logs().latestHasNext;

      let hasPrevious = false;
      if (logs().pages.length > 0) {
        const currentFirst = results.logs[0].timestamp;
        const filtered = logs().pages.filter((x) => x > currentFirst);
        hasPrevious = filtered.length > 0;
      }

      setLogs((prev) => ({
        ready: true,
        logs: results.logs,
        pages: prev.pages.includes(results.logs[0].timestamp)
          ? prev.pages
          : [...prev.pages, results.logs[0].timestamp],
        hasNext: "next_token" in results ? results.next_token !== null : false,
        nextToken: "next_token" in results ? results.next_token : null,
        hasPrevious,
        latestHasNext,
      }));
    } catch (err) {
      console.error("error", err);
    }
  };

  const pages = [
    { link: "/models", name: "Models" },
    { link: null, name: `${model_name} logs` },
  ];

  getLogs(user().jwt, false, false);
  return (
    <div class="flex flex-col h-full w-fit">
      <Breadcrumbs pages={pages} />

      <Switch fallback={<Loading />}>
        {/* let user know if no models were found */}
        <Match when={logs().ready && logs().logs.length === 0}>
          <div>No logs found</div>
        </Match>

        {/* Show list of logs */}
        <Match when={logs().ready && logs().logs.length > 0}>
          <Table logs={logs().logs} model_name={model_name} />
        </Match>
      </Switch>

      <Pagination
        model_name={model_name}
        token={user().jwt}
        logs={logs}
        getNext={() => getLogs(user().jwt, true, false)}
        getPrevious={() => getLogs(user().jwt, false, true)}
      />
    </div>
  );
}
