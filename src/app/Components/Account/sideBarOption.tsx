import { LucideProps } from "lucide-react";

type SideBarOption = {
  label: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};
type SidebarOptionProps = {
  option: SideBarOption;
  isActive?: boolean;
};
export function SideBarOption({ option, isActive }: SidebarOptionProps) {
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
      <span className="hidden min-[1313px]:block">{label}</span>
    </li>
  );
}
