/**
 * Nav behavior: the mobile menu, the header's scrolled state, and the sticky
 * mobile CTA bar. All three share one passive scroll listener whose work is
 * coalesced into a single animation frame.
 */

/** Mobile disclosure panel, plus the two bars that cross into an X. */
function initMobileMenu(): void {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;

  const bars = toggle.querySelectorAll<HTMLElement>("[data-bar]");
  let isOpen = false;

  const setOpen = (open: boolean): void => {
    isOpen = open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    // max-height animates; height:auto does not.
    menu.style.maxHeight = open ? "26rem" : "0px";
    bars.forEach((bar) => {
      const isTop = bar.dataset.bar === "top";
      bar.style.transform = open
        ? `translateY(${isTop ? "6px" : "-6px"}) rotate(${isTop ? 45 : -45}deg)`
        : "";
    });
  };

  toggle.addEventListener("click", () => setOpen(!isOpen));

  // Close on link click, or the panel covers the section being scrolled to.
  menu.querySelectorAll<HTMLAnchorElement>("[data-mobile-link]").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Crossing to desktop with the panel open would leave a stale inline
  // max-height behind.
  window.matchMedia("(min-width: 1024px)").addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });
}

/** Header density and the sticky mobile CTA, on one coalesced listener. */
function initScrollState(): void {
  const header = document.querySelector<HTMLElement>(".site-header");
  const mobileCta = document.getElementById("mobile-cta");
  const quote = document.getElementById("quote");

  let isScrolled = false;
  let ctaVisible = false;
  let ticking = false;

  const update = (): void => {
    ticking = false;
    const y = window.scrollY;

    if (header) {
      const shouldBeScrolled = y > 16;
      if (shouldBeScrolled !== isScrolled) {
        isScrolled = shouldBeScrolled;
        header.classList.toggle("is-scrolled", shouldBeScrolled);
      }
    }

    // Show once the first screen is behind us, hide again over the form
    // where the bar would point at something already visible.
    if (mobileCta) {
      const pastHero = y > window.innerHeight * 0.75;
      const atQuote = quote ? y + window.innerHeight > quote.offsetTop + 240 : false;
      const shouldShow = pastHero && !atQuote;
      if (shouldShow !== ctaVisible) {
        ctaVisible = shouldShow;
        mobileCta.classList.toggle("is-visible", shouldShow);
      }
    }
  };

  const onScroll = (): void => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
}

export function initNav(): void {
  initMobileMenu();
  initScrollState();
}
