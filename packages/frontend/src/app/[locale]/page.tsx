import Main from "@/components/Main";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('https://localhost:443/api/auth/signin');
  }
  return (
    <Main />
  )
}