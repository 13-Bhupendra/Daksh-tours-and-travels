import { Link } from "@tanstack/react-router";
import { Phone, MapPin, MessageCircle, Instagram } from "lucide-react";
import { business, defaultWhatsappMessage, navLinks, telLink, whatsappLink } from "@/data/business";
import { services } from "@/data/services";
import { destinations } from "@/data/destinations";
import { Logo } from "./primitives";
export function SiteFooter() {
    const year = new Date().getFullYear();
    const icon = "grid h-11 w-11 place-items-center rounded-full border border-line-dark transition-colors hover:border-gold hover:text-gold";
    return (<footer className="bg-navy-deep text-on-dark-muted">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-2 md:px-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-6 max-w-sm leading-relaxed">{business.name} — cab rental, airport transfers, outstation trips, car and bus rental from Nashik, Maharashtra.</p>
          <div className="mt-8 flex gap-3 text-on-dark">
            <a href={whatsappLink(defaultWhatsappMessage)} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className={icon}><MessageCircle className="h-4 w-4"/></a>
            <a href={telLink} aria-label={`Call ${business.phoneDisplay}`} className={icon}><Phone className="h-4 w-4"/></a>
            {business.instagramUrl ? (<a href={business.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={icon}><Instagram className="h-4 w-4"/></a>) : (<span aria-label="Instagram (coming soon)" title="Instagram coming soon" className={`${icon} opacity-50`}><Instagram className="h-4 w-4"/></span>)}
          </div>
        </div>
        <div>
          <h3 className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-gold">Explore</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {navLinks.map((l) => <li key={l.to}><Link to={l.to} className="hover:text-on-dark">{l.label}</Link></li>)}
            <li><Link to="/enquiry" className="hover:text-on-dark">Booking Enquiry</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-gold">Services</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {services.map((s) => <li key={s.id}><Link to="/enquiry" search={{ service: s.title }} className="hover:text-on-dark">{s.title}</Link></li>)}
          </ul>
          <h3 className="mt-8 font-sans text-xs font-bold uppercase tracking-[0.3em] text-gold">Destinations</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {destinations.map((d) => <li key={d.id}><Link to="/enquiry" search={{ destination: d.name }} className="hover:text-on-dark">{d.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-gold">Contact</h3>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="text-on-dark">{business.contactPerson}</li>
            <li><a href={telLink} className="flex items-center gap-2 hover:text-on-dark"><Phone className="h-4 w-4 text-gold"/>{business.phoneDisplay}</a></li>
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold"/>{business.address}</li>
            <li><a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-gold underline-offset-4 hover:underline">Open in Google Maps</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line-dark">
        <p className="mx-auto max-w-7xl px-5 py-6 text-xs md:px-8">© {year} {business.name}. All rights reserved.</p>
      </div>
    </footer>);
}
