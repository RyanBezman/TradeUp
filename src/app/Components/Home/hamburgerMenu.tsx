"use client";

import {
  Activity,
  ChartNoAxesCombined,
  DollarSign,
  Home,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
const sideBarOptions = [
  { label: "Home", icon: Home, url: "/account/home" },
  { label: "My Profile", icon: UserRound, url: "/account/profile" },
  { label: "Trade", icon: DollarSign, url: "/account/trade" },
  { label: "Order History", icon: Activity, url: "/account/orders" },
  // { label: "Manage Wallets", icon: Wallet, url: "/account/wallet" },
  // { label: "Withdraw Funds", icon: CreditCard, url: "/account/withdraw" },
  // { label: "Trading Dashboard", icon: TrendingUp, url: "/account/dashboard" },
];

export function HamburgerMenu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  if (user) {
    console.log(user);
    return (
      <div>
        <TempChartLogo />
        <div
          className="relative "
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Menu className="h-10 w-10 min-[856px]:hidden text-violet-800 dark:text-white hover:text-violet-600 dark:hover:text-gray-400 cursor-pointer" />
          {isDropdownOpen && (
            <ul className="absolute top-full z-20 min-[856px]:hidden rounded-xl bg-white dark:bg-black border">
              {sideBarOptions.map((option) => (
                <Link key={option.label} href={option.url}>
                  <DropDownOption
                    isActive={pathname === option.url}
                    option={option}
                  />
                </Link>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  } else {
    return <ChartLogo />;
  }
}

function ChartLogo() {
  return (
    <Link href={"/account/home"}>
      <ChartNoAxesCombined
        className="h-10 w-10 cursor-pointer text-violet-800 dark:text-white hover:text-violet-600 dark:hover:text-gray-400
"
      />
    </Link>
  );
}

function TempChartLogo() {
  return (
    <Link href={"/account/home"}>
      <ChartNoAxesCombined
        className="h-10 w-10 cursor-pointer hidden min-[856px]:block text-violet-800 dark:text-white hover:text-violet-600 dark:hover:text-gray-400
"
      />
    </Link>
  );
}

import { LucideProps } from "lucide-react";

type DropdownOption = {
  label: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};
type DropdownOptionProps = {
  option: DropdownOption;
  isActive?: boolean;
};
function DropDownOption({ option, isActive }: DropdownOptionProps) {
  const { icon: Icon, label } = option;
  return (
    <li
      key={label}
      title={label}
      className={`dark:text-gray-400 text-black hover:dark:text-white hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-zinc-900 font-semibold  p-5 cursor-pointer rounded-xl ${
        isActive &&
        "bg-violet-100 text-violet-600 dark:bg-zinc-900 dark:text-white"
      } flex items-center gap-4`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-nowrap">{label}</span>
    </li>
  );
}
