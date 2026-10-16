import { createFileRoute, Link } from "@tanstack/react-router";
import { PageBanner, SmartImage } from "@/components/site/primitives";
import { CtaBand } from "@/components/site/sections";
import { services } from "@/data/services";
import { media } from "@/data/media";
export const Route = createFileRoute("/services")({
    head: () => ({ meta: [
            { title: "Services | Daksh Tours and Travels" },
            { name: "description", content: "Cab rental, airport transfers, outstation trips, car and bus rental in Nashik." },
            { property: "og:title", content: "Services | Daksh Tours and Travels" },
            { property: "og:description", content: "Cab rental, airport transfers, outstation trips, car and bus rental in Nashik." },
        ] }),
    component: () => (<>
      <PageBanner eyebrow="Services" title="Travel, arranged for you" intro="From a quick airport drop to a group tour." image={media.airport}/>
      <section className="mx-auto max-w-7xl space-y-16 px-5 py-20 md:px-8">
        {services.map((s, i) => (<div key={s.id} className="grid items-center gap-8 md:grid-cols-2">
            <SmartImage src={s.image} alt={s.title} className={`aspect-[3/2] rounded-2xl ${i % 2 ? "md:order-2" : ""}`}/>
            <div>
              <s.icon className="h-8 w-8 text-gold" aria-hidden/>
              <h2 className="mt-4 text-4xl text-navy">{s.title}</h2>
              <p className="mt-4 text-muted-foreground">{s.summary} {s.detail}</p>
              <Link to="/enquiry" search={{ service: s.title }} className="btn-navy mt-6">Enquire</Link>
            </div>
          </div>))}
      </section>
      <CtaBand />
    </>),
});
