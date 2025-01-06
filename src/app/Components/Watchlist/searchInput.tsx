import { Search } from "lucide-react";
import { ChangeEvent } from "react";
type SearchInputProps = {
  searchValue: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
export function SearchInput({
  searchValue,
  handleInputChange,
}: SearchInputProps) {
  return (
    <div className="p-4 flex w-full">
      <label
        htmlFor="search-input"
        className="cursor-pointer group bg-transparent text-black dark:text-white outline-none text-lg border rounded-lg w-full p-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-violet-800"
      >
        <Search className="h-4 w-4 dark:text-white" />
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          id="search-input"
          placeholder="Search for a market"
          className="outline-none bg-transparent cursor-pointer"
        />
      </label>
    </div>
  );
}
