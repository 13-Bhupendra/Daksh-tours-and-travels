// Central business configuration — edit contact details here only.
export const business = {
    name: "Daksh Tours and Travels",
    shortName: "Daksh",
    contactPerson: "Vaishnav Hemant Borse",
    phoneDisplay: "+91 90219 15277",
    phoneE164: "+919021915277",
    whatsappNumber: "919021915277",
    address: "Dhruv Nagar, Gangapur Road, Nashik, Maharashtra 422222",
    mapsUrl: "https://maps.app.goo.gl/rZLuAmsJ5UBmtVXV6",
    // Not supplied yet — replace with the real Instagram profile URL. Leave empty to hide the link.
    instagramUrl: "",
    tagline: "Cab, car and bus rentals from Nashik",
};
export const telLink = `tel:${business.phoneE164}`;
export function whatsappLink(message) {
    return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
export const defaultWhatsappMessage = `Hello ${business.name}, I would like to enquire about a booking.`;
export const navLinks = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/destinations", label: "Destinations" },
    { to: "/fleet", label: "Our Fleet" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
];
