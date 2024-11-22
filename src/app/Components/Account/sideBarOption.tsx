import { LucideProps } from "lucide-react";

type SideBarOption = {
  label: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};
type SidebarOptionProps = {
  option: SideBarOption;
};
export function SideBarOption({ option }: SidebarOptionProps) {
  const { icon: Icon, label } = option;
  return (
    <div
      key={label}
      className="dark:text-gray-400 text-black hover:dark:text-white hover:text-violet-600 font-semibold text-lg p-5 px-8 cursor-pointer flex items-center gap-4"
    >
      <Icon className="w-5 h-5" />
      {label}
    </div>
  );
}
