import { useParams } from "@solidjs/router";
import { setLocation } from "../../store/location";

export default function () {
  setLocation("Models");
  const params = useParams();
  const model_name = params.model_name;

  return <h1>{model_name}</h1>;
}
