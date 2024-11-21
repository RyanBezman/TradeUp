import { Navbar } from "../Components/Home/navbar";

import {
  UserRound,
  Wallet,
  CreditCard,
  DollarSign,
  Activity,
  Lock,
  TrendingUp,
  Pencil,
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
        <div className="flex flex-col gap-2 min-w-[300px] ">
          {sideBarOptions.map((option) => (
            <div
              key={option.label}
              className="dark:text-gray-400 text-black hover:dark:text-white hover:text-violet-600 font-semibold text-lg p-5 px-8 cursor-pointer flex items-center gap-4"
            >
              <option.icon className="w-5 h-5" />
              {option.label}
            </div>
          ))}
        </div>
        <div className="flex flex-col rounded-2xl bg-gray-100 dark:bg-zinc-950 p-8 flex-1">
          <h1 className="text-3xl font-bold dark:text-white text-black hover:dark:text-white hover:text-violet-600">
            Account
          </h1>
          <div className="bg-white dark:bg-black mt-8 rounded-xl flex flex-1">
            <div className="flex flex-1">
              <div className="flex flex-col gap-2 min-w-[300px] pt-16 border-gray-300 dark:border-gray-600">
                {sideBarOptions.map((option) => (
                  <div
                    key={option.label}
                    className="dark:text-gray-400 text-black hover:dark:text-white hover:text-violet-600 font-semibold text-lg p-5 cursor-pointer flex items-center gap-4"
                  >
                    <option.icon className="w-5 h-5" />
                    {option.label}
                  </div>
                ))}
              </div>
              <div className="flex flex-1 flex-col px-8">
                <h2 className="text-2xl font-bold mb-6 pt-8 dark:text-white text-black">
                  My Profile
                </h2>
                <div className="w-full p-10 flex justify-between border dark:border-gray-600 border-gray-300 rounded-lg">
                  <div className="flex gap-6">
                    <button className="flex items-center justify-center bg-violet-300 dark:bg-zinc-900 text-black dark:text-white font-bold rounded-full w-16 h-16 hover:ring-2 hover:ring-violet-600 dark:hover:ring-gray-400">
                      R
                    </button>
                    <div className="dark:text-gray-400 text-black">
                      <h3 className="text-xl dark:text-white font-bold">
                        Ryan Bezman
                      </h3>
                      <p className="text-sm">Software Engineer</p>
                      <p className="text-sm">East Meadow, NY, USA</p>
                    </div>
                  </div>
                  <button className="flex items-center h-8 px-2 py-4 gap-2 text-black hover:dark:text-white dark:text-gray-400 hover:text-violet-600 border">
                    <Pencil className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
                <div className="w-full p-10 mt-8 flex flex-col justify-between border dark:border-gray-600 border-gray-300 rounded-lg">
                  <div className="flex justify-between flex-1 items-center">
                    <h2 className="dark:text-gray-400 text-lg text-black font-semibold">
                      Personal Information
                    </h2>
                    <button className="flex items-center h-8 px-2 py-4 gap-2 text-black hover:dark:text-white dark:text-gray-400 hover:text-violet-600 border">
                      <Pencil className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <div className="flex flex-col w-full min-[1611px]:w-1/2">
                    <div className="flex gap-12 flex-1 pt-4">
                      <div className="flex w-1/2 flex-col">
                        <label className="text-gray-700 font-semibold dark:text-gray-400">
                          First Name
                        </label>
                        <span className="text-black dark:text-white">Ryan</span>
                      </div>
                      <div className="flex flex-col w-1/2">
                        <label className="text-gray-700 font-semibold dark:text-gray-400">
                          Last Name
                        </label>
                        <span className="text-black dark:text-white">
                          Bezman
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-12 pt-6">
                      <div className="flex flex-col w-1/2">
                        <label className="text-gray-700  font-semibold dark:text-gray-400">
                          Email address
                        </label>
                        <span className="text-black dark:text-white">
                          ryanbezman@icloud.com
                        </span>
                      </div>
                      <div className="flex flex-col w-1/2">
                        <label className="text-gray-700 font-semibold dark:text-gray-400">
                          Phone
                        </label>
                        <span className="text-black dark:text-white">
                          (516)-406-4098
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-12 pt-6">
                      <div className="flex flex-col w-1/2">
                        <label className="text-gray-700 font-semibold dark:text-gray-400">
                          Bio
                        </label>
                        <span className="text-black dark:text-white">
                          Software Engineer
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full p-10 mt-8 flex flex-col justify-between border dark:border-gray-600 border-gray-300 rounded-lg">
                  <div className="flex justify-between flex-1 items-center">
                    <h2 className="dark:text-gray-400 text-black font-semibold text-lg">
                      Address
                    </h2>
                    <button className="flex items-center h-8 px-2 py-4 gap-2 text-black hover:dark:text-white dark:text-gray-400 hover:text-violet-600 border">
                      <Pencil className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <div className="flex flex-col w-1/2">
                    <div className="flex gap-12 flex-1 pt-4">
                      <div className="flex w-1/2 flex-col">
                        <label className="text-gray-700 dark:text-gray-400 font-semibold">
                          Country
                        </label>
                        <span className="text-black dark:text-white">
                          United State of America
                        </span>
                      </div>
                      <div className="flex flex-col w-1/2">
                        <label className="text-gray-700 dark:text-gray-400 font-semibold">
                          City/ State
                        </label>
                        <span className="text-black dark:text-white">
                          East Meadow, NY
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-12 pt-6">
                      <div className="flex flex-col w-1/2">
                        <label className="text-gray-700 dark:text-gray-400 font-semibold">
                          Postal Code
                        </label>
                        <span className="text-black dark:text-white">
                          11554
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
