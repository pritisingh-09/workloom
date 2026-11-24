
import Link from "next/link";

const recentConversations = [
  {
    title: "Updating my manager about a delayed task",
    category: "Workplace communication",
    date: "Your latest session",
    status: "Playbook generated",
  },
  {
    title: "Preparing for a difficult conversation",
    category: "Career conversations",
    date: "Example activity",
    status: "Draft",
  },
];

export default function SayLessDashboard() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-12">
      {/* Welcome */}
      <section>
        <p className="text-xs font-medium tracking-[0.18em] text-[#8d75bb]">
          YOUR PERSONAL COMMUNICATION SPACE
        </p>

        <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
          A little less overthinking.
          <br />
          <span className="text-[#9b83c9]">A lot more clarity.</span>
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-7 text-[#77736d]">
          Think through the conversation before you have it. Find the right
          approach, prepare your words, and feel more confident about what
          comes next.
        </p>
      </section>

      {/* Quick start */}
      <section className="mt-10 overflow-hidden rounded-3xl border border-[#e9e5dd] bg-white p-7 shadow-sm sm:p-9">
        <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
          <div className="max-w-lg">
            <span className="rounded-full bg-[#f2eef8] px-3 py-1.5 text-xs font-medium text-[#8d75bb]">
              YOUR COACH IS READY
            </span>

            <h2 className="mt-5 text-2xl font-medium tracking-tight">
              What's on your mind?
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#77736d]">
              A difficult email? An awkward conversation? A message you keep
              rewriting? Start with what's happening. We'll help you think it
              through.
            </p>

            <Link
              href="/sayless/new"
              className="mt-6 inline-flex items-center rounded-full bg-[#292720] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#514b40]"
            >
              Start a conversation <span className="ml-3">↗</span>
            </Link>
          </div>

          <div className="hidden h-44 w-44 shrink-0 items-center justify-center rounded-full bg-[#f2eef8] sm:flex">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#d9cbea] bg-white text-5xl text-[#9b83c9]">
              ✳
            </div>
          </div>
        </div>
      </section>

      {/* Overview cards */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#e9e5dd] bg-white p-5">
          <p className="text-sm text-[#77736d]">Your conversations</p>
          <p className="mt-3 text-3xl font-medium">—</p>
          <p className="mt-2 text-xs text-[#aaa49a]">
            Your saved sessions will appear here
          </p>
        </div>

        <div className="rounded-2xl border border-[#e9e5dd] bg-white p-5">
          <p className="text-sm text-[#77736d]">Playbooks created</p>
          <p className="mt-3 text-3xl font-medium">—</p>
          <p className="mt-2 text-xs text-[#aaa49a]">
            Your communication plans
          </p>
        </div>

        <div className="rounded-2xl border border-[#e9e5dd] bg-white p-5">
          <p className="text-sm text-[#77736d]">Voice sessions</p>
          <p className="mt-3 text-3xl font-medium">—</p>
          <p className="mt-2 text-xs text-[#aaa49a]">
            Voice Studio is coming soon
          </p>
        </div>
      </section>

      {/* Recent activity */}
      <section className="mt-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium tracking-tight">
              Recent conversations
            </h2>
            <p className="mt-1 text-sm text-[#99948b]">
              Pick up where you left off.
            </p>
          </div>

          <Link
            href="/sayless/history"
            className="text-sm font-medium text-[#8d75bb] hover:text-[#6e559f]"
          >
            View history →
          </Link>
        </div>

        <div className="mt-5 space-y-3">
          {recentConversations.map((conversation, index) => (
            <div
              key={conversation.title}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-[#e9e5dd] bg-white p-5 sm:flex-row sm:items-center"
            >
              <div>
                <p className="text-sm font-medium">{conversation.title}</p>
                <p className="mt-1 text-xs text-[#99948b]">
                  {conversation.category} · {conversation.date}
                </p>
              </div>

              <span className="w-fit rounded-full bg-[#f2eef8] px-3 py-1.5 text-xs text-[#8d75bb]">
                {conversation.status}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-[#aaa49a]">
          Preview content only. Your actual conversation history will be
          connected to your account when we implement saved sessions.
        </p>
      </section>

      {/* Explore */}
      <section className="mt-12">
        <h2 className="text-xl font-medium tracking-tight">
          Explore your communication tools
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Link
            href="/sayless/voice"
            className="rounded-2xl border border-[#e9e5dd] bg-white p-6 transition hover:border-[#9b83c9]"
          >
            <span className="text-2xl text-[#9b83c9]">♫</span>
            <h3 className="mt-4 font-medium">Voice Studio</h3>
            <p className="mt-2 text-sm leading-6 text-[#77736d]">
              Practise how you speak, review delivery, and prepare for
              important conversations.
            </p>
            <p className="mt-4 text-xs font-medium text-[#8d75bb]">
              Coming soon →
            </p>
          </Link>

          <Link
            href="/sayless/team"
            className="rounded-2xl border border-[#e9e5dd] bg-white p-6 transition hover:border-[#9b83c9]"
          >
            <span className="text-2xl text-[#9b83c9]">♧</span>
            <h3 className="mt-4 font-medium">Team Workspace</h3>
            <p className="mt-2 text-sm leading-6 text-[#77736d]">
              Collaborate on communication playbooks and prepare for
              conversations together.
            </p>
            <p className="mt-4 text-xs font-medium text-[#8d75bb]">
              Coming soon →
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
