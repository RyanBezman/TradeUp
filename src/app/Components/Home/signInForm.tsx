import { authorizeUser } from "@/actions/auth/authorizeUser";
import { useAuth } from "@/app/context/AuthContext";
import { FormEvent, useState } from "react";
import { SignInFormInput } from "./signInFormInput";
import { Loader, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { getBalances } from "@/actions/balance/getBalances";

export default function SignInForm({
  setIsFormOpen,
  title,
}: {
  setIsFormOpen: (arg: boolean) => void;
  title?: string;
}) {
  const initialSignInData = {
    email: "",
    password: "",
  };
  const [isLoading, setIsLoading] = useState(false);
  const [signInData, setSignInData] = useState(initialSignInData);
  const [error, setError] = useState<string | null>(null);
  const { setUser, setBalances } = useAuth();
  const router = useRouter();

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const result = await authorizeUser(signInData.email, signInData.password);

    if (!result) {
      setError("Incorrect Email or password. Please Try again.");
      setIsLoading(false);
      // setSignInData(initialSignInData);
      return;
    }
    document.cookie = `sessionToken=${result.sessionToken}; path=/; max-age=${
      3 * 24 * 60 * 60
    }`;
    document.cookie = `email=${result.email}; path=/; max-age=${
      3 * 24 * 60 * 60
    }`;
    if (result) {
      const balances = await getBalances(result.id);
      if (balances) {
        setBalances(balances);
      }
    }
    setUser(result);
    setIsFormOpen(false);
    setIsLoading(false);
    setSignInData(initialSignInData);

    router.push("/account/home");
  }

  return (
    <div className="fixed inset-0 flex z-40 items-center bg-gray-400 bg-opacity-50 dark:bg-black dark:bg-opacity-80 justify-center">
      <form
        onSubmit={handleSignIn}
        className="flex flex-col bg-white dark:bg-black border border-gray-300 dark:border-gray-600 w-full max-w-xl max-h-[95vh] p-10 rounded-2xl shadow-lg overflow-auto"
      >
        <div className="flex items-center justify-between pb-8">
          <h3 className="text-black dark:text-white font-bold text-2xl">
            {title
              ? `
            ${title}`
              : "Sign In"}
          </h3>
          <X
            type="button"
            className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-white h-6 w-6 cursor-pointer"
            onClick={() => {
              setIsFormOpen(false);
              setError(null);
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <SignInFormInput
            key={"email"}
            label={"Email"}
            fieldKey="email"
            placeholder="Enter email"
            setSignInData={setSignInData}
            signInData={signInData}
          />
          <SignInFormInput
            key={"password"}
            label={"Password"}
            fieldKey="password"
            placeholder="Enter password"
            setSignInData={setSignInData}
            signInData={signInData}
          />
        </div>
        {error && <span className="text-red-500 text-sm">{error}</span>}
        <div className="flex justify-end px-2 pt-14 gap-4">
          <button
            type="button"
            className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-white font-semibold"
            onClick={() => {
              setIsFormOpen(false);
              setError(null);
            }}
          >
            Close
          </button>
          <button
            type="submit"
            className="bg-violet-800 dark:bg-white text-white dark:text-black py-4 px-8 rounded-xl font-semibold hover:bg-violet-700 dark:hover:bg-gray-200"
          >
            {isLoading ? (
              <Loader className="animate-spin h-8 w-8 text-gray-500" />
            ) : (
              "Sign In"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
