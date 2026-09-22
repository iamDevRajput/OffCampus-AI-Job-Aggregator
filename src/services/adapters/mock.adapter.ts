import { SourceAdapter, SourceConfig, RawJob, NormalizedJob } from "./base.adapter";
import { SourceType, WorkMode, EmploymentType } from "@prisma/client";
import { NormalizationService } from "../normalization.service";
import { ExtractionService } from "../extraction.service";
import { DeduplicationService } from "../deduplication.service";

export class MockSourceAdapter implements SourceAdapter {
  sourceType: SourceType = SourceType.MOCK;

  validateConfig(config: SourceConfig): boolean {
    return true;
  }

  async fetchJobs(config: SourceConfig): Promise<RawJob[]> {
    const now = new Date();
    const inDays = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const agoHours = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000);

    return [
      {
        externalId: "mock-google-swe-2025",
        title: "Software Engineer - Early Career / University Graduate 2025",
        company: "Google",
        location: "Bengaluru / Hyderabad",
        workMode: WorkMode.HYBRID,
        employmentType: EmploymentType.FULL_TIME,
        rawSalary: "₹24 - ₹32 LPA",
        minSalary: 24,
        maxSalary: 32,
        currency: "INR",
        experienceMin: 0,
        experienceMax: 1,
        deadline: inDays(14),
        postedAt: agoHours(4),
        applyUrl: "https://careers.google.com/jobs/results/early-career-swe-india",
        description: `Google is seeking passionate Software Engineers to join our global engineering teams in Bengaluru and Hyderabad.
As an Early Career Software Engineer, you will work on core Google products spanning Search, YouTube, Android, Cloud, and AI infra.

Key Responsibilities:
- Design, test, deploy, and maintain scalable software solutions.
- Manage individual project priorities, deadlines, and deliverables.
- Write clean, robust, well-tested code in C++, Java, Python, or Go.

Minimum Qualifications:
- Bachelor's or Master's degree in Computer Science or related technical field (Batch 2024 / 2025 / 2026).
- Experience with Data Structures & Algorithms, Problem Solving, and System Design basics.
- Proficiency in C++, Java, Go, or Python.`,
      },
      {
        externalId: "mock-stripe-fullstack-2025",
        title: "Software Engineer I - Infrastructure & Full Stack",
        company: "Stripe",
        location: "Bengaluru (Remote Friendly)",
        workMode: WorkMode.REMOTE,
        employmentType: EmploymentType.FULL_TIME,
        rawSalary: "₹28 - ₹38 LPA",
        minSalary: 28,
        maxSalary: 38,
        currency: "INR",
        experienceMin: 0,
        experienceMax: 2,
        deadline: inDays(20),
        postedAt: agoHours(12),
        applyUrl: "https://stripe.com/jobs/listing/software-engineer-early-career",
        description: `Stripe is building the economic infrastructure for the internet. We are hiring Software Engineers to expand our global payments and banking platform.

What you'll work on:
- Architect reliable, secure, distributed financial systems using TypeScript, React, Ruby, Go, and PostgreSQL.
- Build delightful frontend experiences using Next.js and Tailwind CSS.
- Optimize microservices handling millions of queries per second with Redis and Kafka.

Qualifications:
- Solid foundation in Computer Science fundamentals (DSA, Operating Systems, Computer Networks).
- Strong proficiency in TypeScript, React, Node.js, or Go.
- Passion for developer tools and high code quality.`,
      },
      {
        externalId: "mock-razorpay-sde1-2025",
        title: "Software Development Engineer 1 (SDE 1) - Frontend",
        company: "Razorpay",
        location: "Bengaluru",
        workMode: WorkMode.ONSITE,
        employmentType: EmploymentType.FULL_TIME,
        rawSalary: "₹16 - ₹22 LPA",
        minSalary: 16,
        maxSalary: 22,
        currency: "INR",
        experienceMin: 0,
        experienceMax: 1,
        deadline: inDays(5),
        postedAt: agoHours(6),
        applyUrl: "https://razorpay.com/jobs/frontend-sde1-bengaluru",
        description: `Razorpay is India's leading fintech unicorn. We're looking for an enthusiastic Frontend SDE 1 to build next-generation checkout & payment dashboard interfaces.

Tech Stack:
- React, Next.js, TypeScript, Redux, Tailwind CSS, Webpack, Jest.
- REST APIs, GraphQL, Micro-frontends.

Requirements:
- Strong grasp of JavaScript, TypeScript, and modern React patterns.
- Understanding of web performance, browser rendering, and responsive UI design.
- Fresher from 2024/2025 batch or up to 1 year of experience.`,
      },
      {
        externalId: "mock-atlassian-grad-2025",
        title: "Graduate Software Engineer (Backend / Cloud)",
        company: "Atlassian",
        location: "Bengaluru",
        workMode: WorkMode.HYBRID,
        employmentType: EmploymentType.FULL_TIME,
        rawSalary: "₹20 - ₹26 LPA",
        minSalary: 20,
        maxSalary: 26,
        currency: "INR",
        experienceMin: 0,
        experienceMax: 1,
        deadline: inDays(8),
        postedAt: agoHours(18),
        applyUrl: "https://atlassian.com/company/careers/graduate-swe-2025",
        description: `Join Atlassian in building collaboration tools like Jira, Confluence, and Trello.

We look for curious, creative minds who love solving difficult distributed systems problems.
Skills needed:
- Java, Spring Boot, Python, Kotlin, AWS, Docker, Microservices.
- Good knowledge of Relational Databases (PostgreSQL, MySQL) and Redis caching.
- Excellent communication and teamwork abilities.`,
      },
      {
        externalId: "mock-uber-intern-2025",
        title: "Software Engineering Intern - 6 Months",
        company: "Uber",
        location: "Bengaluru / Hyderabad",
        workMode: WorkMode.HYBRID,
        employmentType: EmploymentType.INTERNSHIP,
        rawSalary: "₹75,000/month Stipend",
        minSalary: null,
        maxSalary: null,
        currency: "INR",
        experienceMin: 0,
        experienceMax: 0,
        deadline: inDays(3),
        postedAt: agoHours(2),
        applyUrl: "https://uber.com/careers/swe-intern-india-2025",
        description: `Uber India is hiring 6-month Software Engineering Interns.
High conversion probability to full-time SDE 1 based on internship performance.

Requirements:
- Final year or pre-final year engineering student.
- Strong coding skills in Java, Go, Python, or C++.
- Proficient in Data Structures, Algorithms, and OOP concepts.`,
      },
      {
        externalId: "mock-zepto-backend-2025",
        title: "Backend Engineer - SDE 1 (10-Min Delivery Tech)",
        company: "Zepto",
        location: "Mumbai / Bengaluru",
        workMode: WorkMode.ONSITE,
        employmentType: EmploymentType.FULL_TIME,
        rawSalary: "₹18 - ₹24 LPA",
        minSalary: 18,
        maxSalary: 24,
        currency: "INR",
        experienceMin: 0,
        experienceMax: 1,
        deadline: inDays(10),
        postedAt: agoHours(8),
        applyUrl: "https://zeptonow.com/careers/backend-sde-1",
        description: `Zepto is scaling fast! Join our high-throughput dispatch and catalog engineering team.

Responsibilities:
- Build low-latency microservices with Node.js, Express.js, TypeScript, and Go.
- Manage databases including PostgreSQL, MongoDB, and Redis.
- Deploy with Docker and Kubernetes on AWS.`,
      },
      {
        externalId: "mock-cred-frontend-2025",
        title: "Frontend Developer - Design Systems",
        company: "CRED",
        location: "Bengaluru",
        workMode: WorkMode.ONSITE,
        employmentType: EmploymentType.FULL_TIME,
        rawSalary: "₹22 - ₹30 LPA",
        minSalary: 22,
        maxSalary: 30,
        currency: "INR",
        experienceMin: 0,
        experienceMax: 2,
        deadline: inDays(15),
        postedAt: agoHours(24),
        applyUrl: "https://cred.club/careers/frontend-engineer",
        description: `CRED is renowned for crafting world-class digital experiences. We are looking for frontend craftspeople.

Skills:
- React, Next.js, TypeScript, Tailwind CSS, Framer Motion, HTML5, CSS3.
- Eye for precision, micro-interactions, dark aesthetic, and performance optimization.`,
      },
      {
        externalId: "mock-swiggy-data-2025",
        title: "Associate Data Engineer / AI Trainee",
        company: "Swiggy",
        location: "Bengaluru",
        workMode: WorkMode.HYBRID,
        employmentType: EmploymentType.FULL_TIME,
        rawSalary: "₹14 - ₹18 LPA",
        minSalary: 14,
        maxSalary: 18,
        currency: "INR",
        experienceMin: 0,
        experienceMax: 1,
        deadline: inDays(12),
        postedAt: agoHours(30),
        applyUrl: "https://careers.swiggy.com/data-engineer-associate",
        description: `Swiggy AI & Data Platform processes terabytes of live streaming order data.

Requirements:
- Python, SQL, Pandas, NumPy, Machine Learning basics.
- Familiarity with AWS, Docker, and CI/CD pipelines.
- Fresh graduates with strong analytical and problem-solving skills.`,
      },
      {
        externalId: "mock-microsoft-sde-2025",
        title: "Software Engineer (SDE 1) - Azure Core Platform",
        company: "Microsoft",
        location: "Hyderabad / Noida",
        workMode: WorkMode.HYBRID,
        employmentType: EmploymentType.FULL_TIME,
        rawSalary: "₹22 - ₹28 LPA",
        minSalary: 22,
        maxSalary: 28,
        currency: "INR",
        experienceMin: 0,
        experienceMax: 1,
        deadline: inDays(16),
        postedAt: agoHours(14),
        applyUrl: "https://careers.microsoft.com/jobs/azure-sde1-india",
        description: `Join Microsoft Azure team in India. Work on hyper-scale distributed cloud systems.

Requirements:
- Proficiency in C++, C#, Java, or Python.
- Strong knowledge of Data Structures, Algorithms, Operating Systems, Computer Networks.
- Passion for building cloud-native resilient services.`,
      },
      {
        externalId: "mock-innovaccer-fullstack-2025",
        title: "Associate Software Engineer - Full Stack",
        company: "Innovaccer",
        location: "Noida / Pune",
        workMode: WorkMode.HYBRID,
        employmentType: EmploymentType.FULL_TIME,
        rawSalary: "₹10 - ₹14 LPA",
        minSalary: 10,
        maxSalary: 14,
        currency: "INR",
        experienceMin: 0,
        experienceMax: 1,
        deadline: inDays(7),
        postedAt: agoHours(16),
        applyUrl: "https://innovaccer.com/careers/associate-swe",
        description: `Innovaccer is India's leading health-tech unicorn.
We are hiring 2024/2025 freshers for full-stack engineering roles.

Tech:
- React, JavaScript, Python, Django, PostgreSQL, Docker.`,
      },
    ];
  }

  normalizeJob(raw: RawJob): NormalizedJob {
    const normalizedCompany = NormalizationService.normalizeCompany(raw.company);
    const normalizedLocation = NormalizationService.normalizeLocation(raw.location);
    const normalizedWorkMode = raw.workMode || NormalizationService.normalizeWorkMode(undefined, `${raw.location} ${raw.description}`);
    const normalizedEmployment = raw.employmentType || NormalizationService.normalizeEmploymentType(undefined, raw.title);

    const extractedSkills = ExtractionService.extractSkills(raw.title, raw.description);
    const salaryInfo = ExtractionService.extractSalary(raw.rawSalary, raw.description);
    const expInfo = ExtractionService.extractExperience(`${raw.title} ${raw.description}`);

    const contentHash = DeduplicationService.generateContentHash(
      raw.company,
      raw.title,
      raw.applyUrl,
      raw.location
    );

    return {
      externalId: raw.externalId,
      title: raw.title.trim(),
      company: raw.company.trim(),
      normalizedCompany,
      description: raw.description,
      applyUrl: raw.applyUrl,
      location: normalizedLocation,
      workMode: normalizedWorkMode,
      employmentType: normalizedEmployment,
      minSalary: raw.minSalary ?? salaryInfo.minSalary,
      maxSalary: raw.maxSalary ?? salaryInfo.maxSalary,
      currency: raw.currency || salaryInfo.currency,
      salaryDisclosed: salaryInfo.salaryDisclosed,
      salaryRaw: raw.rawSalary || salaryInfo.salaryRaw,
      experienceMin: raw.experienceMin ?? expInfo.experienceMin,
      experienceMax: raw.experienceMax ?? expInfo.experienceMax,
      deadline: raw.deadline ? new Date(raw.deadline) : null,
      postedAt: raw.postedAt ? new Date(raw.postedAt) : new Date(),
      extractedSkills,
      contentHash,
      rawData: JSON.stringify(raw),
    };
  }
}
