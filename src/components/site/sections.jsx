import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Star, MessageCircle, Phone } from "lucide-react";
import { reviews, demoReviews } from "@/data/reviews";
import { defaultWhatsappMessage, telLink, whatsappLink } from "@/data/business";
import { media } from "@/data/media";
import { BookingMenu } from "./BookingMenu";
import { Reveal, SectionHeading, SmartImage } from "./primitives";
export function DestinationCard({ d, tall }) {
    return (<article className="group relative overflow-hidden rounded-2xl bg-navy">
      <SmartImage src={d.image} alt={`${d.name} — ${d.tagline}`} width={1200} height={1504} className={tall ? "aspect-[3/4]" : "aspect-[4/5]"} imgClassName="transition-transform duration-[1400ms] ease-out group-hover:scale-110"/>
      <div className="overlay-card pointer-events-none absolute inset-0"/>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="eyebrow">{d.tagline}</p>
        <h3 className="mt-2 text-3xl text-on-dark">{d.name}</h3>
        <Link to="/enquiry" search={{ destination: d.name }} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-on-dark transition-colors hover:text-gold">
          Enquire for {d.name} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/>
        </Link>
      </div>
    </article>);
}
export function VehicleCard({ v }) {
    return (<article className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-soft">
      <SmartImage src={v.image} alt={`${v.name} vehicle`} width={1200} height={800} className="aspect-[3/2]" imgClassName="transition-transform duration-[1200ms] group-hover:scale-105"/>
      <div className="flex items-end justify-between gap-4 p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">{v.category}</p>
          <h3 className="mt-1 text-2xl text-navy">{v.name}</h3>
        </div>
        <Link to="/enquiry" search={{ vehicle: v.name }} className="btn-outline !px-4 !py-2 text-xs">Enquire</Link>
      </div>
    </article>);
}
function ReviewBox({ name, text }) {
    return (<figure className="flex w-[16rem] shrink-0 flex-col rounded-2xl border border-line-dark bg-navy p-5 sm:w-[18rem] sm:p-6">
      <div className="flex gap-1 text-gold" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4" aria-hidden/>)}
      </div>
      <blockquote className="mt-3 flex-1 font-display text-base leading-relaxed text-on-dark sm:mt-4 sm:text-[1.05rem]">“{text}”</blockquote>
      <figcaption className="mt-4 border-t border-line-dark pt-3 text-xs font-semibold text-gold sm:mt-5 sm:pt-3.5 sm:text-sm">{name}</figcaption>
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
    return (<section className="overflow-hidden bg-navy-deep py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading center light eyebrow="Testimonials" title="What Our Travellers Say"/>
        {reviews === demoReviews && <p className="mt-4 text-center text-xs text-on-dark-muted">Sample reviews shown for preview purposes.</p>}
      </div>
      <div className="mt-10 space-y-4 sm:mt-12 sm:space-y-5">
        <MarqueeRow items={rowA} direction="left"/>
        <MarqueeRow items={rowB} direction="right"/>
      </div>
    </section>);
}
export function CtaBand() {
    return (<section className="relative overflow-hidden bg-navy-deep">
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
