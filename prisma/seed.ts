// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ---------- Site Settings ----------
  await prisma.siteSetting.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      foundationName: "SEZHIYAM FOUNDATION",
      tagline: "Serving Humanity, Building Communities",
      welcomeMessage: "Welcome to SEZHIYAM FOUNDATION",
      heroQuote:
        "Service to humanity is the best work of life. Together, we build stronger communities.",
      heroDescription:
        "A grassroots NGO working across Tamil Nadu in education, health, community welfare, and disaster relief.",
      aboutContent:
        "Founded on the belief that every person deserves dignity and opportunity, SEZHIYAM FOUNDATION works at the grassroots level to empower underserved communities across Tamil Nadu.",
      visionText:
        "A just and equitable society where every individual has access to education, healthcare, and the opportunity to lead a life of dignity.",
      missionText:
        "To empower underprivileged communities through sustainable programs in education, health, livelihood, and disaster response.",
      valuesText:
        "Compassion. Integrity. Transparency. Community-first. Sustainability.",
      phone: "+91 90000 00000",
      email: "info@sezhiyam.org",
      address: "Tamil Nadu, India",
      socialFacebook: "https://facebook.com/",
      socialInstagram: "https://instagram.com/",
      socialYoutube: "https://youtube.com/",
      socialTwitter: "https://twitter.com/",
    },
  });

  // ---------- Team ----------
  await prisma.teamMember.deleteMany();
  await prisma.teamMember.createMany({
    data: [
      {
        name: "Dr. Rajesh Kumar",
        designation: "Founder & Chairman",
        bio: "A retired professor with 30 years of experience in rural development and social work across Tamil Nadu.",
        photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
        order: 0,
      },
      {
        name: "Mrs. Lakshmi Venkatesan",
        designation: "Managing Trustee",
        bio: "Leads our women's empowerment and education initiatives. Former school principal.",
        photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
        order: 1,
      },
      {
        name: "Mr. Karthik Subramanian",
        designation: "Program Director",
        bio: "Oversees all field operations across districts. Background in public health and disaster response.",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
        order: 2,
      },
      {
        name: "Ms. Priya Ramachandran",
        designation: "Finance & Compliance",
        bio: "Ensures every rupee is accounted for. Chartered Accountant with a passion for nonprofit transparency.",
        photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
        order: 3,
      },
    ],
  });

  // ---------- Wings ----------
  await prisma.wing.deleteMany();
  await prisma.wing.createMany({
    data: [
      {
        name: "Education Wing",
        description:
          "Scholarships, tuition centers, school supplies, and digital literacy for rural children.",
        iconName: "book",
        inChargeName: "Mrs. Lakshmi Venkatesan",
        inChargeDesignation: "In-Charge",
        order: 0,
      },
      {
        name: "Health Wing",
        description:
          "Free medical camps, blood donation drives, and maternal health awareness.",
        iconName: "health",
        inChargeName: "Dr. Rajesh Kumar",
        inChargeDesignation: "In-Charge",
        order: 1,
      },
      {
        name: "Women Empowerment Wing",
        description:
          "Self-help groups, skill training, and financial literacy for women.",
        iconName: "users",
        inChargeName: "Ms. Priya Ramachandran",
        inChargeDesignation: "In-Charge",
        order: 2,
      },
      {
        name: "Disaster Relief Wing",
        description:
          "Rapid response during floods, cyclones, and other emergencies across Tamil Nadu.",
        iconName: "shield",
        inChargeName: "Mr. Karthik Subramanian",
        inChargeDesignation: "In-Charge",
        order: 3,
      },
    ],
  });

  // ---------- Impact stats ----------
  await prisma.impactStat.deleteMany();
  await prisma.impactStat.createMany({
    data: [
      { label: "Established Year", value: 2015, isYear: true, order: 0 },
      { label: "Beneficiaries Reached", value: 5000, suffix: "+", order: 1 },
      { label: "Funds Mobilized", value: 1000000, prefix: "₹", suffix: "+", order: 2 },
      { label: "Projects Completed", value: 50, suffix: "+", order: 3 },
      { label: "Active Volunteers", value: 100, suffix: "+", order: 4 },
    ],
  });

  // ---------- Governance ----------
  await prisma.governanceInfo.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      heading: "Governance & Transparency",
      description:
        "SEZHIYAM FOUNDATION is committed to the highest standards of governance and financial transparency.",
      points:
        "Registered under the Tamil Nadu Societies Registration Act|Annual audited financial statements available on request|All donations acknowledged with official receipts|Public disclosure of project reports",
    },
  });

  // ---------- Working locations ----------
  await prisma.workingLocation.deleteMany();
  await prisma.workingLocation.createMany({
    data: [
      { name: "Chennai", district: "Chennai", latitude: 13.0827, longitude: 80.2707, description: "HQ & primary operations", order: 0 },
      { name: "Madurai", district: "Madurai", latitude: 9.9252, longitude: 78.1198, description: "Health camps & education", order: 1 },
      { name: "Coimbatore", district: "Coimbatore", latitude: 11.0168, longitude: 76.9558, description: "Women's empowerment programs", order: 2 },
      { name: "Salem", district: "Salem", latitude: 11.6643, longitude: 78.1460, description: "School supplies & tuition centers", order: 3 },
      { name: "Tiruchirappalli", district: "Tiruchirappalli", latitude: 10.7905, longitude: 78.7047, description: "Disaster relief hub", order: 4 },
    ],
  });

  // ---------- Projects ----------
  await prisma.project.deleteMany();
  const projects = [
    {
      slug: "free-medical-camp-madurai",
      title: "Free Medical Camp at Madurai Village",
      description:
        "Comprehensive health checkups, medicines, and specialist consultations for 800+ villagers.",
      longDescription:
        "Our team of 15 volunteer doctors, 4 nurses, and 30 field volunteers spent 3 days providing free medical services to underserved communities.",
      coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
      date: new Date("2025-08-10"),
      duration: "3 days",
      location: "Madurai, Tamil Nadu",
      beneficiaries: 800,
      fundsReceived: 250000,
      fundsUsed: 238000,
      category: "Health",
      status: "Completed",
      gallery: [
        "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=1200&q=80",
        "https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200&q=80",
        "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&q=80",
      ],
    },
    {
      slug: "rural-school-digital-literacy",
      title: "Rural School Digital Literacy Program",
      description: "Computer training, tablets, and internet access for 12 government schools.",
      longDescription:
        "We installed 60 tablets, set up computer labs, and trained 500 students in basic digital literacy over 6 months.",
      coverImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80",
      date: new Date("2025-06-15"),
      duration: "6 months",
      location: "Salem, Tamil Nadu",
      beneficiaries: 500,
      fundsReceived: 400000,
      fundsUsed: 385000,
      category: "Education",
      status: "Completed",
      gallery: [
        "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200&q=80",
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80",
      ],
    },
    {
      slug: "women-self-help-group-training",
      title: "Women's Self-Help Group Training",
      description:
        "Financial literacy, tailoring, and entrepreneurship training for 150 women.",
      longDescription:
        "Graduates have started 40+ micro-businesses since completing the program.",
      coverImage: "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=1200&q=80",
      date: new Date("2025-05-20"),
      duration: "4 months",
      location: "Coimbatore, Tamil Nadu",
      beneficiaries: 150,
      fundsReceived: 180000,
      fundsUsed: 172000,
      category: "Women Empowerment",
      status: "Completed",
      gallery: [
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=80",
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=1200&q=80",
      ],
    },
    {
      slug: "flood-relief-chennai-2024",
      title: "Chennai Flood Relief 2024",
      description: "Emergency relief during the 2024 Chennai floods.",
      longDescription:
        "Distributed 2,000 food kits, 500 blankets, and medical aid to families in 8 worst-hit neighborhoods.",
      coverImage: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&q=80",
      date: new Date("2024-12-05"),
      duration: "2 weeks",
      location: "Chennai, Tamil Nadu",
      beneficiaries: 2000,
      fundsReceived: 850000,
      fundsUsed: 845000,
      category: "Disaster Relief",
      status: "Completed",
      gallery: ["https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1200&q=80"],
    },
    {
      slug: "village-adoption-program",
      title: "Kallikudi Village Adoption Program",
      description: "Holistic 3-year adoption of Kallikudi village.",
      longDescription:
        "Education, health, sanitation, and livelihood development. Currently in year 2 of 3.",
      coverImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80",
      date: new Date("2025-01-10"),
      duration: "3 years (ongoing)",
      location: "Kallikudi Village, Tamil Nadu",
      beneficiaries: 1200,
      fundsReceived: 600000,
      fundsUsed: 320000,
      category: "Community Development",
      status: "Ongoing",
      gallery: [],
    },
    {
      slug: "clean-water-project",
      title: "Clean Drinking Water Initiative",
      description: "Installation of 15 RO water purification units in schools and panchayats.",
      longDescription: "Serving 3,500 people daily with safe drinking water.",
      coverImage: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=1200&q=80",
      date: new Date("2025-09-15"),
      duration: "Ongoing",
      location: "Multiple districts, Tamil Nadu",
      beneficiaries: 3500,
      fundsReceived: 450000,
      fundsUsed: 380000,
      category: "Health",
      status: "Ongoing",
      gallery: [],
    },
  ];

  for (const p of projects) {
    const { gallery, ...rest } = p;
    const created = await prisma.project.create({ data: rest });
    if (gallery.length > 0) {
      await prisma.projectImage.createMany({
        data: gallery.map((url, i) => ({ url, order: i, projectId: created.id })),
      });
    }
  }

  // ---------- NALAM ----------
  await prisma.nalamEvent.deleteMany();
  const nalam = [
    {
      slug: "pongal-2025-200-families",
      title: "Pongal Celebration with 200 Families",
      occasion: "Pongal",
      year: 2025,
      description: "Traditional Pongal celebration with 200 underprivileged families.",
      longDescription:
        "Provided new clothes, sweets, and a community feast. Children received school supplies for the new academic year.",
      coverImage: "https://images.unsplash.com/photo-1604608672516-f1b9b1a0cb2c?w=1200&q=80",
      date: new Date("2025-01-15"),
      location: "Madurai District",
      beneficiaries: 200,
      fundsReceived: 150000,
      fundsUsed: 148000,
      gallery: ["https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=1200&q=80"],
    },
    {
      slug: "diwali-2024-orphanages",
      title: "Diwali with Orphanage Children",
      occasion: "Diwali",
      year: 2024,
      description: "Diwali celebration across 8 orphanages.",
      longDescription:
        "Sweets, new clothes, and firecrackers for 400 children. A day full of joy and laughter.",
      coverImage: "https://images.unsplash.com/photo-1604423043492-41303788deff?w=1200&q=80",
      date: new Date("2024-11-01"),
      location: "Chennai",
      beneficiaries: 400,
      fundsReceived: 200000,
      fundsUsed: 195000,
      gallery: [],
    },
    {
      slug: "labour-day-2025",
      title: "Labour Day Appreciation Drive",
      occasion: "Labour Day",
      year: 2025,
      description: "Honoring 300+ daily-wage workers with free health checkups and gift kits.",
      longDescription: "Free health checkups, meals, and gift kits on Labour Day.",
      coverImage: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=80",
      date: new Date("2025-05-01"),
      location: "Coimbatore",
      beneficiaries: 300,
      fundsReceived: 120000,
      fundsUsed: 118000,
      gallery: [],
    },
    {
      slug: "new-year-2025-school-supplies",
      title: "New Year School Supplies Distribution",
      occasion: "New Year",
      year: 2025,
      description: "School bags, notebooks, and stationery to 450 students.",
      longDescription: "Distributed to 5 government schools in Salem District.",
      coverImage: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200&q=80",
      date: new Date("2025-01-01"),
      location: "Salem District",
      beneficiaries: 450,
      fundsReceived: 175000,
      fundsUsed: 170000,
      gallery: [],
    },
  ];

  for (const n of nalam) {
    const { gallery, ...rest } = n;
    const created = await prisma.nalamEvent.create({ data: rest });
    if (gallery.length > 0) {
      await prisma.nalamImage.createMany({
        data: gallery.map((url, i) => ({ url, order: i, nalamEventId: created.id })),
      });
    }
  }

  // ---------- News ----------
  await prisma.newsPost.deleteMany();
  await prisma.newsPost.createMany({
    data: [
      {
        title: "Annual Health Camp in Madurai District",
        description:
          "Over 800 villagers received free health checkups, medicines, and specialist consultations.",
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
        publishedAt: new Date("2025-08-15"),
        eventDate: new Date("2025-08-10"),
        location: "Madurai, Tamil Nadu",
        isEvent: false,
      },
      {
        title: "School Supplies Distribution Drive",
        description:
          "Notebooks, uniforms, and stationery delivered to 500 students across 12 government schools.",
        imageUrl: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&q=80",
        publishedAt: new Date("2025-07-20"),
        eventDate: new Date("2025-07-18"),
        location: "Salem, Tamil Nadu",
        isEvent: false,
      },
      {
        title: "Upcoming: Diwali Celebration with Orphanages",
        description:
          "Join us for a day of celebration, sweets, and gifts for children across 8 orphanages in Chennai.",
        imageUrl: "https://images.unsplash.com/photo-1604423043492-41303788deff?w=600&q=80",
        publishedAt: new Date("2025-10-01"),
        eventDate: new Date("2025-10-25"),
        location: "Chennai, Tamil Nadu",
        isEvent: true,
      },
    ],
  });

  console.log("✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });