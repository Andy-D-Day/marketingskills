export const metadata = {
  title: "Contact | Capital A",
  description: "Get in touch with Capital A.",
};

export default function Contact() {
  return (
    <>
      <section className="pt-48 pb-16 px-6 md:px-12 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a84c] mb-6">Contact</p>
          <h1 className="font-serif text-5xl md:text-6xl font-light leading-tight max-w-2xl">
            Get in touch.
          </h1>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20">
          <div className="space-y-10">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3">Address</p>
              <p className="text-white/60 leading-relaxed">
                13 Hanover Square<br />
                London W1S 1HN
              </p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3">Andy Day</p>
              <a
                href="mailto:andy@capitala.co"
                className="text-[#c9a84c] hover:text-[#e8cc7a] transition-colors"
              >
                andy@capitala.co
              </a>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3">Sell-side enquiries</p>
              <a
                href="https://agencies.co"
                className="text-[#c9a84c] hover:text-[#e8cc7a] transition-colors text-sm"
              >
                agencies.co →
              </a>
            </div>
          </div>

          <form className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] tracking-[0.3em] uppercase text-white/30 block mb-2">Name</label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c9a84c] transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-[9px] tracking-[0.3em] uppercase text-white/30 block mb-2">Email</label>
                <input
                  type="email"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c9a84c] transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="text-[9px] tracking-[0.3em] uppercase text-white/30 block mb-2">Company</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c9a84c] transition-colors"
                placeholder="Agency or firm"
              />
            </div>
            <div>
              <label className="text-[9px] tracking-[0.3em] uppercase text-white/30 block mb-2">Message</label>
              <textarea
                rows={5}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c9a84c] transition-colors resize-none"
                placeholder="What are you working on?"
              />
            </div>
            <button
              type="submit"
              className="bg-[#c9a84c] text-black px-10 py-4 text-xs tracking-[0.25em] uppercase hover:bg-[#e8cc7a] transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
