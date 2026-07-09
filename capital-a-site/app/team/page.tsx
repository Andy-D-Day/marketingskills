export const metadata = {
  title: "Team | Capital A",
  description: "The people behind Capital A.",
};

const team = [
  {
    name: "Andy Day",
    title: "Founder and Chief Executive",
    bio: "Founder of Capital A and Agencies.co. Previously founded Gigwise, sold to private equity. Advises on every mandate and leads Agency A.",
  },
  {
    name: "Jon Goulding",
    title: "Managing Director",
    bio: "Former COO of DDB UK and CEO of Atomic London. Jon leads engagement with founders and buyers, bringing twenty years of running agencies to the other side of the table.",
  },
  {
    name: "Ahmed Zia",
    title: "Associate",
    bio: "Analytics, valuation and deal execution. Ahmed runs the data spine of the firm, from the valuation engine to transaction support.",
  },
  {
    name: "Heather Fullerton",
    title: "Senior Advisor",
    bio: "Investor relationships and capital formation for Agency A.",
  },
  {
    name: "Dee Day",
    title: "Client Management",
    bio: "The continuity in every mandate, from onboarding through completion.",
  },
];

export default function Team() {
  return (
    <>
      <section className="pt-48 pb-16 px-6 md:px-12 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a84c] mb-6">Team</p>
          <h1 className="font-serif text-5xl md:text-6xl font-light leading-tight max-w-2xl">
            The people.
          </h1>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto space-y-px">
          {team.map((p) => (
            <div
              key={p.name}
              className="grid md:grid-cols-12 gap-8 py-10 border-b border-white/10 hover:bg-white/2 transition-colors"
            >
              <div className="md:col-span-4">
                <p className="font-serif text-xl font-light">{p.name}</p>
                <p className="text-xs tracking-[0.15em] uppercase text-[#c9a84c] mt-2">{p.title}</p>
              </div>
              <p className="md:col-span-8 text-white/50 leading-relaxed">{p.bio}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
