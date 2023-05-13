import { useParams } from "@solidjs/router";
import { setLocation } from "../../../store/location";
import { USER_API_URL } from "../../../params/params";

export default function () {
  setLocation("Models");
  const params = useParams();

  const link = `${USER_API_URL}/ml-models/${params.model_name}/logs/${params.timestamp}`;

  return (
    <>
      <h1>
        {params.model_name} - {params.timestamp}
      </h1>
      <h3>{link}</h3>
    </>
  );
}
