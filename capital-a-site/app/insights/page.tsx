export const metadata = {
  title: "Insights | Capital A",
  description: "Valuation multiples, deal notes and intelligence from the agency M&A market.",
};

const posts = [
  {
    date: "Q2 2026",
    title: "Agency valuation multiples: mid-year update",
    tag: "Research",
    summary: "EBITDA multiples across creative, performance and experiential categories, based on live deal data.",
  },
  {
    date: "May 2026",
    title: "What Stagwell's acquisition cadence means for mid-market agencies",
    tag: "Deal notes",
    summary: "Three observations from watching the group's UK and European activity over 18 months.",
  },
  {
    date: "March 2026",
    title: "The agency economy in 2026: buyer behaviour and pricing signals",
    tag: "Research",
    summary: "Annual survey of valuation benchmarks, buyer activity and market structure.",
  },
];

export default function Insights() {
  return (
    <>
      <section className="pt-48 pb-16 px-6 md:px-12 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a84c] mb-6">Insights</p>
            <h1 className="font-serif text-5xl md:text-6xl font-light leading-tight max-w-2xl">
              Intelligence from inside the market.
            </h1>
          </div>
          {/* Newsletter */}
          <div className="md:max-w-xs w-full">
            <p className="text-xs text-white/40 mb-4 leading-relaxed">
              The Capital A newsletter. Valuation data, deal notes and market coverage, direct to your inbox.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c9a84c] transition-colors"
              />
              <button
                type="submit"
                className="bg-[#c9a84c] text-black px-5 py-3 text-xs tracking-[0.2em] uppercase hover:bg-[#e8cc7a] transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto space-y-px">
          {posts.map((p) => (
            <article
              key={p.title}
              className="grid md:grid-cols-12 gap-6 py-10 border-b border-white/10 hover:bg-white/2 transition-colors cursor-pointer group"
            >
              <div className="md:col-span-2">
                <p className="text-xs text-white/30">{p.date}</p>
                <p className="text-[9px] tracking-[0.2em] uppercase text-[#c9a84c] mt-1">{p.tag}</p>
              </div>
              <div className="md:col-span-10">
                <h2 className="font-serif text-xl font-light mb-3 group-hover:text-white/80 transition-colors">
                  {p.title}
                </h2>
                <p className="text-white/40 text-sm leading-relaxed">{p.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
