import { createFileRoute } from "@tanstack/react-router";
import { PageBanner } from "@/components/site/primitives";
import { CtaBand } from "@/components/site/sections";
import { business } from "@/data/business";
import { media } from "@/data/media";
export const Route = createFileRoute("/about")({
    head: () => ({ meta: [
            { title: "About Us | Daksh Tours and Travels" },
            { name: "description", content: "Meet Daksh Tours and Travels, a Nashik travel service led by Vaishnav Hemant Borse." },
            { property: "og:title", content: "About Us | Daksh Tours and Travels" },
            { property: "og:description", content: "Meet Daksh Tours and Travels, a Nashik travel service led by Vaishnav Hemant Borse." },
        ] }),
    component: () => (<>
      <PageBanner eyebrow="About Us" title="Comfortable journeys from Nashik" intro={`${business.name} offers cab, car and bus rentals.`} image={media.aboutHero}/>
      <section className="mx-auto max-w-3xl px-5 py-20 text-lg leading-relaxed text-muted-foreground">
        <p>{business.name} is based on Gangapur Road, Nashik, and helps travellers with cab rental, airport pickup and drop, outstation bookings, car rental and bus rental.</p>
        <p className="mt-6">Your contact person is <strong className="text-navy">{business.contactPerson}</strong>, who will help plan your trip — reach out on {business.phoneDisplay}.</p>
      </section>
      <CtaBand />
    </>),
});
