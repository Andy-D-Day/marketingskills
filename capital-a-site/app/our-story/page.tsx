import Image from "next/image";

export const metadata = {
  title: "Our Story | Capital A",
  description: "Built and sold Gigwise. Eight years inside agency M&A. Then started buying.",
};

export default function OurStory() {
  return (
    <>
      <section className="pt-48 pb-16 px-6 md:px-12 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a84c] mb-6">Our Story</p>
          <h1 className="font-serif text-5xl md:text-6xl font-light leading-tight max-w-2xl">
            Advice on one side. Our own capital on the other.
          </h1>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20">
          {/* Atmospheric image — whisky, leather, fireplace */}
          <div className="relative h-80 md:h-full min-h-[400px] overflow-hidden grayscale">
            <Image
              src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=900&q=80"
              alt=""
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="space-y-8 font-serif text-xl md:text-2xl font-light leading-relaxed text-white/70">
            <p>
              Built and sold Gigwise to private equity. Spent eight years inside agency M&A,
              advising founders through exits to Stagwell, Smyle, Huble and the market&apos;s
              most active buyers.
            </p>
            <p>
              Built Agencies.co, the sell-side platform, and the valuation and market data that
              now sit underneath every deal we touch. Then did what the advisory playbook says
              you should never do: started buying.
            </p>
            <p>
              Capital A today is what the firm was always heading towards. Advice on one side,
              our own capital on the other, and the conviction that the best creative businesses
              are worth owning, not just selling.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
