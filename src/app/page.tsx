import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdventureRacingClub from '@/components/adventure-racing-club'

export default async function Home() {
  const user = await currentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div>
      <AdventureRacingClub/>
    </div>
  );
}
