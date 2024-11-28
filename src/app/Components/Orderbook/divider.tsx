export function Divider() {
  return (
    <div className="bg-violet-500 dark:bg-zinc-700 text-white flex justify-end gap-12 py-1 px-6 my-2 ">
      <label className="w-1/5 text-end text-nowrap">USD Spread</label>
      <label className="w-1/5 text-end">0.01</label>
      <label className="w-1/5 text-end"></label>
    </div>
  );
}
