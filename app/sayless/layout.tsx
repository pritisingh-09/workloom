
import Link from "next/link";

const navigation = [
  { label: "Overview", href: "/sayless", icon: "⌂" },
  { label: "New conversation", href: "/sayless/new", icon: "+" },
  { label: "History", href: "/sayless/history", icon: "◷" },
  { label: "Voice studio", href: "/sayless/voice", icon: "♫" },
  { label: "Team workspace", href: "/sayless/team", icon: "♧" },
];

export default function SayLessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#24231f] md:flex">
      <aside className="flex w-full flex-col border-b border-[#e9e5dd] bg-white px-6 py-6 md:fixed md:inset-y-0 md:w-64 md:border-b-0 md:border-r">
        <Link href="/sayless" className="text-2xl font-semibold tracking-tight">
          sayless<span className="text-[#9b83c9]">.</span>
        </Link>

        <p className="mt-2 text-[10px] tracking-[0.18em] text-[#aaa49a]">
          YOUR COMMUNICATION SPACE
        </p>

        <nav className="mt-10 flex flex-wrap gap-2 md:flex-col">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#77736d] transition hover:bg-[#f2eef8] hover:text-[#8d75bb]"
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 border-t border-[#e9e5dd] pt-5 md:mt-auto">
          <Link
            href="/sayless/settings"
            className="block rounded-xl px-4 py-3 text-sm text-[#77736d] transition hover:bg-[#f2eef8]"
          >
            Settings
          </Link>
          <p className="mt-4 px-4 text-xs text-[#aaa49a]">
            Less overthinking. More meaningful communication.
          </p>
        </div>
      </aside>

      <div className="min-w-0 flex-1 md:ml-64">
        {children}
      </div>
    </div>
  );
}
