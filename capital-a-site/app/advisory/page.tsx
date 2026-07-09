import Link from "next/link";

export const metadata = {
  title: "Advisory | Capital A",
  description: "Buy-side and sell-side M&A advisory for marketing, creative and agency businesses.",
};

export default function Advisory() {
  return (
    <>
      {/* Page header */}
      <section className="pt-48 pb-24 px-6 md:px-12 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a84c] mb-6">Advisory</p>
          <h1 className="font-serif text-5xl md:text-6xl font-light leading-tight max-w-3xl">
            We work both sides of the table, never on the same deal.
          </h1>
        </div>
      </section>

      {/* Sell-side */}
      <section className="py-24 px-6 md:px-12 border-b border-white/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 mb-6">Sell-side</p>
            <h2 className="font-serif text-3xl font-light mb-8 leading-snug">Selling your agency.</h2>
          </div>
          <div className="space-y-5 text-white/50 leading-relaxed">
            <p>
              Exits run through Agencies.co, our dedicated sell-side platform. Valuation,
              positioning, buyer competition and completion, run by the team that has taken
              agencies to Stagwell, Smyle and the market&apos;s most acquisitive groups.
            </p>
            <p>
              One thing we do differently: we go to market to create competition for your
              business, not to place it quietly with the nearest buyer.
            </p>
            <a
              href="https://agencies.co"
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#c9a84c] hover:gap-3 transition-all duration-200 mt-4"
            >
              <span>agencies.co</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Buy-side */}
      <section className="py-24 px-6 md:px-12 border-b border-white/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 mb-6">Buy-side</p>
            <h2 className="font-serif text-3xl font-light mb-8 leading-snug">Buying an agency.</h2>
          </div>
          <div className="space-y-5 text-white/50 leading-relaxed">
            <p>
              Buy-side mandates for groups, platforms and investors acquiring in marketing,
              creative and media. Target origination from a market position nobody else holds,
              valuation, structuring and execution through completion.
            </p>
            <p>
              Recent buy-side work includes three completed acquisitions for a single US client
              in fifteen months.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#c9a84c] hover:gap-3 transition-all duration-200 mt-4"
            >
              <span>Contact</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* How we charge */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 mb-6">Fees</p>
            <h2 className="font-serif text-3xl font-light mb-8 leading-snug">How we charge.</h2>
          </div>
          <div className="space-y-5 text-white/50 leading-relaxed">
            <p>Published rates, held.</p>
            <p>Retainers plus success fees on buy-side. Success fees with published minimums on sell-side. Single-target and principal situations priced individually.</p>
            <p>We quote once.</p>
          </div>
        </div>
      </section>
    </>
  );
}
