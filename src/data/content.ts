/**
 * All page copy for the Ridgeview Remodeling demo.
 *
 * Every word a visitor reads lives in this file. The components under
 * src/components are renderers over it, so white-labeling this site for a
 * real contractor is editing one file rather than hunting through markup.
 *
 * Two honesty rules this file is built around, because the brand is
 * fictional and the site is a portfolio sample:
 *
 *   1. Nothing here claims verified client work. The reviews carry a
 *      disclaimer, the gallery says the projects are demonstrations, and the
 *      footer names the site as a demo built by Igor Lima.
 *   2. The cost and timeline ranges in the FAQ are typical East County
 *      figures, presented as ranges with the written quote named as the
 *      source of the real number. A real contractor adopting this site must
 *      replace them with their own numbers. See the README.
 */

export const business = {
  name: "Ridgeview Remodeling",
  shortName: "Ridgeview",
  owner: "Marcus",
  tagline: "Kitchens, bathrooms, ADUs, and whole-home remodels in East County San Diego.",
  phone: "(619) 555-0180",
  // tel: links need the digits only, no formatting characters.
  phoneHref: "tel:+16195550180",
  email: "hello@ridgeviewremodeling.example",
  region: "East County San Diego",
  cities: ["El Cajon", "La Mesa", "Santee", "Alpine", "Rancho San Diego"],
  portfolioUrl: "https://igorcsis.github.io/niftyai-portfolio/",
  builtBy: "Igor Lima",
} as const;

export const demoNotice = {
  short: "Demo site",
  body: "Ridgeview Remodeling is a fictional company. This site was built by Igor Lima to show how a contractor's website should work.",
  linkLabel: "See who built it",
  linkHref: "https://igorcsis.github.io/niftyai-portfolio/",
} as const;

export const meta = {
  title: "Kitchen & Bath Remodel in El Cajon | Ridgeview Remodeling",
  description:
    "Kitchen, bathroom, ADU, and whole-home remodels in El Cajon, La Mesa, Santee, Alpine, and Rancho San Diego. Fixed-price quotes and weekly updates.",
} as const;

export const nav = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Projects", href: "#projects" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
] as const;

export const hero = {
  eyebrow: "East County San Diego",
  headline: "Remodels that finish on schedule and on budget",
  sub: "Ridgeview Remodeling handles kitchens, bathrooms, ADUs, and whole-home projects across East County San Diego. You get a written scope, a fixed price, and a start date we keep. One crew, one point of contact, until it is done.",
  primaryCta: { label: "Get my free quote", href: "#quote" },
  secondaryCta: { label: "See our projects", href: "#projects" },
} as const;

export const trustStrip = [
  "Based in East County",
  "Licensed & insured (demo)",
  "Our own crews",
  "Fixed-price quotes",
] as const;

export const services = {
  eyebrow: "What we build",
  title: "Four things, done properly",
  intro:
    "We do not subcontract the whole job out and hope it goes well. The crew that starts your project is the crew that finishes it.",
  items: [
    {
      icon: "kitchen",
      name: "Kitchen remodels",
      body: "We take kitchens down to the studs and put them back better. Cabinets, counters, plumbing, electrical, and finish work handled by one crew on one schedule.",
      bullets: [
        "Cabinet and countertop installation",
        "Wall removal and new lighting",
        "Plumbing, gas, and electrical updates",
      ],
    },
    {
      icon: "bathroom",
      name: "Bathroom remodels",
      body: "Full bathroom rebuilds, from tile and waterproofing to vanities and glass. Most of our bathrooms are done in three to five weeks, not three to five months.",
      bullets: [
        "Shower pans and waterproofing",
        "Tile, vanities, and glass",
        "Layout changes and new venting",
      ],
    },
    {
      icon: "adu",
      name: "ADUs and garage conversions",
      body: "Detached and attached ADUs, plus garage conversions. We handle the plans, the city submittals, and the build, so you are not chasing permits on your own.",
      bullets: [
        "Plans and city submittals",
        "Detached builds and garage conversions",
        "Utility runs, kitchenette, and full bath",
      ],
    },
    {
      icon: "wholehome",
      name: "Whole-home remodels",
      body: "Bigger projects with a real plan. We phase the work so your house stays livable where possible, and we tell you upfront when it will not be.",
      bullets: [
        "Floor plan and structural changes",
        "Rewiring, repiping, and HVAC",
        "Floors, kitchen, and baths in one pass",
      ],
    },
  ],
} as const;

export const costs = {
  eyebrow: "Money",
  title: "What projects like yours cost",
  intro:
    "Most contractor sites will not put a number anywhere. Here are honest ranges for East County so you can tell early whether this is worth a conversation.",
  // These are typical East County ranges for the demo brand. A real
  // contractor adopting this site must replace them with their own numbers.
  bands: [
    { name: "Bathroom remodel", range: "$25,000 to $60,000", note: "Full rebuild, taken to the studs." },
    { name: "Kitchen remodel", range: "$45,000 to $110,000", note: "Cabinets, counters, and new electrical." },
    { name: "Garage conversion ADU", range: "From $150,000", note: "Kitchenette, full bath, separate entry." },
    { name: "Detached ADU", range: "From $250,000", note: "New pad, utilities, and full build." },
  ],
  moversTitle: "What moves the number",
  movers: [
    "Moving plumbing or gas lines rather than reusing what is there",
    "Taking out a wall that turns out to be load bearing",
    "Cabinet and tile tier, which can swing a kitchen by $20,000 on its own",
    "Permits and any structural engineering the city asks for",
    "What we find once the walls are open, which we price in writing before touching it",
  ],
  footnote:
    "Ranges, not quotes. Your written quote gives the real number line by line, before you sign anything.",
} as const;

export const serviceArea = {
  eyebrow: "Where we work",
  title: "We work across East County San Diego",
  body: "That means El Cajon, La Mesa, Santee, Alpine, and Rancho San Diego. Our crews live here, so we know the local inspectors, the permit desks, and the older housing stock.",
} as const;

export const process = {
  eyebrow: "How it goes",
  title: "Three steps, and you know where you stand at each one",
  intro:
    "The part most people dread is not the construction. It is being left in the dark. Here is exactly what happens and when.",
  steps: [
    {
      icon: "visit",
      step: "01",
      name: "Call and walkthrough",
      body: "Call us and we set a walkthrough at your house. We measure, look at what is behind the walls, and listen.",
      deliverable: "A same-week visit and a straight answer on the rough cost range.",
    },
    {
      icon: "quote",
      step: "02",
      name: "Written quote",
      body: "You get a line-item quote with the scope, the materials, the price, and the start date. No vague allowances buried in the total.",
      deliverable: "The full quote in writing within five business days.",
    },
    {
      icon: "build",
      step: "03",
      name: "Build",
      body: "One crew, one lead, one schedule posted in your house. You get a written update every Friday, including anything that slipped and why.",
      deliverable: "A weekly written update and a phone number a person actually answers.",
    },
  ],
} as const;

export const projects = {
  eyebrow: "Selected work",
  title: "Recent work across East County",
  // States plainly that these are demonstrations. The brand is fictional and
  // the tiles are drawn illustrations, not photographs of real jobs.
  intro:
    "A sample of the kinds of projects we take on across East County. These are demonstration projects built for this portfolio site, not verified client work.",
  items: [
    {
      art: "kitchen",
      name: "Open-wall kitchen",
      city: "El Cajon",
      detail: "Removed a load-bearing wall, added an island, and updated all kitchen electrical. Nine weeks.",
    },
    {
      art: "bathroom",
      name: "Hall bath rebuild",
      city: "La Mesa",
      detail: "Taken to the studs, new waterproofing, curbless shower, and new venting. Four weeks.",
    },
    {
      art: "adu",
      name: "Garage to ADU",
      city: "Santee",
      detail: "480 square foot conversion with kitchenette, full bath, and a separate entry off the driveway.",
    },
    {
      art: "living",
      name: "Detached ADU",
      city: "Alpine",
      detail: "Two bedrooms, 750 square feet, on a sloped lot with a new pad and a 90 foot utility run.",
    },
    {
      art: "elevation",
      name: "Whole-home refresh",
      city: "Rancho San Diego",
      detail: "1970s ranch. New floors, kitchen, two baths, and full rewiring, phased over five months.",
    },
    {
      art: "detail",
      name: "Primary bath and closet",
      city: "El Cajon",
      detail: "Took six feet from an unused closet for a double vanity and a walk-in shower. Five weeks.",
    },
  ],
} as const;

export const reviews = {
  eyebrow: "Homeowners",
  title: "What homeowners say",
  // The disclaimer is deliberately placed above the reviews, not hidden in
  // small print beneath them. A fictional brand cannot borrow real social
  // proof, so the honest move is to say so before anyone reads them.
  disclaimer:
    "Sample reviews. Ridgeview Remodeling is a demo brand, and the reviews below are written examples for this portfolio site, not real customer feedback.",
  items: [
    {
      name: "Homeowner",
      city: "La Mesa",
      project: "Bathroom remodel",
      body: "They gave us a fixed price and a finish date, and they hit both. The crew was the same three guys every day. When they found old galvanized pipe behind the shower, they showed me, priced it, and waited for my okay.",
    },
    {
      name: "Homeowner",
      city: "Santee",
      project: "Kitchen remodel",
      body: "Our kitchen took eight weeks, which is exactly what the quote said. We had a temporary sink in the laundry room the whole time. I got a written update every Friday, so I never had to chase anyone for an answer.",
    },
    {
      name: "Homeowner",
      city: "El Cajon",
      project: "Detached ADU",
      body: "We built a detached ADU for my mother. Permitting took longer than anyone wanted, but they told us that upfront and kept us posted every step. The build itself ran on schedule. She moved in two weeks after final inspection.",
    },
    {
      name: "Homeowner",
      city: "Alpine",
      project: "Whole-home remodel",
      body: "We had been burned by a contractor who vanished with our deposit. Ridgeview showed us the payment schedule tied to milestones before we signed. We never paid ahead of the work. That alone made the whole thing easier to sleep through.",
    },
  ],
} as const;

export const quoteForm = {
  eyebrow: "Get started",
  title: "Tell us about your project",
  intro:
    "About two minutes. Marcus reads every request himself, so you will not get an autoresponder. There is no obligation and we will not put you on a call list.",
  /**
   * Field order is deliberate and is the highest-leverage decision on this
   * form. It opens with taps about the homeowner's own project, which they
   * are glad to answer, and puts the contact details last with the phone
   * number dead last. By the time they reach the field they like least, they
   * have already invested four answers.
   *
   * Every field here is a plain text input, select, or textarea. There is no
   * file upload: photo uploads are a paid feature on every free form backend
   * worth using, and this demo is built to run at zero cost.
   */
  fields: {
    projectType: {
      label: "What are you remodeling?",
      help: "Not sure yet? Pick the closest one and we will sort it out on the call.",
      options: [
        "Kitchen remodel",
        "Bathroom remodel",
        "ADU or garage conversion",
        "Whole-home remodel",
        "Not sure yet",
      ],
    },
    timeline: {
      label: "When would you like work to start?",
      help: 'An honest guess is fine. "Still planning" is a real answer.',
      options: [
        "As soon as possible",
        "1 to 3 months",
        "3 to 6 months",
        "6 months or later",
        "Still planning",
      ],
    },
    budget: {
      label: "What budget are you planning around?",
      help: "A range is fine. This tells us what is realistic before anyone spends an afternoon on it.",
      // The last option is what keeps this field from costing completions.
      // Without an honest escape hatch, people who genuinely do not know
      // either guess wrong or abandon the form.
      options: [
        "Under $30,000",
        "$30,000 to $60,000",
        "$60,000 to $100,000",
        "$100,000 to $150,000",
        "$150,000 or more",
        "Not sure yet, I want guidance",
      ],
    },
    city: {
      label: "City or ZIP",
      help: "So we can tell you right away if you are inside our service area.",
    },
    details: {
      label: "Tell us about the project",
      help: "Rooms, rough size, and anything that worries you. A few sentences is plenty.",
    },
    name: { label: "Your name", help: "First and last is fine." },
    email: { label: "Email", help: "We send your written quote here." },
    phone: {
      label: "Best number to reach you",
      help: "One call to set up the walkthrough. No autodialers, and we do not text unless you ask us to.",
      textOptIn: "Text me instead of calling",
    },
    source: { label: "How did you hear about us?", help: "Optional. It helps us know what is working." },
  },
  nextTitle: "What happens after you send this",
  nextSteps: [
    "You get a reply within one business day, usually the same afternoon.",
    "A short phone call about scope and budget. No sales visit yet.",
    "If it looks like a fit, we walk the space and send a fixed-price quote.",
  ],
  nextFootnote:
    "If your project is not a good fit for us, we will tell you that and point you to someone better suited. You will not be chased.",
  submitLabel: "Get my free quote",
  sendingLabel: "Sending",
  // Naming the lead broker is what neutralizes the fear. Anyone who has
  // filled in a lead-generation form knows what happens next, and a generic
  // privacy line does not address it.
  privacy:
    "We use this to prepare your estimate and nothing else. No spam, no newsletters, and we never sell or share your information with lead brokers.",
} as const;

export const faq = {
  eyebrow: "Questions",
  title: "The things people ask before they call",
  items: [
    {
      q: "What does a remodel actually cost?",
      a: "It depends on size and finish level, so here are honest ranges for East County. Bathrooms usually run $25,000 to $60,000. Kitchens run $45,000 to $110,000. ADUs start around $250,000. Your quote gives the real number, line by line, before you sign anything.",
    },
    {
      q: "How long will it take?",
      a: "Bathrooms run three to five weeks. Kitchens run six to ten weeks. ADUs run five to eight months including permitting, which is the slowest part and the part we cannot fully control. Whole-home projects vary. Your quote names a start date and a finish date.",
    },
    {
      q: "Do I need permits, and who pulls them?",
      a: "Yes, most of this work needs a permit, and we pull it. We prepare the drawings, submit to the city or county, and meet the inspectors. Permit timelines are set by the jurisdiction, not by us, so we build that wait into the schedule instead of hiding it.",
    },
    {
      q: "Can we live in the house while you work?",
      a: "Usually yes. For a single bathroom or kitchen, we seal off the work area, run dust containment, and keep one path clean. For a kitchen we set up a temporary sink and counter. For whole-home work, we will tell you honestly if you should move out.",
    },
    {
      q: "How does the payment schedule work?",
      a: "Payments follow the work, not the calendar. A deposit to start, then progress payments tied to completed milestones like demo, rough-in, inspection, and finish. You never pay for work that has not happened. The final payment comes after your punch list is closed out.",
    },
    {
      q: "What happens if it goes over budget or over schedule?",
      a: "Two things cause overruns. You change your mind, or we open a wall and find something bad. Changes go through a written change order you approve before we touch it. Hidden conditions get priced the same way. Nothing gets added to your bill without your signature.",
    },
  ],
} as const;

export const thanks = {
  title: "Got it. We will call you.",
  body: "We got your request. A person from our office will call you within one business day to ask a few questions and set a walkthrough. If we cannot reach you by phone, we will follow up by email the same day.",
  urgentLabel: "If it is urgent",
  urgentBody:
    "If you have water damage, no working bathroom, or a job someone else walked off of, call the office directly and say it is urgent. We move those to the front.",
  // Naming the unknown-number problem recovers more booked walkthroughs than
  // anything else on this page. The largest leak in a contractor funnel is
  // the form filler who does not pick up the callback.
  saveLabel: "Save our number",
  saveBody: "Add us to your contacts now so you recognize the call when it comes in.",
  // The homeowner is collecting other quotes. Pretending otherwise is the
  // mistake. Handing over the comparison framework keeps them on this page
  // while they wait and frames the comparison on terms a careful builder wins.
  checklistTitle: "What to ask every contractor you talk to",
  checklistIntro:
    "You are probably getting other quotes. You should. Here is how to compare them fairly.",
  checklist: [
    "Is the quote line by line, or one number with allowances buried in it?",
    "What deposit are you asking for, and what does California allow?",
    "Who is my single point of contact once work starts?",
    "How do change orders work, and do I approve the cost before the work happens?",
    "Is the crew yours, or subcontracted out job by job?",
    "What warranty do I get in writing, and for how long?",
    "Who pulls the permits, and what happens if the city is slow?",
    "How often will I get an update, and in what form?",
    "What happens to my schedule if you find something behind a wall?",
    "Can I talk to someone whose job you finished recently?",
  ],
  prepTitle: "What to have ready for the call",
  prep: [
    "Rough measurements of the room, even paced out",
    "A few phone photos of the space as it is now",
    "Any saved pictures of what you are going for",
    "HOA rules, if your neighborhood has them",
  ],
} as const;

export const footer = {
  blurb:
    "Ridgeview Remodeling. Kitchens, bathrooms, ADUs, and whole-home remodels in East County San Diego. Serving El Cajon, La Mesa, Santee, Alpine, and Rancho San Diego.",
  demoNotice:
    "Ridgeview Remodeling is a fictional brand. This site is a portfolio sample built by Igor Lima to demonstrate design and copywriting work.",
} as const;
