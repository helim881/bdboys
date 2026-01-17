import { Loader } from "@/components/loader";
import { Suspense } from "react";
import AuthPage from "./components/auth";

export default function page() {
  return (
    <Suspense fallback={<Loader />}>
      <AuthPage />
    </Suspense>
  );
}
