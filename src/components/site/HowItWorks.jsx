import { useEffect, useRef } from "react";
import { Reveal, SectionHeading } from "./primitives";

const steps = [
  "Share your trip details through the form, a call or WhatsApp.",
  "We reply to confirm the vehicle and timing.",
  "Your driver arrives and the journey begins.",
];

export function HowItWorks() {
  const ref = useRef(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const track = section.querySelector(".route-track");
    const car = section.querySelector(".route-car");
    const markers = section.querySelectorAll(".route-marker");
    if (!track || !car || markers.length < 3) return;
    let frame = 0;
    let active = false;
    let startAt = null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = (now) => {
      frame = 0;
      if (!active) return;
      if (startAt === null) startAt = now;
      const firstRect = markers[0].getBoundingClientRect();
      const lastRect = markers[markers.length - 1].getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();
      const point = (rect) => ({
        x: rect.left - trackRect.left + rect.width / 2,
        y: rect.top - trackRect.top + rect.height / 2,
      });
      const first = point(firstRect);
      const last = point(lastRect);
      const phase = reducedMotion ? 0 : ((now - startAt) % 8000) / 8000;
      const outbound = phase <= 0.5;
      const rawProgress = outbound ? phase * 2 : (1 - phase) * 2;
      const progress = rawProgress * rawProgress * (3 - 2 * rawProgress);
      const carX = first.x + (last.x - first.x) * progress;
      const carY = first.y + (last.y - first.y) * progress;
      const horizontal = Math.abs(last.x - first.x) >= Math.abs(last.y - first.y);
      car.style.setProperty("--route-car-x", `${carX}px`);
      car.style.setProperty("--route-car-y", `${carY}px`);
      const fillProgress = horizontal ? carX / trackRect.width : carY / trackRect.height;
      track.style.setProperty("--route-progress", `${Math.max(0, Math.min(1, fillProgress)) * 100}%`);
      if (!reducedMotion) frame = requestAnimationFrame(animate);
    };
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active && !frame) frame = requestAnimationFrame(animate);
      else if (!active) { cancelAnimationFrame(frame); frame = 0; }
    }, { rootMargin: "120px 0px" });
    observer.observe(section);
    return () => {
      active = false;
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={ref} className="how-section mx-auto max-w-7xl px-5 py-24 md:px-8">
      <SectionHeading eyebrow="How booking works" title="A few details. Then, you're on your way." />
      <div className="route-track relative mt-16">
        <div className="route-rail" aria-hidden="true" />
        <div className="route-fill" aria-hidden="true" />
        <div className="route-car" aria-hidden="true">🚘</div>
        <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((text, index) => (
            <Reveal key={text} as="li" delay={index * 120} className="route-step">
              <span className="route-marker"><span /></span>
              <span className="font-display text-4xl text-gold">0{index + 1}</span>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">{text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
