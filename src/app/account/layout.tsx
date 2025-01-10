"use client";
import { SideBarOption } from "../Components/Account/sideBarOption";
import { Navbar } from "../Components/Home/navbar";
import Link from "next/link";
import { UserRound, DollarSign, Activity, Home } from "lucide-react";
import { usePathname } from "next/navigation";

const sideBarOptions = [
  { label: "Home", icon: Home, url: "/account/home" },
  { label: "Trade", icon: DollarSign, url: "/account/trade" },
  { label: "Order History", icon: Activity, url: "/account/orders" },
  { label: "My Profile", icon: UserRound, url: "/account/profile" },
  // { label: "Manage Wallets", icon: Wallet, url: "/account/wallet" },
  // { label: "Withdraw Funds", icon: CreditCard, url: "/account/withdraw" },
  // { label: "Trading Dashboard", icon: TrendingUp, url: "/account/dashboard" },
];

export default function Account({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-grow overflow-hidden  ">
        <ul className="hidden flex-col gap-2  border-t dark:border-gray-600  py-2 px-2 min-[600px]:flex ">
          {sideBarOptions.map((option) => (
            <Link key={option.label} href={option.url}>
              <SideBarOption
                isActive={pathname === option.url}
                option={option}
              />
            </Link>
          ))}
        </ul>
        <div className="flex flex-col border-t flex-1 min-[600px]:border dark:border-gray-600">
          {children}
        </div>
      </div>
    </div>
  );
}
