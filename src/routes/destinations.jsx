import { createFileRoute } from "@tanstack/react-router";
import { PageBanner } from "@/components/site/primitives";
import { DestinationCard, CtaBand } from "@/components/site/sections";
import { destinations } from "@/data/destinations";
import { media } from "@/data/media";
export const Route = createFileRoute("/destinations")({
    head: () => ({ meta: [
            { title: "Destinations | Daksh Tours and Travels" },
            { name: "description", content: "Travel from Nashik to Shirdi, Mumbai, Trimbakeshwar and more." },
            { property: "og:title", content: "Destinations | Daksh Tours and Travels" },
            { property: "og:description", content: "Travel from Nashik to Shirdi, Mumbai, Trimbakeshwar and more." },
        ] }),
    component: () => (<>
      <PageBanner eyebrow="Destinations" title="Journeys worth taking" intro="Pilgrimages, city trips and scenic escapes." image={media.destinationsHero}/>
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-20 md:grid-cols-2 md:px-8">
        {destinations.map((d) => (<div key={d.id}><DestinationCard d={d}/><p className="mt-4 text-muted-foreground">{d.description}</p></div>))}
      </section>
      <CtaBand />
    </>),
});
