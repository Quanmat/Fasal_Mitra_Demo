import { redirect } from "next/navigation";

export default function SignupPage() {
  redirect("/signup/verify-email");
}
