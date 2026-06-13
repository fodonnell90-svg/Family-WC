import Dashboard from "@/components/Dashboard";
import { getLivePayload } from "@/lib/standings";

export const dynamic = "force-dynamic";

export default async function Page() {
  const payload = await getLivePayload();
  return <Dashboard initial={payload} />;
}
