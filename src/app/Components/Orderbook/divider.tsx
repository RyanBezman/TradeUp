type DividerProps = {
  selectedQuoteAsset: string;
  spread: number;
};
export function Divider({ selectedQuoteAsset, spread }: DividerProps) {
  return (
    <div className="bg-violet-500 dark:bg-zinc-700 text-white flex justify-end  py-1 px-2 my-2 ">
      <label className="w-1/3 text-end text-nowrap">
        {`${selectedQuoteAsset} Spread`}
      </label>
      <label className="w-1/3 text-end">{spread.toFixed(2)}</label>
      <label className="w-1/3 text-end"></label>
    </div>
  );
}
