import App from "../src/App";
import { DEFAULT_FLOW_CODE } from "../src/config/flow";
import { getFlowItems } from "../src/server/flow";

export default async function Page() {
  const disciplinas = await getFlowItems(DEFAULT_FLOW_CODE);
  return <App disciplinas={disciplinas} flowCode={DEFAULT_FLOW_CODE} />;
}
