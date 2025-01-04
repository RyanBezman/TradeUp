import Account from "./account/layout";
import { Hero } from "./Components/Home/hero";
import { Navbar } from "./Components/Home/navbar";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = cookies();
  const userCookie = (await cookieStore).get("sessionToken")?.value;
  const isUserSignedIn = userCookie?.length;
  if (isUserSignedIn) {
    return (
      <div className="flex flex-col w-full ">
        <Account />
      </div>
    );
  }
  return (
    <div className=" flex flex-col w-full">
      <Navbar />
      <Hero />
    </div>
  );
}
