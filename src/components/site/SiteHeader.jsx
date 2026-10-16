import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";
import { business, navLinks, telLink } from "@/data/business";
import { BookingMenu } from "./BookingMenu";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-ivory/95 py-2 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-5 md:px-8">
          <Link
            to="/"
            aria-label={`${business.name} home`}
            className="flex min-w-0 items-center gap-2.5 sm:gap-3"
          >
            <img
              src={logo}
              alt=""
              aria-hidden="true"
              className="h-11 w-11 shrink-0 object-contain sm:h-12 sm:w-12"
            />
            <span className="max-w-[8.5rem] text-xs font-bold leading-tight text-navy sm:max-w-none sm:text-base">
              {business.name}
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <BookingMenu
              label="Enquiry"
              compact
              buttonClass="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-2.5 text-xs font-bold text-navy-deep transition-colors hover:bg-gold-soft sm:px-5 sm:text-sm"
            />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="site-sidebar"
              className="grid h-10 w-10 place-items-center rounded-full border border-border text-navy transition-colors hover:border-gold hover:text-navy-deep sm:h-11 sm:w-11"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn("fixed inset-0 z-50", open ? "pointer-events-auto" : "pointer-events-none")}
        aria-hidden={!open}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
          className={cn(
            "absolute inset-0 bg-navy-deep/70 backdrop-blur-sm transition-opacity duration-500",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <aside
          id="site-sidebar"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className={cn(
            "absolute right-0 top-0 flex h-full w-[min(100%,24rem)] flex-col overflow-y-auto bg-navy-deep px-5 py-5 text-on-dark transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-6 sm:py-6",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between">
            <Link
              to="/"
              aria-label={`${business.name} home`}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="flex items-center gap-3"
            >
              <img
                src={logo}
                alt={`${business.name} logo`}
                className="h-12 w-12 shrink-0 object-contain"
              />
              <span className="max-w-40 text-sm font-semibold leading-tight text-on-dark">
                {business.name}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              tabIndex={open ? 0 : -1}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-dark transition-colors hover:border-gold hover:text-gold"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <nav className="mt-6 flex flex-col sm:mt-8" aria-label="Sidebar">
            {[...navLinks, { to: "/enquiry", label: "Booking Enquiry" }].map((link, index) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                activeOptions={{ exact: link.to === "/" }}
                style={{ transitionDelay: open ? `${150 + index * 60}ms` : "0ms" }}
                className={cn(
                  "group flex items-baseline gap-3 border-b border-line-dark py-2.5 font-display text-xl transition-all duration-700 hover:text-gold data-[status=active]:text-gold sm:py-3 sm:text-2xl",
                  open ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0",
                )}
              >
                <span className="font-sans text-xs text-gold">0{index + 1}</span>
                {link.label}
              </Link>
            ))}
          </nav>
          <div
            className={cn(
              "mt-auto space-y-2.5 pt-6 text-xs text-on-dark-muted transition-opacity delay-500 duration-700 sm:text-sm",
              open ? "opacity-100" : "opacity-0",
            )}
          >
            <a href={telLink} tabIndex={open ? 0 : -1} className="flex items-center gap-2.5 hover:text-gold">
              <Phone className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              {business.phoneDisplay}
            </a>
            <a
              href={business.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={open ? 0 : -1}
              className="flex items-start gap-2.5 hover:text-gold"
            >
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" aria-hidden="true" />
              {business.address}
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
