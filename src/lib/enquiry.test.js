import { describe, expect, it } from "vitest";
import { buildEnquiryMessage, buildWeb3FormsPayload, isValidIndianMobile, maxJourneyDateISO, validateEnquiry } from "./enquiry";
import { business, whatsappLink } from "@/data/business";
const base = {
    name: "Ravi", mobile: "9876543210", pickup: "Nashik", destination: "Shirdi",
    date: "2026-12-01", tripType: "One Way", vehicle: "Innova", passengers: "3", returnDate: "", details: "",
};
describe("enquiry rules", () => {
    it("accepts Indian mobiles and rejects invalid ones", () => {
        expect(isValidIndianMobile("+91 98765 43210")).toBe(true);
        expect(isValidIndianMobile("5876543210")).toBe(false);
        expect(isValidIndianMobile("98765")).toBe(false);
    });
    it("rejects past journey dates", () => {
        expect(validateEnquiry({ ...base, date: "2026-01-01" }, "2026-10-16").date).toBeTruthy();
    });
    it("limits journey and return dates to the next three months", () => {
        const maxDate = maxJourneyDateISO("2026-10-16");
        expect(maxDate).toBe("2027-01-16");
        expect(validateEnquiry({ ...base, date: maxDate }, "2026-10-16").date).toBeUndefined();
        expect(validateEnquiry({ ...base, date: "2027-01-17" }, "2026-10-16").date).toContain("3 months");
        expect(validateEnquiry({
            ...base,
            date: "2026-12-01",
            tripType: "Round Trip",
            returnDate: "2027-01-17",
        }, "2026-10-16").returnDate).toContain("3 months");
        expect(maxJourneyDateISO("2026-11-30")).toBe("2027-02-28");
    });
    it("requires return date only for round trips", () => {
        expect(validateEnquiry(base, "2026-10-16").returnDate).toBeUndefined();
        expect(validateEnquiry({ ...base, tripType: "Round Trip" }, "2026-10-16").returnDate).toBeTruthy();
    });
    it("requires a supported trip type and whole-number passenger count", () => {
        expect(validateEnquiry({ ...base, tripType: "Invalid" }, "2026-10-16").tripType).toBeTruthy();
        expect(validateEnquiry({ ...base, passengers: "1.5" }, "2026-10-16").passengers).toBeTruthy();
        expect(validateEnquiry({ ...base, passengers: "0" }, "2026-10-16").passengers).toBeTruthy();
        expect(validateEnquiry({ ...base, passengers: "51" }, "2026-10-16").passengers).toBeTruthy();
        expect(validateEnquiry({ ...base, passengers: "50" }, "2026-10-16").passengers).toBeUndefined();
    });
    it("validates names and requires a vehicle choice", () => {
        expect(validateEnquiry({ ...base, name: "Ravi 2" }, "2026-10-16").name).toBeTruthy();
        expect(validateEnquiry({ ...base, name: "O'Neil" }, "2026-10-16").name).toBeUndefined();
        expect(validateEnquiry({ ...base, vehicle: "" }, "2026-10-16").vehicle).toBeTruthy();
    });
    it("sends WhatsApp to the business number with encoded details", () => {
        const url = whatsappLink(buildEnquiryMessage(base));
        expect(url.startsWith("https://wa.me/919021915277?text=")).toBe(true);
        expect(decodeURIComponent(url.split("text=")[1] ?? "")).toContain("Destination: Shirdi");
    });
    it("includes all booking details in the Web3Forms email payload", () => {
        const payload = buildWeb3FormsPayload(
            { ...base, tripType: "Round Trip", returnDate: "2026-12-04", details: "Two suitcases" },
            "test-access-key",
        );
        expect(payload).toMatchObject({
            access_key: "test-access-key",
            subject: `${business.name} booking enquiry from Ravi`,
            from_name: business.name,
            name: "Ravi",
            mobile: "9876543210",
            pickup: "Nashik",
            destination: "Shirdi",
            journey_date: "2026-12-01",
            trip_type: "Round Trip",
            return_date: "2026-12-04",
            vehicle_preference: "Innova",
            passengers: "3",
            additional_details: "Two suitcases",
        });
        expect(payload.message).toContain("Additional details: Two suitcases");
    });
});
