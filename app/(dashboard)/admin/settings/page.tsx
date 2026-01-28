import { NotFound } from "@/components/not-found";
import prisma from "@/lib/db";
import AdminSettings from "./SettingsForm";
export default async function page() {
  const settings = await prisma.setting.findFirst({
    where: { id: 1 },
  });
  if (!settings) {
    return <NotFound />;
  }
  return <AdminSettings settings={settings} />;
}
