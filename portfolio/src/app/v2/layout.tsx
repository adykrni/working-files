import "./v2.css";

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="v2-root min-w-[1280px] bg-white text-black antialiased">{children}</div>
  );
}
