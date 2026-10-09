import { redirect } from "next/navigation";

// The demo has no sign-in; everyone uses the fixed demo host.
export default function LoginPage() {
  redirect("/dashboard");
}
