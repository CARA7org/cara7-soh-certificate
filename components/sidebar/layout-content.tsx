export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-10 min-h-[calc(100vh_-_40px)] w-full">{children}</div>
  );
}
