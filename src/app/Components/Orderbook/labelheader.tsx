type LabelHeaderProps = {
  left: string;
  right?: string;
};
export function LabelHeader({ left, right }: LabelHeaderProps) {
  return (
    <div className="bg-violet-500 dark:bg-zinc-700 text-white flex justify-end gap-12 py-1 px-6">
      <label className="w-1/5 text-end text-nowrap">{left}</label>
      <label className="w-1/5 text-end text-nowrap">{right}</label>
      <label className="w-1/5 text-end">MySize</label>
    </div>
  );
}
