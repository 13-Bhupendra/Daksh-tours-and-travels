import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Star, MessageCircle, Phone, Car, MapPin } from "lucide-react";
import { reviews, demoReviews } from "@/data/reviews";
import { defaultWhatsappMessage, telLink, whatsappLink } from "@/data/business";
import { media } from "@/data/media";
import { BookingMenu } from "./BookingMenu";
import { Reveal, SectionHeading, SmartImage } from "./primitives";
export function DestinationCard({ d, tall }) {
    return (<article className="destination-card group relative overflow-hidden rounded-2xl bg-navy">
      <SmartImage src={d.image} alt={`${d.name} — ${d.tagline}`} width={1200} height={1504} className={tall ? "aspect-[3/4]" : "aspect-[4/5]"} imgClassName="transition-transform duration-[1400ms] ease-out group-hover:scale-110"/>
      <div className="overlay-card pointer-events-none absolute inset-0"/>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="eyebrow">{d.tagline}</p>
        <h3 className="mt-2 text-3xl text-white">{d.name}</h3>
        <Link to="/enquiry" search={{ destination: d.name }} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-gold">
          Enquire for {d.name} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/>
        </Link>
      </div>
    </article>);
}
export function VehicleCard({ v }) {
    return (<article className="fleet-card group overflow-hidden">
      <SmartImage src={v.image} alt={`${v.name} vehicle`} width={1200} height={800} className="fleet-photo aspect-[16/10]" imgClassName="object-cover"/>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-sans text-xl font-extrabold tracking-tight text-navy sm:text-2xl">{v.name}</h3>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{v.category}</p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-primary"><Car className="h-5 w-5" aria-hidden="true"/></span>
        </div>
        <div className="fleet-spec mt-5 grid grid-cols-[auto_1fr] items-center gap-3 px-3.5 py-3">
          <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
          <div><p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">Best suited for</p><p className="mt-0.5 text-xs font-semibold leading-relaxed text-foreground">{v.note}</p></div>
        </div>
        <Link to="/enquiry" search={{ vehicle: v.name }} className="btn-gold mt-5 w-full justify-center !py-3 text-sm">Book this vehicle <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5"/></Link>
      </div>
    </article>);
}
function ReviewBox({ name, text }) {
    return (<figure className="flex h-44 w-[15rem] shrink-0 flex-col rounded-2xl border border-line-dark bg-card p-4 shadow-soft sm:h-48 sm:w-[16.5rem] sm:p-5">
      <div className="flex gap-1 text-gold" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4" aria-hidden/>)}
      </div>
      <blockquote className="mt-2 line-clamp-4 flex-1 font-display text-sm leading-relaxed text-on-dark sm:mt-3 sm:text-[0.95rem]">“{text}”</blockquote>
      <figcaption className="mt-3 border-t border-line-dark pt-2.5 text-xs font-semibold text-gold sm:mt-3.5 sm:pt-3 sm:text-sm">{name}</figcaption>
    </figure>);
}
function MarqueeRow({ items, direction }) {
    // Two identical halves → translate -50% loops seamlessly.
    const doubled = [...items, ...items];
    return (<div className="marquee marquee-mask overflow-hidden">
      <div className={`marquee-track ${direction === "left" ? "marquee-left" : "marquee-right"}`}>
        {doubled.map((r, i) => <div key={i} aria-hidden={i >= items.length}><ReviewBox {...r}/></div>)}
      </div>
    </div>);
}
export function ReviewsMarquee() {
    const half = Math.ceil(reviews.length / 2);
    const rowA = [...reviews.slice(0, half), ...reviews.slice(half)];
    const rowB = [...reviews.slice(half), ...reviews.slice(0, half)];
    return (<section className="dark-reviews overflow-hidden py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading center light eyebrow="Testimonials" title="What Our Travellers Say"/>
        {reviews === demoReviews && <p className="mt-4 text-center text-xs text-on-dark-muted">Sample reviews shown for preview purposes.</p>}
      </div>
      <div className="mt-7 space-y-3 sm:mt-8 sm:space-y-4">
        <MarqueeRow items={rowA} direction="left"/>
        <MarqueeRow items={rowB} direction="right"/>
      </div>
    </section>);
}
export function CtaBand() {
    return (<section className="dark-cinematic relative overflow-hidden">
      <img src={media.hero} alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-40"/>
      <div className="overlay-hero absolute inset-0"/>
      <Reveal className="relative mx-auto max-w-4xl px-5 py-28 text-center md:py-36">
        <p className="eyebrow">Your road awaits</p>
        <h2 className="mt-5 text-4xl leading-tight text-on-dark md:text-6xl">Wherever the journey leads, travel there in comfort.</h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <BookingMenu label="Book Your Ride" align="left" up/>
          <a href={telLink} className="btn-ghost-light"><Phone className="h-4 w-4"/>Call Now</a>
          <a href={whatsappLink(defaultWhatsappMessage)} target="_blank" rel="noopener noreferrer" className="btn-ghost-light"><MessageCircle className="h-4 w-4"/>WhatsApp</a>
        </div>
      </Reveal>
    </section>);
}
