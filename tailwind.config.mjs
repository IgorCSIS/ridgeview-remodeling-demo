/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      /**
       * Three families of color and nothing else: a deep navy ink, a warm
       * sand neutral, and one amber accent. Every pairing used on the site
       * was checked against the WCAG relative-luminance formula and clears
       * 4.5:1 for body text or 3:1 for large text and control boundaries.
       *
       * Two pairings are deliberately never used, because they fail:
       *   ember-500 on sand-100 is 2.98:1  -> on light, accent is ember-600/700
       *   ember-600 on ink-800  is 3.22:1  -> on navy, accent is accentDark/ember-500
       */
      colors: {
        ink: {
          900: "#05111D", // deepest: footer, hero band base
          800: "#0B1F33", // body text on light, primary dark surface
          700: "#163049", // raised surface inside dark bands
          600: "#2C4A66", // hairline on navy, lead paragraph on light
          500: "#456384", // muted text on light (5.83:1 on sand-100)
        },
        sand: {
          50: "#FFFDFA", // form fields, elevated cards
          100: "#FAF7F2", // page background
          200: "#F2ECE2", // recessed panels
          300: "#E4DBCC", // decorative hairlines only, never a control boundary
          400: "#C9BCA6", // muted text ON navy (8.92:1 on ink-800)
        },
        ember: {
          500: "#D97706", // dark backgrounds only
          600: "#C2410C", // primary CTA fill, accent on light (4.85:1)
          700: "#9A3208", // CTA hover, accent links (6.93:1)
        },
        // Accent text on navy. ember-600 is only 3.22:1 there, so dark
        // sections use this lighter amber instead (7.12:1).
        accentDark: "#E39A3C",
        line: {
          DEFAULT: "#E4DBCC", // decorative only (1.28:1)
          strong: "#94836C", // control boundaries (3.43:1) per WCAG 1.4.11
        },
        success: { DEFAULT: "#145A3F", line: "#2E7D5B", bg: "#EDF3EF" },
        danger: { DEFAULT: "#A0152F", line: "#C0284A", bg: "#FBEEF0" },
      },

      fontFamily: {
        // Fraunces with its WONK and SOFT axes pinned to 0 reads as a civic
        // cornerstone serif rather than a boutique one. Libre Franklin is an
        // American newspaper gothic. Neither is the Inter/Space Grotesk pair
        // that makes every site look like a SaaS landing page.
        display: ["Fraunces", "Iowan Old Style", "Georgia", "serif"],
        sans: ["Libre Franklin", "-apple-system", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
      },

      // Fluid from a 380px viewport to 1440px, then locked.
      fontSize: {
        display: ["clamp(2.5rem,1.693rem + 3.396vw,4.75rem)", { lineHeight: "1.04", letterSpacing: "-0.021em" }],
        h2: ["clamp(1.875rem,1.516rem + 1.509vw,2.875rem)", { lineHeight: "1.12", letterSpacing: "-0.017em" }],
        h3: ["clamp(1.375rem,1.241rem + 0.566vw,1.75rem)", { lineHeight: "1.26", letterSpacing: "-0.010em" }],
        lead: ["clamp(1.125rem,1.035rem + 0.377vw,1.375rem)", { lineHeight: "1.55", letterSpacing: "-0.005em" }],
        body: ["clamp(1rem,0.955rem + 0.189vw,1.125rem)", { lineHeight: "1.65", letterSpacing: "0em" }],
        small: ["clamp(0.875rem,0.853rem + 0.094vw,0.9375rem)", { lineHeight: "1.55", letterSpacing: "0.002em" }],
        label: ["clamp(0.75rem,0.728rem + 0.094vw,0.8125rem)", { lineHeight: "1.1", letterSpacing: "0.13em" }],
      },

      borderRadius: { card: "0.75rem", panel: "1.25rem", field: "0.5rem" },

      // Shadows are tinted with the ink navy rather than neutral black.
      // Black shadow over warm sand goes muddy grey; navy reads as shade.
      boxShadow: {
        xs: "0 1px 2px rgba(11,31,51,.055)",
        sm: "0 1px 2px rgba(11,31,51,.05),0 2px 6px -1px rgba(11,31,51,.05)",
        md: "0 2px 4px -1px rgba(11,31,51,.045),0 8px 18px -6px rgba(11,31,51,.10)",
        lg: "0 4px 8px -2px rgba(11,31,51,.05),0 18px 36px -12px rgba(11,31,51,.14)",
        hairline: "inset 0 0 0 1px rgba(11,31,51,.07)",
        onDark: "inset 0 1px 0 rgba(250,247,242,.10),0 12px 28px -14px rgba(0,0,0,.55)",
      },

      // No spring, no bounce, no overshoot. A builder's site that boings has
      // lost the argument before the copy is read.
      transitionTimingFunction: {
        settle: "cubic-bezier(0.22,1,0.36,1)", // things arriving
        hover: "cubic-bezier(0.4,0,0.2,1)", // state under the cursor
        draw: "cubic-bezier(0.65,0,0.35,1)", // anything whose length changes
      },
      transitionDuration: { 140: "140ms", 320: "320ms", 420: "420ms", 560: "560ms", 640: "640ms" },

      spacing: { section: "4.5rem", "section-lg": "7rem" },
      maxWidth: { content: "72rem" },
    },
  },
  plugins: [],
};
