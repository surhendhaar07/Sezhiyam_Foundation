// src/lib/mock-data.ts
/**
 * DEMO CONTENT — clearly marked as placeholder.
 * Stage 5 will replace these with real database queries.
 */

export const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=80",
    alt: "Community volunteering",
  },
  {
    image: "https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=1600&q=80",
    alt: "Children learning",
  },
  {
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1600&q=80",
    alt: "Hands together",
  },
];

export const heroContent = {
  welcome: "Welcome to SEZHIYAM FOUNDATION",
  quote:
    "Service to humanity is the best work of life. Together, we build stronger communities.",
  description:
    "A grassroots NGO working across Tamil Nadu in education, health, community welfare, and disaster relief. Every act of kindness ripples into lasting change.",
};

export const aboutPreview = {
  heading: "About SEZHIYAM FOUNDATION",
  paragraph:
    "Founded on the belief that every person deserves dignity and opportunity, SEZHIYAM FOUNDATION works at the grassroots level to empower underserved communities across Tamil Nadu. From education and healthcare to disaster relief and women's empowerment, we act where help is needed most.",
  bulletPoints: [
    "Rooted in Tamil Nadu, serving Tamil Nadu",
    "100% volunteer-driven at the field level",
    "Transparent about every rupee we spend",
  ],
};

export const visionMissionValues = [
  {
    type: "vision" as const,
    title: "Our Vision",
    description:
      "A just and equitable society where every individual has access to education, healthcare, and the opportunity to lead a life of dignity.",
    icon: "eye" as const,
  },
  {
    type: "mission" as const,
    title: "Our Mission",
    description:
      "To empower underprivileged communities through sustainable programs in education, health, livelihood, and disaster response — driven by compassion, transparency, and local participation.",
    icon: "target" as const,
  },
  {
    type: "values" as const,
    title: "Our Core Values",
    description:
      "Compassion. Integrity. Transparency. Community-first. Sustainability. We hold ourselves accountable to the people we serve and the donors who trust us.",
    icon: "heart" as const,
  },
];

export const teamMembers = [
  {
    name: "Dr. Rajesh Kumar",
    designation: "Founder & Chairman",
    bio: "A retired professor with 30 years of experience in rural development and social work across Tamil Nadu.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
  },
  {
    name: "Mrs. Lakshmi Venkatesan",
    designation: "Managing Trustee",
    bio: "Leads our women's empowerment and education initiatives. Former school principal.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  },
  {
    name: "Mr. Karthik Subramanian",
    designation: "Program Director",
    bio: "Oversees all field operations across districts. Background in public health and disaster response.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "Ms. Priya Ramachandran",
    designation: "Finance & Compliance",
    bio: "Ensures every rupee is accounted for. Chartered Accountant with a passion for nonprofit transparency.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
  },
];

export const wings = [
  {
    name: "Education Wing",
    description: "Scholarships, tuition centers, school supplies, and digital literacy for rural children.",
    inCharge: { name: "Mrs. Lakshmi Venkatesan", designation: "In-Charge" },
    icon: "book" as const,
  },
  {
    name: "Health Wing",
    description: "Free medical camps, blood donation drives, and maternal health awareness.",
    inCharge: { name: "Dr. Rajesh Kumar", designation: "In-Charge" },
    icon: "health" as const,
  },
  {
    name: "Women Empowerment Wing",
    description: "Self-help groups, skill training, and financial literacy for women.",
    inCharge: { name: "Ms. Priya Ramachandran", designation: "In-Charge" },
    icon: "users" as const,
  },
  {
    name: "Disaster Relief Wing",
    description: "Rapid response during floods, cyclones, and other emergencies across Tamil Nadu.",
    inCharge: { name: "Mr. Karthik Subramanian", designation: "In-Charge" },
    icon: "shield" as const,
  },
];

export const impactStats = [
  { label: "Established Year", value: 2015, suffix: "", prefix: "", isYear: true },
  { label: "Beneficiaries Reached", value: 5000, suffix: "+", prefix: "" },
  { label: "Funds Mobilized", value: 1000000, suffix: "+", prefix: "₹" },
  { label: "Projects Completed", value: 50, suffix: "+", prefix: "" },
  { label: "Active Volunteers", value: 100, suffix: "+", prefix: "" },
];

export const governanceInfo = {
  heading: "Governance & Transparency",
  description:
    "SEZHIYAM FOUNDATION is committed to the highest standards of governance and financial transparency. Our accounts are audited annually, and every donation is tracked and reported.",
  points: [
    "Registered under the Tamil Nadu Societies Registration Act",
    "Annual audited financial statements available on request",
    "All donations acknowledged with official receipts",
    "Public disclosure of project reports",
  ],
};

export const newsItems = [
  {
    title: "Annual Health Camp in Madurai District",
    description:
      "Over 800 villagers received free health checkups, medicines, and specialist consultations.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
    publishedDate: "2025-08-15",
    eventDate: "2025-08-10",
    location: "Madurai, Tamil Nadu",
    isEvent: false,
  },
  {
    title: "School Supplies Distribution Drive",
    description:
      "Notebooks, uniforms, and stationery delivered to 500 students across 12 government schools.",
    image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&q=80",
    publishedDate: "2025-07-20",
    eventDate: "2025-07-18",
    location: "Salem, Tamil Nadu",
    isEvent: false,
  },
  {
    title: "Upcoming: Diwali Celebration with Orphanages",
    description:
      "Join us for a day of celebration, sweets, and gifts for children across 8 orphanages in Chennai.",
    image: "https://images.unsplash.com/photo-1604423043492-41303788deff?w=600&q=80",
    publishedDate: "2025-10-01",
    eventDate: "2025-10-25",
    location: "Chennai, Tamil Nadu",
    isEvent: true,
  },
];

export const workingLocations = [
  { name: "Chennai",    district: "Chennai",     lat: 13.0827, lng: 80.2707, description: "HQ & primary operations" },
  { name: "Madurai",    district: "Madurai",     lat: 9.9252,  lng: 78.1198, description: "Health camps & education" },
  { name: "Coimbatore", district: "Coimbatore",  lat: 11.0168, lng: 76.9558, description: "Women's empowerment programs" },
  { name: "Salem",      district: "Salem",       lat: 11.6643, lng: 78.1460, description: "School supplies & tuition centers" },
  { name: "Tiruchirappalli", district: "Tiruchirappalli", lat: 10.7905, lng: 78.7047, description: "Disaster relief hub" },
];

export const recentProjects = [
  {
    title: "Free Medical Camp at Madurai Village",
    description: "Comprehensive health checkups, medicines, and specialist consultations for 800+ villagers.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
    date: "2025-08-10",
    location: "Madurai, Tamil Nadu",
    beneficiaries: 800,
    fundsReceived: 250000,
    fundsUsed: 238000,
    category: "Health",
    status: "Completed" as const,
  },
  {
    title: "Rural School Digital Literacy Program",
    description: "Computer training, tablets, and internet access for 12 government schools.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
    date: "2025-06-15",
    location: "Salem, Tamil Nadu",
    beneficiaries: 500,
    fundsReceived: 400000,
    fundsUsed: 385000,
    category: "Education",
    status: "Completed" as const,
  },
  {
    title: "Women's Self-Help Group Training",
    description: "Financial literacy, tailoring, and entrepreneurship training for 150 women.",
    image: "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=600&q=80",
    date: "2025-05-20",
    location: "Coimbatore, Tamil Nadu",
    beneficiaries: 150,
    fundsReceived: 180000,
    fundsUsed: 172000,
    category: "Women Empowerment",
    status: "Completed" as const,
  },
];

export const nalamEvents = [
  {
    title: "Pongal Celebration with 200 Families",
    occasion: "Pongal",
    date: "2025-01-15",
    location: "Madurai District",
    description:
      "Traditional Pongal celebration with 200 underprivileged families — new clothes, sweets, and community feast.",
    image: "https://images.unsplash.com/photo-1604608672516-f1b9b1a0cb2c?w=600&q=80",
    beneficiaries: 200,
    fundsReceived: 150000,
    fundsUsed: 148000,
  },
  {
    title: "Diwali with Orphanage Children",
    occasion: "Diwali",
    date: "2024-11-01",
    location: "Chennai",
    description:
      "Diwali celebration across 8 orphanages — sweets, new clothes, and firecrackers for 400 children.",
    image: "https://images.unsplash.com/photo-1604423043492-41303788deff?w=600&q=80",
    beneficiaries: 400,
    fundsReceived: 200000,
    fundsUsed: 195000,
  },
];

export const socialPosts = [
  { platform: "Facebook",  url: "https://facebook.com/",  label: "Facebook" },
  { platform: "Instagram", url: "https://instagram.com/", label: "Instagram" },
  { platform: "YouTube",   url: "https://youtube.com/",   label: "YouTube" },
  { platform: "Twitter",   url: "https://twitter.com/",   label: "Twitter" },
];

// ---- Extended data for detail pages ----

export const projectsDetail = [
  {
    slug: "free-medical-camp-madurai",
    title: "Free Medical Camp at Madurai Village",
    description:
      "Comprehensive health checkups, medicines, and specialist consultations for 800+ villagers. Our team of 15 volunteer doctors, 4 nurses, and 30 field volunteers spent 3 days providing free medical services to underserved communities.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
      "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=1200&q=80",
      "https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200&q=80",
      "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&q=80",
    ],
    date: "2025-08-10",
    duration: "3 days",
    location: "Madurai, Tamil Nadu",
    beneficiaries: 800,
    fundsReceived: 250000,
    fundsUsed: 238000,
    category: "Health",
    status: "Completed",
    showFinancials: true,
  },
  {
    slug: "rural-school-digital-literacy",
    title: "Rural School Digital Literacy Program",
    description:
      "Computer training, tablets, and internet access for 12 government schools. We installed 60 tablets, set up computer labs, and trained 500 students in basic digital literacy over 6 months.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80",
      "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80",
    ],
    date: "2025-06-15",
    duration: "6 months",
    location: "Salem, Tamil Nadu",
    beneficiaries: 500,
    fundsReceived: 400000,
    fundsUsed: 385000,
    category: "Education",
    status: "Completed",
    showFinancials: true,
  },
  {
    slug: "women-self-help-group-training",
    title: "Women's Self-Help Group Training",
    description:
      "Financial literacy, tailoring, and entrepreneurship training for 150 women. Graduates have started 40+ micro-businesses since completing the program.",
    image: "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=1200&q=80",
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=80",
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=1200&q=80",
    ],
    date: "2025-05-20",
    duration: "4 months",
    location: "Coimbatore, Tamil Nadu",
    beneficiaries: 150,
    fundsReceived: 180000,
    fundsUsed: 172000,
    category: "Women Empowerment",
    status: "Completed",
    showFinancials: true,
  },
  {
    slug: "flood-relief-chennai-2024",
    title: "Chennai Flood Relief 2024",
    description:
      "Emergency relief during the 2024 Chennai floods. Distributed 2,000 food kits, 500 blankets, and medical aid to families in 8 worst-hit neighborhoods.",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&q=80",
      "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1200&q=80",
    ],
    date: "2024-12-05",
    duration: "2 weeks",
    location: "Chennai, Tamil Nadu",
    beneficiaries: 2000,
    fundsReceived: 850000,
    fundsUsed: 845000,
    category: "Disaster Relief",
    status: "Completed",
    showFinancials: true,
  },
  {
    slug: "village-adoption-program",
    title: "Kallikudi Village Adoption Program",
    description:
      "Holistic 3-year adoption of Kallikudi village: education, health, sanitation, and livelihood development. Currently in year 2 of 3.",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80",
    ],
    date: "2025-01-10",
    duration: "3 years (ongoing)",
    location: "Kallikudi Village, Tamil Nadu",
    beneficiaries: 1200,
    fundsReceived: 600000,
    fundsUsed: 320000,
    category: "Community Development",
    status: "Ongoing",
    showFinancials: true,
  },
  {
    slug: "clean-water-project",
    title: "Clean Drinking Water Initiative",
    description:
      "Installation of 15 RO water purification units in schools and village panchayats. Serving 3,500 people daily with safe drinking water.",
    image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=1200&q=80",
    ],
    date: "2025-09-15",
    duration: "Ongoing",
    location: "Multiple districts, Tamil Nadu",
    beneficiaries: 3500,
    fundsReceived: 450000,
    fundsUsed: 380000,
    category: "Health",
    status: "Ongoing",
    showFinancials: true,
  },
];

export const nalamDetail = [
  {
    slug: "pongal-2025-200-families",
    title: "Pongal Celebration with 200 Families",
    occasion: "Pongal",
    year: 2025,
    date: "2025-01-15",
    location: "Madurai District",
    description:
      "Traditional Pongal celebration with 200 underprivileged families. We provided new clothes, sweets, and a community feast. Children received school supplies for the new academic year.",
    image: "https://images.unsplash.com/photo-1604608672516-f1b9b1a0cb2c?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1604608672516-f1b9b1a0cb2c?w=1200&q=80",
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=1200&q=80",
    ],
    beneficiaries: 200,
    fundsReceived: 150000,
    fundsUsed: 148000,
  },
  {
    slug: "diwali-2024-orphanages",
    title: "Diwali with Orphanage Children",
    occasion: "Diwali",
    year: 2024,
    date: "2024-11-01",
    location: "Chennai",
    description:
      "Diwali celebration across 8 orphanages — sweets, new clothes, and firecrackers for 400 children. A day full of joy and laughter.",
    image: "https://images.unsplash.com/photo-1604423043492-41303788deff?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1604423043492-41303788deff?w=1200&q=80",
    ],
    beneficiaries: 400,
    fundsReceived: 200000,
    fundsUsed: 195000,
  },
  {
    slug: "labour-day-2025",
    title: "Labour Day Appreciation Drive",
    occasion: "Labour Day",
    year: 2025,
    date: "2025-05-01",
    location: "Coimbatore",
    description:
      "Honoring 300+ daily-wage workers with free health checkups, meals, and gift kits on Labour Day.",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=80",
    ],
    beneficiaries: 300,
    fundsReceived: 120000,
    fundsUsed: 118000,
  },
  {
    slug: "new-year-2025-school-supplies",
    title: "New Year School Supplies Distribution",
    occasion: "New Year",
    year: 2025,
    date: "2025-01-01",
    location: "Salem District",
    description:
      "Welcoming 2025 by distributing school bags, notebooks, and stationery to 450 students across 5 government schools.",
    image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200&q=80",
    ],
    beneficiaries: 450,
    fundsReceived: 175000,
    fundsUsed: 170000,
  },
];