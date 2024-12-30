import { InfoCard } from "@/app/Components/Account/infoCard";
import { ProfileCard } from "@/app/Components/Account/profileCard";
import Account from "../page";

export default function Profile() {
  return (
    <Account>
      <ProfileLayout />
    </Account>
  );
}
export function ProfileLayout() {
  return (
    <div className="bg-white dark:bg-black  rounded-xl flex flex-col p-1 min-[455px]:p-8 flex-1 overflow-auto">
      <h2 className="text-3xl font-bold mb-6  dark:text-white text-black">
        My Profile
      </h2>
      <ProfileCard />
      <InfoCard title="Personal Information" />
    </div>
  );
}
