"use client";
import { SideBarOption } from "../Components/Account/sideBarOption";
import { Navbar } from "../Components/Home/navbar";
import Link from "next/link";

import {
  UserRound,
  Wallet,
  CreditCard,
  DollarSign,
  Activity,
  TrendingUp,
  Home,
} from "lucide-react";
import { usePathname } from "next/navigation";

export const sideBarOptions = [
  { label: "Home", icon: Home, url: "/account/home" },
  { label: "My Profile", icon: UserRound, url: "/account/profile" },
  { label: "Trade", icon: DollarSign, url: "/account/trade" },
  { label: "Order History", icon: Activity, url: "/account/orders" },
  { label: "Manage Wallets", icon: Wallet, url: "/account/wallet" },
  { label: "Withdraw Funds", icon: CreditCard, url: "/account/withdraw" },
  { label: "Trading Dashboard", icon: TrendingUp, url: "/account/dashboard" },
];

export default function Account({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col  h-screen max-h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-grow overflow-hidden  ">
        <ul className="hidden flex-col gap-2 min-w-[300px] border-t dark:border-gray-600  py-2 px-2 min-[825px]:flex ">
          {sideBarOptions.map((option) => (
            <Link key={option.label} href={option.url}>
              <SideBarOption
                isActive={pathname === option.url}
                option={option}
              />
            </Link>
          ))}
        </ul>
        <div className="flex flex-col flex-1 border dark:border-gray-600">
          {children}
        </div>
      </div>
    </div>
  );
}
