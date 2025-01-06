"use client";

import {
  Activity,
  CreditCard,
  Divide,
  DollarSign,
  Home,
  Menu,
  TrendingUp,
  UserRound,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { SideBarOption } from "../Account/sideBarOption";
import Link from "next/link";
import { usePathname } from "next/navigation";
const sideBarOptions = [
  { label: "Home", icon: Home, url: "/account/home" },
  { label: "My Profile", icon: UserRound, url: "/account/profile" },
  { label: "Trade", icon: DollarSign, url: "/account/trade" },
  { label: "Order History", icon: Activity, url: "/account/orders" },
  { label: "Manage Wallets", icon: Wallet, url: "/account/wallet" },
  { label: "Withdraw Funds", icon: CreditCard, url: "/account/withdraw" },
  { label: "Trading Dashboard", icon: TrendingUp, url: "/account/dashboard" },
];

export function HamburgerMenu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  return (
    <div
      className="relative"
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    >
      <Menu className="h-10 w-10 min-[825px]:hidden text-violet-800 dark:text-white hover:text-violet-600 dark:hover:text-gray-400 cursor-pointer" />
      {isDropdownOpen && (
        <ul className="absolute top-full z-20 rounded-xl bg-white dark:bg-black border">
          {sideBarOptions.map((option) => (
            <Link key={option.label} href={option.url}>
              <SideBarOption
                isActive={pathname === option.url}
                option={option}
              />
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}
