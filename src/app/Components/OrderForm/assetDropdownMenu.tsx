import { CoinType } from "../Account/coinBalance";
import { CoinOption } from "./coinOption";
type AssetDropdownMenuProps = {
  coinPics: Record<CoinType, string>;
  coinNames: Record<CoinType, string>;
  closeDropdown: (param: boolean) => void;
  setAsset: (param: string) => void;
};
export function AssetDropdownMenu({
  coinPics,
  coinNames,
  closeDropdown,
  setAsset,
}: AssetDropdownMenuProps) {
  return (
    <ul className="absolute z-10 mt-2 w-full dark:bg-black bg-white dark:border rounded-md shadow-md">
      {Object.keys(coinPics).map((coin) => {
        const displayPic = coinPics[coin as CoinType];
        const displayName = coinNames[coin as CoinType];
        return (
          <CoinOption
            key={coin}
            coin={coin}
            closeDropdown={closeDropdown}
            setAsset={setAsset}
            displayPic={displayPic}
            displayName={displayName}
          />
        );
      })}
    </ul>
  );
}
