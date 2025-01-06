type CoinOptionProps = {
  coin: string;
  setAsset: (param: string) => void;
  closeDropdown: (param: boolean) => void;
  displayPic: string;
  displayName: string;
};
export function CoinOption({
  coin,
  setAsset,
  closeDropdown,
  displayPic,
  displayName,
}: CoinOptionProps) {
  return (
    <li
      className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
      onClick={() => {
        setAsset(coin);
        closeDropdown(false);
      }}
    >
      <img src={displayPic} alt={coin} className="w-6 h-6" />
      <span className="dark:text-white">{displayName}</span>
    </li>
  );
}
