import { useParams } from "@solidjs/router";
import { setLocation } from "../../../store/location";
import { USER_API_URL } from "../../../params/params";
import { Show, createEffect, createSignal } from "solid-js";
import { user } from "../../../store/user";
import { Loading } from "../../../components/Modals";
import { Breadcrumbs } from "../../../components/Breadcrumbs";

export default function () {
  setLocation("Models");
  const params = useParams();

  const [log, setLog] = createSignal({
    ready: false,
    input: null,
    output: null,
    error: null,
    duration: null,
    startTime: null,
  });

  const getLog = async (token) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(
      `${USER_API_URL}/ml-models/${params.model_name}/logs/${params.timestamp}`,
      requestOptions
    );
    const results = await response.json();

    console.log("results: ", results);

    setLog({
      ...results,
      startTime: params.timestamp,
      modelName: params.model_name,
      statusCode: results.status_code,
    });

    // download file
    const logResponse = await fetch(results.location);
    console.log("logResponse: ", logResponse);
    if (!logResponse.ok) {
      throw new Error("Failed to download file");
    }
    const jsonString = await logResponse.json();
    console.log("jsonString: ", jsonString);
    setLog((prev) => ({ ...prev, jsonString, ready: true }));
  };

  getLog(user().jwt);

  const pages = [
    { link: "/models", name: "Models" },
    { link: `/models/${params.model_name}`, name: `${params.model_name} logs` },
    { link: null, name: `${params.timestamp}` },
  ];

  const FormattedJSON = (props) => {
    console.log("props: ", props);
    const { jsonString } = props;
    console.log("jsonString: ", jsonString);
    // const parsedJSON = JSON.parse(jsonString);
    const formattedJSON = JSON.stringify(jsonString, null, 2);
    console.log("formattedJSON: ", formattedJSON);

    return (
      <pre class="whitespace-pre-wrap border bordeer-4 border-zinc-600 mt-4 p-4">
        {formattedJSON}
      </pre>
    );
  };

  return (
    <>
      <Breadcrumbs pages={pages} />
      <Show when={log().ready} fallback={<Loading />}>
        {/* <h3>Input</h3>
        <p>{log().input}</p>
        <h3>output</h3>
        <p>{log().output}</p>
        <h3>error</h3>
        <p>{log().error}</p>
        <h3>duration</h3>
        <p>{log().duration}</p>
        <h3>status code</h3>
        <p>{log().statusCode}</p> */}

        <FormattedJSON jsonString={log().jsonString} />
      </Show>
    </>
  );
}
