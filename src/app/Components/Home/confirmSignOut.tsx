import { signoutUser } from "@/actions/auth/signoutUser";
import { useAuth } from "@/app/context/AuthContext";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type ConfirmSignOutProps = {
  setIsConfirmingSignout: (arg: boolean) => void;
};

export function ConfirmSignOut({
  setIsConfirmingSignout,
}: ConfirmSignOutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleSignOut = async (e: FormEvent) => {
    e.preventDefault();
    if (user) {
      setIsLoading(true);
      try {
        await signoutUser(user.email, user.sessionToken);
        document.cookie = "sessionToken=; path=/; max-age=0";
        document.cookie = "email=; path=/; max-age=0";
        logout();
        setIsConfirmingSignout(false);
        router.push("/");
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex z-20 bg-gray-400 bg-opacity-50 justify-center">
      <form className="relative justify-between bg-white dark:bg-black w-full max-w-xl p-8 rounded-2xl shadow-lg my-16 h-[fit-content]">
        <div className="text-2xl font-bold text-black dark:text-white mb-2">
          Sign Out
        </div>

        <div className="pt-2 pb-8 text-gray-600 dark:text-gray-400 font-semibold text-lg">
          Are you sure you want to sign out?
        </div>
        <div className="flex justify-end gap-4 mt-4 w-full">
          <button
            className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-white"
            onClick={() => setIsConfirmingSignout(false)}
          >
            Close
          </button>
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="bg-violet-800 dark:bg-white text-white dark:text-black py-4 px-6 rounded-xl font-semibold hover:bg-violet-700 dark:hover:bg-gray-200"
          >
            {isLoading ? (
              <Loader className="animate-spin h-8 w-8 text-gray-500" />
            ) : (
              "Sign Out"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
