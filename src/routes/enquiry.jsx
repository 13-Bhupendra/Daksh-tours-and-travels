import { createFileRoute } from "@tanstack/react-router";
import { cloneElement, useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, LoaderCircle, MessageCircle, Phone, X } from "lucide-react";
import { PageBanner } from "@/components/site/primitives";
import { media } from "@/data/media";
import { vehicles } from "@/data/vehicles";
import { business, telLink } from "@/data/business";
import { buildWeb3FormsPayload, maxJourneyDateISO, todayISO, tripTypes, validateEnquiry } from "@/lib/enquiry";

const WEB3FORMS_ACCESS_KEY = "f55994d2-c4bd-4c61-9567-b77a2b3cb546";
const emptyForm = {
    name: "", mobile: "", pickup: "", destination: "", date: "",
    tripType: "", vehicle: "", passengers: "1", returnDate: "", details: "",
};

export const Route = createFileRoute("/enquiry")({
    validateSearch: (s) => ({
        destination: typeof s.destination === "string" ? s.destination : undefined,
        vehicle: typeof s.vehicle === "string" ? s.vehicle : undefined,
        service: typeof s.service === "string" ? s.service : undefined,
    }),
    head: () => ({
        meta: [
            { title: "Booking Enquiry | Daksh Tours and Travels" },
            { name: "description", content: "Send a booking enquiry for cabs, cars and buses from Nashik." },
            { property: "og:title", content: "Booking Enquiry | Daksh Tours and Travels" },
            { property: "og:description", content: "Send a booking enquiry for cabs, cars and buses from Nashik." },
        ],
    }),
    component: Enquiry,
});
function Enquiry() {
    const s = Route.useSearch();
    const [d, setD] = useState(() => ({
        ...emptyForm,
        destination: s.destination ?? "",
        vehicle: s.vehicle ?? "",
        details: s.service ? `Service: ${s.service}` : "",
    }));
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const submittingRef = useRef(false);
    const attemptedRef = useRef(false);
    const today = todayISO();
    const maxDate = maxJourneyDateISO(today);
    const set = (k) => (e) => {
        const next = { ...d, [k]: e.target.value };
        setD(next);
        if (attemptedRef.current) setErrors(validateEnquiry(next, today, maxDate));
    };
    const submit = async (e) => {
        e.preventDefault();
        if (submittingRef.current) return;
        attemptedRef.current = true;
        const errs = validateEnquiry(d, today, maxDate);
        setErrors(errs);
        if (Object.keys(errs).length)
            return;
        submittingRef.current = true;
        setSubmitting(true);
        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(buildWeb3FormsPayload(d, WEB3FORMS_ACCESS_KEY)),
            });
            let result;
            try {
                result = await response.json();
            } catch {
                throw new Error("The booking service returned an invalid response. Please try again or call us.");
            }
            if (!response.ok || result?.success !== true) {
                throw new Error(result?.message || "We couldn't send your enquiry. Please try again.");
            }
            setD({ ...emptyForm });
            setErrors({});
            attemptedRef.current = false;
            setFeedback({
                type: "success",
                title: "Message Sent Successfully!",
                message: `Thank you for contacting ${business.name}. We have received your booking enquiry and will get back to you shortly.`,
            });
        } catch (error) {
            setFeedback({
                type: "error",
                title: "Unable to Send Your Message",
                message: error instanceof TypeError
                    ? "We couldn't connect to the booking service. Check your connection and try again, or call us directly."
                    : error instanceof Error
                        ? error.message
                        : "Something went wrong while sending your enquiry. Please try again.",
            });
        } finally {
            submittingRef.current = false;
            setSubmitting(false);
        }
    };
    useEffect(() => {
        if (!feedback) return;
        const onKeyDown = (event) => {
            if (event.key === "Escape") setFeedback(null);
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [feedback]);
    const field = (k, label, input) => (<label className="block">
      <span className="text-sm font-semibold text-navy">{label}</span>
      <div className="mt-2">{cloneElement(input, {
        id: `enquiry-${k}`,
        "aria-invalid": Boolean(errors[k]),
        "aria-describedby": errors[k] ? `enquiry-${k}-error` : undefined,
      })}</div>
      {errors[k] && <span id={`enquiry-${k}-error`} role="alert" className="mt-1 block text-sm text-destructive">{errors[k]}</span>}
    </label>);
    const cls = "w-full rounded-xl border border-input bg-card px-4 py-3 text-foreground";
    return (<>
      <PageBanner eyebrow="Booking Enquiry" title="Plan your journey" intro="Share your trip details and our team will get back to you shortly." image={media.bookingHero} className="booking-page-hero"/>
      <section className="mx-auto max-w-3xl px-5 py-20">
        <form onSubmit={submit} noValidate className="grid gap-6 md:grid-cols-2">
          {field("name", "Full name", <input required minLength={2} maxLength={80} autoComplete="name" className={cls} value={d.name} onChange={set("name")} placeholder="Your name" disabled={submitting}/>)}
          {field("mobile", "Mobile number", <input required maxLength={16} autoComplete="tel" className={cls} value={d.mobile} onChange={set("mobile")} placeholder="10-digit mobile" inputMode="tel" disabled={submitting}/>)}
          {field("pickup", "Pickup location", <input required minLength={2} maxLength={120} autoComplete="street-address" className={cls} value={d.pickup} onChange={set("pickup")} placeholder="e.g. Gangapur Road, Nashik" disabled={submitting}/>)}
          {field("destination", "Destination", <input required minLength={2} maxLength={120} className={cls} value={d.destination} onChange={set("destination")} placeholder="e.g. Shirdi" disabled={submitting}/>)}
          {field("date", "Journey date", <input required type="date" min={today} max={maxDate} className={cls} value={d.date} onChange={set("date")} disabled={submitting}/>)}
          {field("tripType", "Trip type", <select required className={cls} value={d.tripType} onChange={set("tripType")} disabled={submitting}><option value="">Select</option>{tripTypes.map((t) => <option key={t}>{t}</option>)}</select>)}
          {d.tripType === "Round Trip" && field("returnDate", "Return date", <input required type="date" min={d.date || today} max={maxDate} className={cls} value={d.returnDate} onChange={set("returnDate")} disabled={submitting}/>)}
          {field("vehicle", "Vehicle preference", <select required className={cls} value={d.vehicle} onChange={set("vehicle")} disabled={submitting}><option value="">Choose a vehicle</option><option value="No preference">No preference</option>{vehicles.map((v) => <option key={v.id} value={v.name}>{v.name}</option>)}</select>)}
          {field("passengers", "Passengers", <input required type="number" min={1} max={50} step={1} className={cls} value={d.passengers} onChange={set("passengers")} disabled={submitting}/>)}
          <div className="md:col-span-2">{field("details", "Additional details (optional)", <textarea rows={4} className={cls} value={d.details} onChange={set("details")} placeholder="Luggage, flight time, stops…" disabled={submitting}/>)}</div>
          <div className="md:col-span-2 flex flex-wrap gap-4">
            <button type="submit" disabled={submitting} className="btn-gold disabled:cursor-not-allowed disabled:opacity-70">
              {submitting ? <><LoaderCircle className="h-4 w-4 animate-spin"/>Sending Enquiry…</> : <><MessageCircle className="h-4 w-4"/>Send Booking Enquiry</>}
            </button>
            <a href={telLink} className="btn-outline"><Phone className="h-4 w-4"/>Call Now</a>
          </div>
          <p className="md:col-span-2 text-sm text-muted-foreground">Your enquiry will be sent securely to our team. Your booking is confirmed only after we reply.</p>
        </form>
      </section>
      {feedback && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="enquiry-feedback-title"
          aria-describedby="enquiry-feedback-message"
        >
          <button
            type="button"
            onClick={() => setFeedback(null)}
            aria-label="Close message"
            className="absolute inset-0 bg-[#101B2D]/70 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md rounded-3xl border border-gold/20 bg-card p-7 text-center shadow-soft sm:p-9">
            <button
              type="button"
              onClick={() => setFeedback(null)}
              aria-label="Close message"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-navy"
            >
              <X className="h-4 w-4" aria-hidden="true"/>
            </button>
            {feedback.type === "success"
              ? <CheckCircle2 className="mx-auto h-12 w-12 text-gold" aria-hidden="true"/>
              : <AlertCircle className="mx-auto h-12 w-12 text-destructive" aria-hidden="true"/>}
            <h2 id="enquiry-feedback-title" className="mt-5 font-display text-3xl leading-tight text-navy">
              {feedback.title}
            </h2>
            <p id="enquiry-feedback-message" className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {feedback.message}
            </p>
            <button type="button" onClick={() => setFeedback(null)} className="btn-navy mt-6 justify-center">
              {feedback.type === "success" ? "Continue" : "Try Again"}
            </button>
          </div>
        </div>
      )}
    </>);
}
