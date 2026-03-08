import App from "../src/App";
import { DEFAULT_FLOW_CODE } from "../src/config/flow";

export default async function Page() {
  return <App initialFlowCode={DEFAULT_FLOW_CODE} />;
}
