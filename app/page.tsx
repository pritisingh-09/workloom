
import Link from "next/link";

const products = [
  {
    number: "01",
    name: "SayLess",
    category: "AI COMMUNICATION",
    description:
      "Turn scattered thoughts into clear, confident and context-aware professional messages.",
    href: "/sayless",
    status: "Building now",
  },
  {
    number: "02",
    name: "SimuUser",
    category: "AI PRODUCT RESEARCH",
    description:
      "Explore how simulated AI personas might experience your product and uncover potential friction.",
    href: "/simuuser",
    status: "Coming soon",
  },
  {
    number: "03",
    name: "BriefCheck",
    category: "AI REQUIREMENTS INTELLIGENCE",
    description:
      "Find gaps, ambiguity and missing details in your project briefs before execution begins.",
    href: "/brief-checker",
    status: "Coming soon",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#24231f]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 md:px-12">
        <Link href="/" className="text-2xl font-semibold tracking-tight">
          workloom<span className="text-[#9b83c9]">.</span>
        </Link>
        <span className="text-xs tracking-[0.2em] text-[#77736d]">
          A BETTER WAY TO WORK
        </span>
      </nav>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-20 md:px-12 md:pt-28">
        <div className="max-w-3xl">
          <p className="mb-7 text-xs font-medium tracking-[0.25em] text-[#8d75bb]">
            INTRODUCING WORKLOOM
          </p>
          <h1 className="text-5xl font-medium leading-[1.08] tracking-tight md:text-7xl">
            Less friction.
            <br />
            <span className="text-[#9b83c9]">Better work.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-[#77736d]">
            A collection of thoughtful AI tools designed to make everyday
            work clearer, simpler and more meaningful.
          </p>
          <a
            href="#products"
            className="mt-10 inline-flex rounded-full bg-[#292720] px-7 py-3.5 text-sm text-white transition hover:bg-[#514b40]"
          >
            Explore our products <span className="ml-3">↗</span>
          </a>
        </div>
      </section>

      <section
        id="products"
        className="mx-auto max-w-7xl px-6 pb-28 md:px-12"
      >
        <div className="mb-9 flex items-end justify-between">
          <div>
            <p className="text-xs tracking-[0.2em] text-[#8d75bb]">
              THE WORKLOOM COLLECTION
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight">
              Tools for better work.
            </h2>
          </div>
          <span className="hidden text-sm text-[#99948b] sm:block">
            03 products
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.number}
              className="group flex min-h-[330px] flex-col rounded-2xl border border-[#e9e5dd] bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#342b48]/5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#aaa49a]">
                  {product.number}
                </span>
                <span className="rounded-full bg-[#f2eff7] px-3 py-1.5 text-[10px] tracking-wider text-[#8069a9]">
                  {product.status.toUpperCase()}
                </span>
              </div>

              <p className="mt-12 text-[10px] font-medium tracking-[0.18em] text-[#9b83c9]">
                {product.category}
              </p>
              <h3 className="mt-3 text-3xl font-medium tracking-tight">
                {product.name}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#77736d]">
                {product.description}
              </p>

              <Link
                href={product.href}
                className="mt-auto pt-8 text-sm font-medium text-[#51466b] transition group-hover:text-[#9b83c9]"
              >
                Explore product <span className="ml-2">↗</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#e9e5dd] px-6 py-8 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-[#99948b] sm:flex-row">
          <p>© 2026 Workloom. Built with intention.</p>
          <p>Less friction. Better work.</p>
        </div>
      </footer>
    </main>
  );
}
