/**
 * Scroll-triggered reveals.
 *
 * IntersectionObserver plus a class flip. The easing lives in the CSS, so
 * this stays about thirty lines and pulls in no animation library.
 *
 * Two bail-outs land everything in its final state rather than leaving
 * content hidden: no IntersectionObserver, or a reduced-motion request,
 * where an entrance animation is precisely what the user asked not to see.
 */
export function initReveal(): void {
  const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
  if (elements.length === 0) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!("IntersectionObserver" in window) || reducedMotion) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        // One-shot. Replaying on scroll-back is distracting.
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0,
      // Positive bottom margin expands the trigger box downward, so an
      // element begins revealing while still below the fold and is settled
      // by the time it is actually looked at.
      rootMargin: "0px 0px 140px 0px",
    },
  );

  elements.forEach((el) => observer.observe(el));
}
