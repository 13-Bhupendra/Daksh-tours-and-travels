import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import { BookingMenu } from "@/components/site/BookingMenu";
import { BookingPopup } from "@/components/site/BookingPopup";
import { SectionHeading } from "@/components/site/primitives";
import { CtaBand, DestinationCard, ReviewsMarquee, VehicleCard } from "@/components/site/sections";
import { destinations } from "@/data/destinations";
import { services } from "@/data/services";
import { vehicles } from "@/data/vehicles";
import { media } from "@/data/media";
export const Route = createFileRoute("/")({
    head: () => ({ meta: [
            { title: "Daksh Tours and Travels | Cab, Car & Bus Rental in Nashik" },
            { name: "description", content: "Comfortable cab rental, airport transfers, outstation trips and bus rental from Nashik." },
            { property: "og:title", content: "Daksh Tours and Travels | Nashik" },
            { property: "og:description", content: "Comfortable cab rental, airport transfers, outstation trips and bus rental from Nashik." },
        ] }),
    component: Index,
});
function Index() {
    return (<>
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy-deep">
        <video className="absolute inset-0 h-full w-full object-cover" src={media.heroVideo} poster={media.hero} autoPlay muted loop playsInline preload="metadata"/>
        <div className="overlay-hero absolute inset-0"/>
        <div className="relative mx-auto w-full max-w-7xl px-5 pt-24 md:px-8">
          <p className="eyebrow animate-rise">Nashik · Maharashtra</p>
          <h1 className="animate-rise mt-5 max-w-4xl text-5xl leading-[0.98] text-on-dark md:text-8xl" style={{ animationDelay: "150ms" }}>
            Memorable journeys, <em className="text-gold">comfortably</em> travelled.
          </h1>
          <p className="animate-rise mt-6 max-w-xl text-lg text-on-dark-muted" style={{ animationDelay: "300ms" }}>Cabs, cars and buses for local, airport and outstation travel with Daksh Tours and Travels.</p>
          <div className="animate-rise mt-10 flex flex-wrap gap-4" style={{ animationDelay: "450ms" }}>
            <BookingMenu label="Book Your Ride" align="left"/>
            <Link to="/destinations" className="btn-ghost-light">Explore Destinations</Link>
          </div>
        </div>
        <ArrowDown className="animate-scroll-dot absolute bottom-8 left-1/2 h-5 w-5 -translate-x-1/2 text-on-dark" aria-hidden/>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <SectionHeading eyebrow="What we do" title="Travel made simple" intro="From a quick airport drop to a family pilgrimage, we arrange the ride."/>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.filter((s) => s.id !== "car-rental").map((s) => (<div key={s.id} className="rounded-2xl border border-border bg-card p-7">
              <s.icon className="h-7 w-7 text-gold" aria-hidden/>
              <h3 className="mt-5 text-2xl text-navy">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{s.summary}</p>
            </div>))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <SectionHeading eyebrow="Popular destinations" title="Where shall we go?"/>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{destinations.map((d) => <DestinationCard key={d.id} d={d}/>)}</div>
      </section>

      <section className="bg-secondary py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading eyebrow="Our fleet" title="Choose your ride"/>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{vehicles.map((v) => <VehicleCard key={v.id} v={v}/>)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <SectionHeading eyebrow="How booking works" title="Three easy steps"/>
        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {["Share your trip details through the form, a call or WhatsApp.", "We reply to confirm the vehicle and timing.", "Your driver arrives and the journey begins."].map((t, i) => (<li key={i} className="border-t border-gold pt-6"><span className="font-display text-5xl text-gold">0{i + 1}</span><p className="mt-4 text-muted-foreground">{t}</p></li>))}
        </ol>
      </section>

      <ReviewsMarquee />
      <CtaBand />
      <BookingPopup />
    </>);
}
