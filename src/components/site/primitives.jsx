import { useEffect, useRef, useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
export function Logo({ light = true, className }) {
    return (<span className={cn("flex items-center gap-3", className)}>
      <span className="grid h-10 w-10 place-items-center rounded-full border border-gold font-display text-lg italic text-gold">D</span>
      <span className="leading-none">
        <span className={cn("block font-display text-xl tracking-tight", light ? "text-on-dark" : "text-navy")}>Daksh</span>
        <span className="mt-1 block text-[0.6rem] font-bold uppercase tracking-[0.35em] text-gold">Tours & Travels</span>
      </span>
    </span>);
}
export function Reveal({ children, className, delay = 0, as: Tag = "div" }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el)
            return;
        const io = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry?.isIntersecting) {
                setVisible(true);
                io.disconnect();
            }
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return (<Tag ref={ref} className={cn("reveal", visible && "is-visible", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>);
}
export function SmartImage({ src, alt, className, imgClassName, eager = false, width, height }) {
    const [state, setState] = useState("loading");
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current?.complete && ref.current.naturalWidth > 0)
            setState("loaded");
    }, []);
    return (<div className={cn("relative overflow-hidden", state === "loading" && "skeleton", className)}>
      {state === "error" ? (<div className="absolute inset-0 grid place-items-center bg-navy text-on-dark-muted">
          <div className="flex flex-col items-center gap-2 text-sm"><ImageOff className="h-6 w-6" aria-hidden/>Image unavailable</div>
        </div>) : (<img ref={ref} src={src} alt={alt} width={width} height={height} loading={eager ? "eager" : "lazy"} decoding="async" onLoad={() => setState("loaded")} onError={() => setState("error")} className={cn("h-full w-full object-cover transition-all duration-1000", state === "loaded" ? "opacity-100" : "opacity-0", imgClassName)}/>)}
    </div>);
}
export function SectionHeading({ eyebrow, title, intro, center, light }) {
    return (<Reveal className={cn("max-w-2xl", center && "mx-auto text-center")}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className={cn("mt-4 text-4xl leading-[1.05] md:text-5xl", light ? "text-on-dark" : "text-navy")}>{title}</h2>
      {intro && <p className={cn("mt-5 text-base leading-relaxed md:text-lg", light ? "text-on-dark-muted" : "text-muted-foreground")}>{intro}</p>}
    </Reveal>);
}
export function PageBanner({ eyebrow, title, intro, image }) {
    return (<section className="relative flex min-h-[62vh] items-end overflow-hidden bg-navy-deep pb-16 pt-40">
      <img src={image} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-105 object-cover"/>
      <div className="overlay-hero absolute inset-0"/>
      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <p className="eyebrow animate-rise">{eyebrow}</p>
        <h1 className="animate-rise mt-4 max-w-3xl text-5xl leading-[1] text-on-dark md:text-7xl" style={{ animationDelay: "120ms" }}>{title}</h1>
        <p className="animate-rise mt-6 max-w-xl text-lg text-on-dark-muted" style={{ animationDelay: "240ms" }}>{intro}</p>
      </div>
    </section>);
}
