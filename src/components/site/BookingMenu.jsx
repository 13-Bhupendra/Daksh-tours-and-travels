import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ClipboardList, Phone, MessageCircle, ChevronDown } from "lucide-react";
import { defaultWhatsappMessage, telLink, whatsappLink } from "@/data/business";
import { cn } from "@/lib/utils";
export function BookingMenu({ label = "Book Now", buttonClass = "btn-gold", align = "right", up = false, compact = false }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        if (!open)
            return;
        const onDown = (e) => { if (!ref.current?.contains(e.target))
            setOpen(false); };
        const onKey = (e) => { if (e.key === "Escape")
            setOpen(false); };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
    }, [open]);
    const item = cn(
        "flex items-center rounded-xl text-left transition-colors hover:bg-secondary",
        compact ? "gap-3 px-3 py-2.5" : "gap-4 px-4 py-3.5",
    );
    return (<div ref={ref} className="relative inline-block">
      <button type="button" className={buttonClass} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {label}
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")} aria-hidden/>
      </button>
      <div role="menu" className={cn("absolute z-50 origin-top rounded-2xl border border-border bg-popover text-popover-foreground shadow-soft transition-all duration-300", compact ? "w-[min(17rem,calc(100vw-1rem))] p-1.5" : "w-72 p-2", align === "right" ? "right-0" : "left-0", up ? "bottom-full mb-3" : "top-full mt-3", open ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-2 scale-95 opacity-0")}>
        <Link to="/enquiry" role="menuitem" className={item} onClick={() => setOpen(false)}>
          <span className={cn("grid shrink-0 place-items-center rounded-full bg-gold text-navy", compact ? "h-9 w-9" : "h-10 w-10")}><ClipboardList className="h-4 w-4"/></span>
          <span><span className="block font-semibold text-navy">Booking Form</span><span className="text-xs text-muted-foreground">Share your trip details</span></span>
        </Link>
        <a href={telLink} role="menuitem" className={item} onClick={() => setOpen(false)}>
          <span className={cn("grid shrink-0 place-items-center rounded-full bg-gold text-navy-deep", compact ? "h-9 w-9" : "h-10 w-10")}><Phone className="h-4 w-4"/></span>
          <span><span className="block font-semibold text-navy">Call Now</span><span className="text-xs text-muted-foreground">Speak with us directly</span></span>
        </a>
        <a href={whatsappLink(defaultWhatsappMessage)} target="_blank" rel="noopener noreferrer" role="menuitem" className={item} onClick={() => setOpen(false)}>
          <span className={cn("grid shrink-0 place-items-center rounded-full bg-whatsapp text-white", compact ? "h-9 w-9" : "h-10 w-10")}><MessageCircle className="h-4 w-4"/></span>
          <span><span className="block font-semibold text-navy">WhatsApp Enquiry</span><span className="text-xs text-muted-foreground">Chat with a prefilled message</span></span>
        </a>
      </div>
    </div>);
}
