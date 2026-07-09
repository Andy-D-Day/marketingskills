export const metadata = {
  title: "Track Record | Capital A",
  description: "Completed transactions: 14+ agency M&A deals from $200k to $13.5m.",
};

const transactions = [
  { seller: "Leaders Group", buyer: "Stagwell", context: "Digital marketing group acquisition by US strategic" },
  { seller: "Hovercraft", buyer: "Skyview", context: "Creative agency acquisition" },
  { seller: "OMM", buyer: "Skyview", context: "Agency acquisition" },
  { seller: "Raw Cereal", buyer: "Skyview", context: "Agency acquisition" },
  { seller: "Digitag", buyer: "Huble", context: "Digital transformation agency acquired by HubSpot partner group" },
  { seller: "Bubblebridge", buyer: "Huble", context: "Agency acquisition" },
  { seller: "Sports Presentation Company", buyer: "Smyle", context: "Events and experiential acquisition" },
  { seller: "Marketers in Demand", buyer: "Motion Agency", context: "Talent and media brand acquisition" },
  { seller: "New North", buyer: "Motion Agency", context: "B2B tech growth agency acquired by podcast marketing firm" },
  { seller: "Spotlight", buyer: "Mason", context: "Agency acquisition" },
  { seller: "Integrous Marketing", buyer: "Avionos", context: "Demand generation and analytics agency acquired by Chicago digital firm" },
  { seller: "Absolute Corporate Events", buyer: "Venues and Events International", context: "Corporate events agency acquisition" },
  { seller: "Lost Horizon", buyer: "We Group", context: "Investment raised" },
  { seller: "We Group", buyer: "Private individual", context: "Secondary disposal of Lost Horizon shares" },
];

export default function TrackRecord() {
  return (
    <>
      <section className="pt-48 pb-16 px-6 md:px-12 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a84c] mb-6">Track Record</p>
          <h1 className="font-serif text-5xl md:text-6xl font-light leading-tight max-w-2xl">
            Completed transactions.
          </h1>
          <p className="text-white/30 mt-6 text-sm">14+ completed transactions. Deals from $200k to $13.5m.</p>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-px">
            {/* Header row */}
            <div className="grid grid-cols-12 gap-4 py-3 text-[9px] tracking-[0.3em] uppercase text-white/20 border-b border-white/10">
              <div className="col-span-4">Seller</div>
              <div className="col-span-3">Buyer</div>
              <div className="col-span-5">Context</div>
            </div>
            {transactions.map((t, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-4 py-5 border-b border-white/5 hover:bg-white/2 transition-colors group"
              >
                <div className="col-span-4 font-serif text-base font-light">{t.seller}</div>
                <div className="col-span-3 text-sm text-[#c9a84c]">
                  {t.buyer ? `→ ${t.buyer}` : <span className="text-white/20">Undisclosed</span>}
                </div>
                <div className="col-span-5 text-sm text-white/40">{t.context}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
