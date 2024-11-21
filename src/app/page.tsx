import { Hero } from "./Components/Home/hero";
import { Navbar } from "./Components/Home/navbar";
import { SignupForm } from "./Components/Home/signupForm";

export default function Home() {
  return (
    <div className="relative flex flex-col w-full">
      <Navbar />
      <Hero />
    </div>
  );
}
