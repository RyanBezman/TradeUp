type ColumnHeaderProps = {
  title: string;
  book?: string;
};
export function ColumnHeader({ title, book }: ColumnHeaderProps) {
  return (
    <div className="bg-violet-800 text-white py-4 px-6 dark:bg-zinc-900 transitions">
      <h2 className="font-semibold flex justify-between">
        <span>{title}</span>
        <span>{book}</span>
      </h2>
    </div>
  );
}
