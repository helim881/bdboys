import { notFound } from "next/navigation";
import ProfilePage from "../tabs";

interface PageProps {
  params: {
    id: string;
  };
}

async function getUser(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`,
    {
      cache: "no-store", // important
    },
  );

  if (!res.ok) {
    return null;
  }

  const json = await res.json();
  return json;
}

export default async function Page({ params }: PageProps) {
  const { id } = params;

  if (!id) notFound();

  const json = await getUser(id);

  return (
    <div className="bg-gray-100 min-h-screen">
      <ProfilePage user={json?.data} postCount={json.postCount} />
    </div>
  );
}
