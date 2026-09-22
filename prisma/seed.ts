import { PrismaClient, ExperienceLevel, PriorityLevel, SourceType, WorkMode } from "@prisma/client";
import bcrypt from "bcryptjs";
import { STANDARD_SKILLS } from "../src/lib/constants";
import { IngestionService } from "../src/services/ingestion.service";
import { ATS_PRESETS, PUBLIC_FEED_SOURCES } from "../src/lib/ats-registry";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting OffCampus AI Job Aggregator Database Seed...");

  // 1. Seed Technical Skills
  console.log("-> Seeding technical skills...");
  for (const skill of STANDARD_SKILLS) {
    const normalizedName = skill.name.toLowerCase().replace(/[^\w]/g, "");
    await prisma.skill.upsert({
      where: { normalizedName },
      update: {
        name: skill.name,
        category: skill.category,
      },
      create: {
        name: skill.name,
        category: skill.category,
        normalizedName,
      },
    });
  }

  // 2. Create Demo User
  console.log("-> Creating demo user (demo@offcampus.ai / password123)...");
  const passwordHash = await bcrypt.hash("password123", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@offcampus.ai" },
    update: {
      name: "Dev Rajput",
      passwordHash,
    },
    create: {
      name: "Dev Rajput",
      email: "demo@offcampus.ai",
      passwordHash,
    },
  });

  // 3. Create Demo User Profile
  console.log("-> Creating demo user profile & preferences...");
  await prisma.profile.upsert({
    where: { userId: demoUser.id },
    update: {
      college: "National Institute of Technology",
      batchYear: 2025,
      experienceLevel: ExperienceLevel.FRESHER,
      preferredRoles: [
        "Software Development Engineer (SDE 1)",
        "Frontend Engineer",
        "Full Stack Developer",
        "Backend Developer",
        "AI/ML Engineer",
      ],
      preferredLocations: ["Pan India", "Bengaluru", "Hyderabad", "Pune", "Remote - India"],
      preferredWorkModes: [WorkMode.REMOTE, WorkMode.HYBRID, WorkMode.ONSITE],
      minSalary: 12,
    },
    create: {
      userId: demoUser.id,
      college: "National Institute of Technology",
      batchYear: 2025,
      experienceLevel: ExperienceLevel.FRESHER,
      preferredRoles: [
        "Software Development Engineer (SDE 1)",
        "Frontend Engineer",
        "Full Stack Developer",
        "Backend Developer",
        "AI/ML Engineer",
      ],
      preferredLocations: ["Pan India", "Bengaluru", "Hyderabad", "Pune", "Remote - India"],
      preferredWorkModes: [WorkMode.REMOTE, WorkMode.HYBRID, WorkMode.ONSITE],
      minSalary: 12,
    },
  });

  // 4. Attach User Skills
  console.log("-> Assigning user core skills...");
  const candidateSkills = [
    "React",
    "TypeScript",
    "JavaScript",
    "Next.js",
    "Node.js",
    "Python",
    "PostgreSQL",
    "Docker",
    "Data Structures & Algorithms",
    "Tailwind CSS",
    "REST APIs",
  ];

  for (const skName of candidateSkills) {
    const sk = await prisma.skill.findFirst({ where: { name: skName } });
    if (sk) {
      await prisma.userSkill.upsert({
        where: {
          userId_skillId: {
            userId: demoUser.id,
            skillId: sk.id,
          },
        },
        update: { level: "ADVANCED" },
        create: {
          userId: demoUser.id,
          skillId: sk.id,
          level: "ADVANCED",
        },
      });
    }
  }

  // 5. Seed Target Companies from verified ATS registry
  console.log("-> Seeding target companies watchlist...");
  for (const tc of ATS_PRESETS) {
    const existing = await prisma.targetCompany.findFirst({
      where: {
        userId: demoUser.id,
        name: tc.name,
      },
    });

    if (!existing) {
      await prisma.targetCompany.create({
        data: {
          userId: demoUser.id,
          name: tc.name,
          aliases: tc.aliases || [],
          careerPageUrl: tc.careerPageUrl,
          sourceType: tc.sourceType,
          boardToken: tc.boardToken,
          priorityLevel: (tc.priorityLevel as PriorityLevel) || PriorityLevel.HIGH,
          isActive: true,
        },
      });
    } else {
      await prisma.targetCompany.update({
        where: { id: existing.id },
        data: {
          sourceType: tc.sourceType,
          boardToken: tc.boardToken,
          careerPageUrl: tc.careerPageUrl,
        },
      });
    }
  }

  // 6. Seed Job Sources (Real ATS Boards + Public Tech Feeds)
  console.log("-> Registering job ingestion sources...");
  const sourcesData = [
    {
      name: "Stripe Careers Adapter",
      type: SourceType.GREENHOUSE,
      boardToken: "stripe",
      fetchFrequencyMinutes: 60,
      apiUrl: "https://boards-api.greenhouse.io/v1/boards/stripe/jobs?content=true",
      isActive: true,
    },
    {
      name: "Cloudflare Careers Adapter",
      type: SourceType.GREENHOUSE,
      boardToken: "cloudflare",
      fetchFrequencyMinutes: 60,
      apiUrl: "https://boards-api.greenhouse.io/v1/boards/cloudflare/jobs?content=true",
      isActive: true,
    },
    {
      name: "Palantir Postings Adapter",
      type: SourceType.LEVER,
      boardToken: "palantir",
      fetchFrequencyMinutes: 60,
      apiUrl: "https://api.lever.co/v0/postings/palantir?mode=json",
      isActive: true,
    },
    {
      name: "OpenAI Careers Adapter",
      type: SourceType.ASHBY,
      boardToken: "openai",
      fetchFrequencyMinutes: 60,
      apiUrl: "https://api.ashbyhq.com/posting-api/job-board/openai",
      isActive: true,
    },
    {
      name: "Bosch Group Careers Adapter",
      type: SourceType.SMART_RECRUITERS,
      boardToken: "BoschGroup",
      fetchFrequencyMinutes: 60,
      apiUrl: "https://api.smartrecruiters.com/v1/companies/BoschGroup/postings",
      isActive: true,
    },
    {
      name: "bunq Careers Adapter",
      type: SourceType.RECRUITEE,
      boardToken: "bunq",
      fetchFrequencyMinutes: 60,
      apiUrl: "https://bunq.recruitee.com/api/offers/",
      isActive: true,
    },
    ...PUBLIC_FEED_SOURCES.map((f) => ({
      name: f.name,
      type: f.type,
      boardToken: f.boardToken,
      baseUrl: f.baseUrl,
      apiUrl: f.apiUrl,
      fetchFrequencyMinutes: 30,
      isActive: true,
    })),
  ];

  for (const s of sourcesData) {
    const existing = await prisma.jobSource.findFirst({ where: { name: s.name } });
    if (!existing) {
      await prisma.jobSource.create({
        data: s,
      });
    } else {
      await prisma.jobSource.update({
        where: { id: existing.id },
        data: {
          type: s.type,
          boardToken: s.boardToken,
          apiUrl: s.apiUrl,
          baseUrl: (s as any).baseUrl,
        },
      });
    }
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
