import { media } from "./media";
// Vehicle list — only add details that have been verified with the business.
// NOTE: "Aura" assumed to be the Hyundai Aura — confirm before publishing.
export const vehicles = [
    { id: "aura", name: "Aura", category: "Sedan", image: media.aura, note: "A compact sedan for smooth city and highway rides." },
    { id: "ertiga", name: "Ertiga", category: "MPV", image: media.ertiga, note: "A family-friendly MPV for group trips." },
    { id: "innova", name: "Innova", category: "MPV", image: media.innova, note: "A spacious MPV for long-distance comfort." },
    { id: "eeco", name: "Eeco", category: "Van", image: media.eeco, note: "A practical van for everyday travel needs." },
    { id: "swift", name: "Swift", category: "Hatchback", image: media.swift, note: "A nimble hatchback for short and local trips." },
    { id: "bus", name: "Bus", category: "Group travel", image: media.bus, note: "For weddings, tours and large groups." },
];
