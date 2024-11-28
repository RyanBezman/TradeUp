type ColumnHeaderProps = {
  title: string;
};
export function ColumnHeader({ title }: ColumnHeaderProps) {
  return (
    <div className="bg-violet-800 text-white py-4 px-6 dark:bg-zinc-900">
      <h2 className="font-semibold">{title}</h2>
    </div>
  );
}
