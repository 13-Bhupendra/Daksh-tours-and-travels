import { business } from "@/data/business";
export const tripTypes = ["One Way", "Round Trip", "Local / Hourly", "Airport Transfer"];
/** Indian mobile: optional +91/91/0 prefix, then 10 digits starting 6–9. */
export function isValidIndianMobile(value) {
    const cleaned = value.replace(/[\s-]/g, "");
    return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(cleaned);
}
export function todayISO(now = new Date()) {
    const d = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return d.toISOString().slice(0, 10);
}
export function maxJourneyDateISO(today = todayISO()) {
    const [year, month, day] = today.split("-").map(Number);
    const targetMonth = month - 1 + 3;
    const lastDayOfTargetMonth = new Date(Date.UTC(year, targetMonth + 1, 0)).getUTCDate();
    return new Date(Date.UTC(year, targetMonth, Math.min(day, lastDayOfTargetMonth)))
        .toISOString()
        .slice(0, 10);
}
function isValidISODate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
        return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
const namePattern = /^[\p{L}\p{M}][\p{L}\p{M} .'\u2019-]*[\p{L}\p{M}]$/u;

export function validateEnquiry(d, today = todayISO(), maxDate = maxJourneyDateISO(today)) {
    const e = {};
    const name = d.name.trim();
    if (!name)
        e.name = "Please enter your full name.";
    else if (name.length < 2 || name.length > 80 || !namePattern.test(name))
        e.name = "Enter a valid name using letters, spaces, apostrophes or hyphens.";
    if (!d.mobile.trim())
        e.mobile = "Please enter your mobile number.";
    else if (!isValidIndianMobile(d.mobile))
        e.mobile = "Enter a valid 10-digit Indian mobile number.";
    if (!d.pickup.trim())
        e.pickup = "Please enter a pickup location.";
    else if (d.pickup.trim().length < 2 || d.pickup.trim().length > 120)
        e.pickup = "Pickup location must be between 2 and 120 characters.";
    if (!d.destination.trim())
        e.destination = "Please enter a destination.";
    else if (d.destination.trim().length < 2 || d.destination.trim().length > 120)
        e.destination = "Destination must be between 2 and 120 characters.";
    if (!d.date)
        e.date = "Please choose a journey date.";
    else if (!isValidISODate(d.date))
        e.date = "Please enter a valid journey date.";
    else if (d.date < today)
        e.date = "Journey date cannot be in the past.";
    else if (d.date > maxDate)
        e.date = "Journey date must be within the next 3 months.";
    if (!tripTypes.includes(d.tripType))
        e.tripType = "Please choose a trip type.";
    if (!d.vehicle)
        e.vehicle = "Please choose a vehicle preference, or select No preference.";
    if (!d.passengers || !Number.isInteger(Number(d.passengers)) || Number(d.passengers) < 1 || Number(d.passengers) > 50)
        e.passengers = "Enter a whole number between 1 and 50.";
    if (d.tripType === "Round Trip") {
        if (!d.returnDate)
            e.returnDate = "Please choose a return date.";
        else if (!isValidISODate(d.returnDate))
            e.returnDate = "Please enter a valid return date.";
        else if (d.returnDate < (d.date || today))
            e.returnDate = "Return date must be on or after the journey date.";
        else if (d.returnDate > maxDate)
            e.returnDate = "Return date must be within the next 3 months.";
    }
    return e;
}
export function buildEnquiryMessage(d) {
    const lines = [
        `Hello ${business.name}, I would like to make a booking enquiry.`,
        "",
        `Name: ${d.name.trim()}`,
        `Mobile: ${d.mobile.trim()}`,
        `Pickup: ${d.pickup.trim()}`,
        `Destination: ${d.destination.trim()}`,
        `Journey date: ${d.date}`,
        `Trip type: ${d.tripType}`,
    ];
    if (d.tripType === "Round Trip" && d.returnDate)
        lines.push(`Return date: ${d.returnDate}`);
    lines.push(`Vehicle preference: ${d.vehicle || "No preference"}`);
    lines.push(`Passengers: ${d.passengers}`);
    if (d.details.trim())
        lines.push(`Additional details: ${d.details.trim()}`);
    return lines.join("\n");
}
export function buildWeb3FormsPayload(d, accessKey) {
    return {
        access_key: accessKey,
        subject: `${business.name} booking enquiry from ${d.name.trim()}`,
        from_name: business.name,
        name: d.name.trim(),
        mobile: d.mobile.trim(),
        pickup: d.pickup.trim(),
        destination: d.destination.trim(),
        journey_date: d.date,
        trip_type: d.tripType,
        return_date: d.tripType === "Round Trip" ? d.returnDate : "",
        vehicle_preference: d.vehicle || "No preference",
        passengers: d.passengers,
        additional_details: d.details.trim() || "None",
        message: buildEnquiryMessage(d),
    };
}
