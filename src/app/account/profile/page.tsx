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
    <div className="bg-white dark:bg-black  rounded-xl flex flex-col p-8 flex-1">
      <h2 className="text-3xl font-bold mb-6 pt-8 dark:text-white text-black">
        My Profile
      </h2>
      <ProfileCard />
      <InfoCard title="Personal Information" />
    </div>
  );
}
