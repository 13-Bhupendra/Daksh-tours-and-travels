import { Car, Plane, Route as RouteIcon, KeyRound, Bus } from "lucide-react";
import { media } from "./media";
export const services = [
    {
        id: "cab-rental",
        title: "Cab Rental",
        icon: Car,
        image: media.innova,
        summary: "Comfortable cabs for local travel, temple visits and daily errands around Nashik.",
        detail: "Book a cab for a few hours or a full day. Tell us where you need to go and we will suggest a suitable vehicle for your group.",
    },
    {
        id: "airport",
        title: "Airport Pickup & Drop",
        icon: Plane,
        image: media.airport,
        summary: "Punctual airport transfers so you never worry about catching a flight.",
        detail: "Share your flight timing and pickup point when you enquire, and we will plan your pickup or drop accordingly.",
    },
    {
        id: "outstation",
        title: "Outstation Bookings",
        icon: RouteIcon,
        image: media.hero,
        summary: "One-way and round trips to cities, pilgrim centres and hill getaways.",
        detail: "Plan a family trip, pilgrimage or business visit outside the city. Round-trip and one-way enquiries are both welcome.",
    },
    {
        id: "car-rental",
        title: "Car Rental",
        icon: KeyRound,
        image: media.aura,
        summary: "Choose from sedans, hatchbacks and MPVs for the trip you have in mind.",
        detail: "Pick a vehicle that suits your passengers and luggage. Our team will confirm availability when you contact us.",
    },
    {
        id: "bus-rental",
        title: "Bus Rental",
        icon: Bus,
        image: media.bus,
        summary: "Group travel for weddings, tours, corporate outings and events.",
        detail: "Travelling as a large group? Enquire for bus rental with your date, route and number of passengers.",
    },
];
