import Link from "next/link";
import Image from "next/image";

const deals = [
  { seller: "Leaders Group", buyer: "Stagwell", note: "Digital marketing group" },
  { seller: "Hovercraft", buyer: "Skyview", note: "Creative agency" },
  { seller: "OMM", buyer: "Skyview", note: "Agency acquisition" },
  { seller: "Digitag", buyer: "Huble", note: "Digital transformation" },
  { seller: "Sports Presentation Company", buyer: "Smyle", note: "Events & experiential" },
];

const testimonials = [
  {
    quote:
      "Capital A brought genuine insight and discipline to a complex process. Andy and the team understood what mattered to us as a business and delivered.",
    name: "Steve Quah",
    title: "CEO",
  },
  {
    quote:
      "They didn't just run a process. They shaped our thinking about what the right outcome looked like, then made it happen.",
    name: "Rick Stainton",
    title: "Group Executive Director",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-end pb-24 px-6 md:px-12 overflow-hidden">
        {/* Background: establishment left / street right */}
        <div className="absolute inset-0 grid grid-cols-2">
          {/* Left — old money: whisky, leather, fireplace */}
          <div className="relative overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1200&q=80"
              alt=""
              fill
              className="object-cover object-center scale-105"
              priority
            />
            <div className="absolute inset-0 bg-black/55" />
          </div>
          {/* Right — street: pool hall, low light, gold chains */}
          <div className="relative overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80"
              alt=""
              fill
              className="object-cover object-center scale-105"
              priority
            />
            <div className="absolute inset-0 bg-black/65" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0a0a0a]" />
        {/* Gold seam down the centre */}
        <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-[#c9a84c]/40 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <p className="text-xs tracking-[0.4em] uppercase text-[#c9a84c] mb-10">
            London · W1
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[88px] font-light leading-[1.04] mb-8 max-w-4xl">
            The investment house for the agency economy.
          </h1>
          <p className="text-white/40 text-lg font-light mb-14 tracking-wide">
            We advise. We invest. We convene.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/advisory"
              className="inline-block border border-white/20 px-10 py-4 text-xs tracking-[0.25em] uppercase hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all duration-300"
            >
              Advisory
            </Link>
            <Link
              href="/invest"
              className="inline-block bg-[#c9a84c] text-black px-10 py-4 text-xs tracking-[0.25em] uppercase hover:bg-[#e8cc7a] transition-all duration-300"
            >
              Invest
            </Link>
          </div>
        </div>
      </section>

      {/* Proof bar */}
      <section className="border-y border-white/10 py-4 overflow-x-auto">
        <div className="flex gap-10 px-6 md:px-12 whitespace-nowrap text-[10px] tracking-[0.25em] text-white/30 uppercase">
          <span>14+ completed transactions</span>
          <span className="text-[#c9a84c]/30">·</span>
          <span>Deals from $200k to $13.5m</span>
          <span className="text-[#c9a84c]/30">·</span>
          <span>Buyers include Stagwell, Huble, Smyle and Skyview</span>
          <span className="text-[#c9a84c]/30">·</span>
          <span>London, W1</span>
        </div>
      </section>

      {/* What we are */}
      <section className="py-32 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-start">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a84c] mb-8">
              What we are
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-light leading-snug">
              Most M&A firms sell advice. We built something older.
            </h2>
          </div>
          <div className="space-y-6 text-white/50 leading-relaxed md:pt-16">
            <p>
              The firms that shaped media, from Allen & Company to the houses
              behind today&apos;s technology deals, ran one model: advise the sector
              you know, invest in the best of what you see, and host the room
              where the industry meets.
            </p>
            <p>Capital A runs that model for marketing, creative and agency businesses.</p>
            <p>
              Advisory keeps us inside every deal in the market. Investing means
              we back our judgement with our own capital. Convening, through
              Agencies.co, our research and our events, means the market comes
              to us first.
            </p>
          </div>
        </div>
      </section>

      {/* Three practices */}
      <section className="px-6 md:px-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-px bg-white/10">
            {[
              {
                label: "Advisory.",
                body: "Sell-side exits through Agencies.co. Buy-side mandates for strategic acquirers and investors. Fourteen completed transactions and counting, with buyers from AIM-listed groups to US strategics.",
                href: "/advisory",
              },
              {
                label: "Principal.",
                body: "Agency A is our acquisition platform. We buy and build immersive, experiential and creator economy businesses, the creative work AI cannot replace, alongside founders who roll equity and stay ambitious.",
                href: "/invest",
              },
              {
                label: "Intelligence.",
                body: "The largest proprietary dataset in agency M&A: valuation benchmarks from hundreds of agency submissions, market coverage across thousands of buyers, and research read across the sector every week.",
                href: "/insights",
              },
            ].map((p) => (
              <div
                key={p.label}
                className="bg-[#0a0a0a] p-10 flex flex-col justify-between gap-10 group hover:bg-[#0e0d0b] transition-colors duration-500"
              >
                <div>
                  <h3 className="font-serif text-2xl font-light mb-5">{p.label}</h3>
                  <p className="text-white/40 leading-relaxed text-sm">{p.body}</p>
                </div>
                <Link
                  href={p.href}
                  className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] flex items-center gap-2"
                >
                  <span>Learn more</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selected transactions */}
      <section className="py-32 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-14">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a84c]">
              Selected transactions
            </p>
            <Link
              href="/track-record"
              className="text-[10px] tracking-[0.2em] uppercase text-white/25 hover:text-white/60 transition-colors"
            >
              Full track record →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-white/10">
            {deals.map((d) => (
              <div key={d.seller} className="bg-[#0a0a0a] p-6 flex flex-col gap-4">
                <div className="text-[9px] tracking-[0.2em] uppercase text-white/25">{d.note}</div>
                <div className="font-serif text-base font-light">{d.seller}</div>
                <div className="text-xs text-[#c9a84c]">→ {d.buyer}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 md:px-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          {testimonials.map((t) => (
            <div key={t.name} className="space-y-8">
              <p className="font-serif text-xl md:text-2xl font-light leading-relaxed text-white/70 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="text-sm text-white">{t.name}</p>
                <p className="text-xs text-white/30 tracking-widest uppercase mt-1">{t.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
