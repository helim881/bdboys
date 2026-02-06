import Breadcrumb from "@/components/breadcumb";
import prisma from "@/lib/db";
import AdminSettings from "./SettingsForm";
export default async function page() {
  const settings = await prisma.setting.findFirst({
    where: { id: 1 },
  });

  return (
    <div>
      <Breadcrumb />
      <AdminSettings settings={settings} />
    </div>
  );
}
