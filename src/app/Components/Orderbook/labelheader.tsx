type LabelHeaderProps = {
  left: string;
  right?: string;
  colThree?: string;
};
export function LabelHeader({ left, right, colThree }: LabelHeaderProps) {
  return (
    <div className="bg-violet-500 dark:bg-zinc-700 text-white flex justify-between  py-1 px-2">
      <label className=" w-1/3 text-end text-nowrap">{left}</label>
      <label className="w-1/3 text-end text-nowrap">{right}</label>
      <label className="w-1/3 text-end">{colThree}</label>
    </div>
  );
}
