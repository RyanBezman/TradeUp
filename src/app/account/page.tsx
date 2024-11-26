import { InfoCard } from "../Components/Account/infoCard";
import { ProfileCard } from "../Components/Account/profileCard";
import { SideBarOption } from "../Components/Account/sideBarOption";
import { Navbar } from "../Components/Home/navbar";

import {
  UserRound,
  Wallet,
  CreditCard,
  DollarSign,
  Activity,
  Lock,
  TrendingUp,
} from "lucide-react";

export const sideBarOptions = [
  { label: "My Profile", icon: UserRound },
  { label: "Manage Wallets", icon: Wallet },
  { label: "Withdraw Funds", icon: CreditCard },
  { label: "Trading Dashboard", icon: TrendingUp },
  { label: "Order History", icon: Activity },
  { label: "Portfolio", icon: DollarSign },
  { label: "Security Center", icon: Lock },
];
export default function Account() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <div className="hidden flex-col gap-2 min-w-[300px] min-[705px]:flex ">
          {sideBarOptions.map((option) => (
            <SideBarOption key={option.label} option={option} />
          ))}
        </div>
        <div className="flex flex-col rounded-2xl bg-gray-100 dark:bg-zinc-950 p-1 min-[760px]:p-8 flex-1">
          <h1 className="text-3xl font-bold dark:text-white text-black hover:dark:text-white hover:text-violet-600">
            Account
          </h1>
          <div className="bg-white dark:bg-black mt-8 rounded-xl flex flex-1">
            <div className="flex flex-1">
              <div className=" flex-col gap-2 hidden min-[1080px]:flex  min-w-[300px] pt-16 border-gray-300 dark:border-gray-600">
                {sideBarOptions.map((option) => (
                  <SideBarOption key={option.label} option={option} />
                ))}
              </div>
              <div className="flex flex-1 flex-col px-8">
                <h2 className="text-2xl font-bold mb-6 pt-8 dark:text-white text-black">
                  My Profile
                </h2>
                <ProfileCard />
                <InfoCard title="Personal Information" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
