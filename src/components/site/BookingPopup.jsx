import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X, MessageCircle, ArrowRight } from "lucide-react";
import { defaultWhatsappMessage, whatsappLink } from "@/data/business";
import { media } from "@/data/media";
import { cn } from "@/lib/utils";
const KEY = "daksh-popup-dismissed";
export function BookingPopup() {
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const closeRef = useRef(null);
    useEffect(() => {
        if (sessionStorage.getItem(KEY))
            return;
        const t = setTimeout(() => { setMounted(true); requestAnimationFrame(() => setOpen(true)); }, 3000);
        return () => clearTimeout(t);
    }, []);
    const close = () => {
        sessionStorage.setItem(KEY, "1");
        setOpen(false);
        setTimeout(() => setMounted(false), 500);
    };
    useEffect(() => {
        if (!open)
            return;
        closeRef.current?.focus();
        const onKey = (e) => { if (e.key === "Escape")
            close(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open]);
    if (!mounted)
        return null;
    return (<div className="fixed inset-0 z-[60] grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="popup-title">
      <div onClick={close} className={cn("absolute inset-0 bg-navy-deep/70 backdrop-blur-sm transition-opacity duration-500", open ? "opacity-100" : "opacity-0")}/>
      <div className={cn("relative grid w-full max-w-3xl overflow-hidden rounded-3xl bg-card shadow-soft transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:grid-cols-2", open ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-95 opacity-0")}>
        <div className="relative h-44 md:h-auto">
          <img src={media.trimbak} alt="Trimbakeshwar temple beneath the Brahmagiri hills" className="absolute inset-0 h-full w-full object-cover"/>
          <div className="overlay-card absolute inset-0"/>
        </div>
        <div className="p-7 md:p-10">
          <button ref={closeRef} type="button" onClick={close} aria-label="Close booking popup" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-card/90 text-navy transition-colors hover:bg-secondary">
            <X className="h-5 w-5"/>
          </button>
          <p className="eyebrow">Daksh Tours and Travels</p>
          <h2 id="popup-title" className="mt-3 text-3xl leading-tight text-navy md:text-4xl">Planning Your Next Journey?</h2>
          <p className="mt-4 text-muted-foreground">Tell us where you're headed — cabs, cars and buses for local, airport and outstation trips from Nashik.</p>
          <div className="mt-7 flex flex-col gap-3">
            <Link to="/enquiry" onClick={close} className="btn-navy justify-center">Start Booking <ArrowRight className="h-4 w-4"/></Link>
            <a href={whatsappLink(defaultWhatsappMessage)} target="_blank" rel="noopener noreferrer" onClick={close} className="btn-outline justify-center">
              <MessageCircle className="h-4 w-4"/> WhatsApp Enquiry
            </a>
          </div>
        </div>
      </div>
    </div>);
}
