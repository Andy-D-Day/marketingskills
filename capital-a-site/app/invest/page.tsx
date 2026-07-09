import Link from "next/link";

export const metadata = {
  title: "Invest | Capital A",
  description: "Agency A — our acquisition platform for immersive, experiential and creator economy businesses.",
};

export default function Invest() {
  return (
    <>
      {/* Page header */}
      <section className="pt-48 pb-24 px-6 md:px-12 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a84c] mb-6">Invest</p>
          <h1 className="font-serif text-5xl md:text-6xl font-light leading-tight max-w-3xl">
            Agency A. Our capital, our conviction.
          </h1>
        </div>
      </section>

      {/* Main body */}
      <section className="py-24 px-6 md:px-12 border-b border-white/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-start">
          <div className="space-y-6 text-white/50 leading-relaxed">
            <p>
              Capital A is a principal investor, not only an adviser. Agency A is our acquisition
              platform: we acquire majority positions in immersive, experiential and creator economy
              businesses, the categories where human creativity holds its value, and build them into
              a group with shared infrastructure and a single ambition.
            </p>
            <p>
              We look for founder-led businesses with real client relationships, £1m to £5m of
              EBITDA or a clear path to it, and founders who want to roll equity into something
              bigger rather than simply leave.
            </p>
            <p>Advisory taught us where the value sits. Agency A is where we act on it.</p>
          </div>
          <div className="space-y-px">
            <div className="bg-white/5 p-8 border border-white/10">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] mb-4">For founders</p>
              <p className="text-white/60 leading-relaxed mb-6">
                If your business fits, the conversation starts with what we would build together,
                not with a valuation spreadsheet.
              </p>
              <Link
                href="/contact"
                className="text-xs tracking-[0.2em] uppercase text-[#c9a84c] flex items-center gap-2 hover:gap-3 transition-all"
              >
                <span>Contact Andy directly</span>
                <span>→</span>
              </Link>
            </div>
            <div className="bg-white/5 p-8 border border-white/10 border-t-0">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-4">For investors</p>
              <p className="text-white/60 leading-relaxed mb-6">
                We work with a small group of private investors, many of them founders we have
                previously advised to exit. Enquiries in confidence.
              </p>
              <Link
                href="/contact"
                className="text-xs tracking-[0.2em] uppercase text-[#c9a84c] flex items-center gap-2 hover:gap-3 transition-all"
              >
                <span>Get in touch</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-white/20 leading-relaxed max-w-2xl">
            Capital A Group Ltd is not authorised or regulated by the Financial Conduct Authority.
            Nothing on this page constitutes a financial promotion or an offer to invest.
          </p>
        </div>
      </section>
    </>
  );
}
