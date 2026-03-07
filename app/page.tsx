import App from "../src/App";
import { getCurriculumItems } from "../src/server/curriculum";

export default async function Page() {
  const disciplinas = await getCurriculumItems("cc-2017");
  return <App disciplinas={disciplinas} />;
}
