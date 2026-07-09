import Image from "next/image";

export const metadata = {
  title: "Team | Capital A",
  description: "The people behind Capital A.",
};

const team = [
  {
    name: "Andy Day",
    title: "Founder and Chief Executive",
    bio: "Founder of Capital A and Agencies.co. Previously founded Gigwise, sold to private equity. Advises on every mandate and leads Agency A.",
    photo: "/images/andy-day.jpg",
  },
  {
    name: "Jon Goulding",
    title: "Managing Director",
    bio: "Former COO of DDB UK and CEO of Atomic London. Jon leads engagement with founders and buyers, bringing twenty years of running agencies to the other side of the table.",
    photo: "/images/jon-goulding.webp",
  },
  {
    name: "Ahmed Zia",
    title: "Associate",
    bio: "Analytics, valuation and deal execution. Ahmed runs the data spine of the firm, from the valuation engine to transaction support.",
    photo: "/images/ahmed-zia.jpg",
  },
  {
    name: "Heather Fullerton",
    title: "Senior Advisor",
    bio: "Investor relationships and capital formation for Agency A.",
    photo: "/images/heather-fullerton.jpg",
  },
  {
    name: "Dee Day",
    title: "Client Management",
    bio: "The continuity in every mandate, from onboarding through completion.",
    photo: null,
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
              className="grid md:grid-cols-12 gap-8 items-center py-10 border-b border-white/10 hover:bg-white/[0.02] transition-colors"
            >
              {/* Photo */}
              <div className="md:col-span-2">
                {p.photo ? (
                  <div className="relative w-16 h-16 md:w-20 md:h-20 overflow-hidden grayscale">
                    <Image
                      src={p.photo}
                      alt={p.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 border border-white/10" />
                )}
              </div>
              {/* Name + title */}
              <div className="md:col-span-4">
                <p className="font-serif text-xl font-light">{p.name}</p>
                <p className="text-xs tracking-[0.15em] uppercase text-[#c9a84c] mt-2">{p.title}</p>
              </div>
              {/* Bio */}
              <p className="md:col-span-6 text-white/50 leading-relaxed text-sm">{p.bio}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
