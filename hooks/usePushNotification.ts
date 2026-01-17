export function urlBase64ToUint8Array(base64String: string) {
  if (!base64String || typeof base64String !== "string") {
    throw new Error("VAPID public key missing or invalid");
  }

  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  try {
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
  } catch (err) {
    console.error("Base64 decode failed:", base64String);
    throw err;
  }
}
