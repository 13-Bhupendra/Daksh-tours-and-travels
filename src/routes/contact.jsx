import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { PageBanner } from "@/components/site/primitives";
import { business, defaultWhatsappMessage, telLink, whatsappLink } from "@/data/business";
import { media } from "@/data/media";
export const Route = createFileRoute("/contact")({
    head: () => ({ meta: [
            { title: "Contact | Daksh Tours and Travels" },
            { name: "description", content: "Call or WhatsApp Daksh Tours and Travels, Gangapur Road, Nashik." },
            { property: "og:title", content: "Contact | Daksh Tours and Travels" },
            { property: "og:description", content: "Call or WhatsApp Daksh Tours and Travels, Gangapur Road, Nashik." },
        ] }),
    component: () => (<>
      <PageBanner eyebrow="Contact" title="Let's plan your trip" intro="Call, message or visit us in Nashik." image={media.mumbai}/>
      <section className="mx-auto max-w-3xl space-y-4 px-5 py-20">
        <h2 className="text-3xl text-navy">{business.name}</h2>
        <p className="text-muted-foreground">Contact person: {business.contactPerson}</p>
        <p className="flex gap-2"><Phone className="h-5 w-5 text-gold"/>{business.phoneDisplay}</p>
        <p className="flex gap-2"><MapPin className="h-5 w-5 shrink-0 text-gold"/>{business.address}</p>
        <div className="flex flex-wrap gap-4 pt-4">
          <a href={telLink} className="btn-navy"><Phone className="h-4 w-4"/>Call Now</a>
          <a href={whatsappLink(defaultWhatsappMessage)} target="_blank" rel="noopener noreferrer" className="btn-outline"><MessageCircle className="h-4 w-4"/>WhatsApp</a>
          <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline"><MapPin className="h-4 w-4"/>Google Maps</a>
          <Link to="/enquiry" className="btn-gold">Booking Form</Link>
        </div>
      </section>
    </>),
});
