import { createFileRoute } from "@tanstack/react-router";
import { PageBanner } from "@/components/site/primitives";
import { VehicleCard, CtaBand } from "@/components/site/sections";
import { vehicles } from "@/data/vehicles";
import { media } from "@/data/media";
export const Route = createFileRoute("/fleet")({
    head: () => ({ meta: [
            { title: "Our Fleet | Daksh Tours and Travels" },
            { name: "description", content: "Aura, Ertiga, Innova, Eeco, Swift and buses for every journey." },
            { property: "og:title", content: "Our Fleet | Daksh Tours and Travels" },
            { property: "og:description", content: "Aura, Ertiga, Innova, Eeco, Swift and buses for every journey." },
        ] }),
    component: () => (<>
      <PageBanner eyebrow="Our Fleet" title="A vehicle for every journey" intro="Pick a vehicle and we'll confirm availability." image={media.fleetHero}/>
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-20 sm:grid-cols-2 md:px-8 lg:grid-cols-3">
        {vehicles.map((v) => <VehicleCard key={v.id} v={v}/>)}
      </section>
      <CtaBand />
    </>),
});
