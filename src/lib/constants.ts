export const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "Languages",
  "Databases",
  "Cloud & DevOps",
  "AI & Data Science",
  "Core CS",
  "Mobile",
] as const;

export interface StandardSkill {
  name: string;
  category: typeof SKILL_CATEGORIES[number];
  aliases: string[];
}

export const STANDARD_SKILLS: StandardSkill[] = [
  // Languages
  { name: "TypeScript", category: "Languages", aliases: ["typescript", "ts"] },
  { name: "JavaScript", category: "Languages", aliases: ["javascript", "js", "ecmascript"] },
  { name: "Python", category: "Languages", aliases: ["python", "python3", "py"] },
  { name: "Java", category: "Languages", aliases: ["java", "java8", "java17"] },
  { name: "C++", category: "Languages", aliases: ["c++", "cpp"] },
  { name: "C", category: "Languages", aliases: ["c programming", "c-lang"] },
  { name: "Go", category: "Languages", aliases: ["golang", "go"] },
  { name: "Rust", category: "Languages", aliases: ["rust", "rustlang"] },
  { name: "SQL", category: "Languages", aliases: ["sql", "rdbms"] },

  // Frontend
  { name: "React", category: "Frontend", aliases: ["react", "react.js", "reactjs"] },
  { name: "Next.js", category: "Frontend", aliases: ["next.js", "nextjs", "next"] },
  { name: "Vue.js", category: "Frontend", aliases: ["vue", "vue.js", "vuejs"] },
  { name: "Angular", category: "Frontend", aliases: ["angular", "angularjs"] },
  { name: "Tailwind CSS", category: "Frontend", aliases: ["tailwind", "tailwindcss"] },
  { name: "HTML5 & CSS3", category: "Frontend", aliases: ["html", "css", "html5", "css3"] },
  { name: "Redux", category: "Frontend", aliases: ["redux", "redux toolkit"] },

  // Backend
  { name: "Node.js", category: "Backend", aliases: ["node", "node.js", "nodejs"] },
  { name: "Express.js", category: "Backend", aliases: ["express", "express.js", "expressjs"] },
  { name: "NestJS", category: "Backend", aliases: ["nestjs", "nest.js"] },
  { name: "Spring Boot", category: "Backend", aliases: ["spring boot", "springboot", "spring framework"] },
  { name: "Django", category: "Backend", aliases: ["django", "django rest framework", "drf"] },
  { name: "FastAPI", category: "Backend", aliases: ["fastapi", "fast-api"] },
  { name: "GraphQL", category: "Backend", aliases: ["graphql", "gql"] },
  { name: "REST APIs", category: "Backend", aliases: ["rest", "restful", "rest api", "rest apis"] },
  { name: "Microservices", category: "Backend", aliases: ["microservices", "microservice architecture"] },

  // Databases
  { name: "PostgreSQL", category: "Databases", aliases: ["postgresql", "postgres", "psql"] },
  { name: "MySQL", category: "Databases", aliases: ["mysql"] },
  { name: "MongoDB", category: "Databases", aliases: ["mongodb", "mongo"] },
  { name: "Redis", category: "Databases", aliases: ["redis", "in-memory cache"] },
  { name: "Prisma ORM", category: "Databases", aliases: ["prisma", "prisma orm"] },

  // Cloud & DevOps
  { name: "Docker", category: "Cloud & DevOps", aliases: ["docker", "containerization"] },
  { name: "Kubernetes", category: "Cloud & DevOps", aliases: ["kubernetes", "k8s"] },
  { name: "AWS", category: "Cloud & DevOps", aliases: ["aws", "amazon web services", "ec2", "s3", "lambda"] },
  { name: "GCP", category: "Cloud & DevOps", aliases: ["gcp", "google cloud platform", "google cloud"] },
  { name: "CI/CD", category: "Cloud & DevOps", aliases: ["ci/cd", "github actions", "gitlab ci", "jenkins"] },
  { name: "Linux", category: "Cloud & DevOps", aliases: ["linux", "bash", "shell scripting"] },

  // Core CS
  { name: "Data Structures & Algorithms", category: "Core CS", aliases: ["dsa", "data structures", "algorithms", "problem solving"] },
  { name: "OOP (Object-Oriented Programming)", category: "Core CS", aliases: ["oop", "oops", "object oriented"] },
  { name: "System Design", category: "Core CS", aliases: ["system design", "low level design", "lld", "hld"] },
  { name: "Operating Systems", category: "Core CS", aliases: ["operating systems", "os fundamentals"] },
  { name: "Computer Networks", category: "Core CS", aliases: ["computer networks", "cn", "tcp/ip"] },
  { name: "DBMS", category: "Core CS", aliases: ["dbms", "database management"] },

  // AI & Data
  { name: "Machine Learning", category: "AI & Data Science", aliases: ["ml", "machine learning", "scikit-learn"] },
  { name: "Deep Learning", category: "AI & Data Science", aliases: ["deep learning", "neural networks", "pytorch", "tensorflow"] },
  { name: "NLP & LLMs", category: "AI & Data Science", aliases: ["nlp", "llm", "large language models", "openai", "langchain"] },
  { name: "Pandas & NumPy", category: "AI & Data Science", aliases: ["pandas", "numpy"] },
];

export const POPULAR_TARGET_COMPANIES = [
  { name: "Google", aliases: ["Google India", "Alphabet"], careerPageUrl: "https://careers.google.com", priorityLevel: "HIGH" },
  { name: "Microsoft", aliases: ["Microsoft India", "MSFT"], careerPageUrl: "https://careers.microsoft.com", priorityLevel: "HIGH" },
  { name: "Stripe", aliases: ["Stripe Payments"], careerPageUrl: "https://stripe.com/jobs", priorityLevel: "HIGH" },
  { name: "Uber", aliases: ["Uber India", "Uber Technologies"], careerPageUrl: "https://uber.com/careers", priorityLevel: "HIGH" },
  { name: "Atlassian", aliases: ["Atlassian India", "Jira"], careerPageUrl: "https://atlassian.com/company/careers", priorityLevel: "HIGH" },
  { name: "Razorpay", aliases: ["Razorpay Software"], careerPageUrl: "https://razorpay.com/jobs", priorityLevel: "HIGH" },
  { name: "Swiggy", aliases: ["Bundl Technologies", "Swiggy India"], careerPageUrl: "https://careers.swiggy.com", priorityLevel: "MEDIUM" },
  { name: "Zomato", aliases: ["Eternal", "Blinkit"], careerPageUrl: "https://zomato.com/careers", priorityLevel: "MEDIUM" },
  { name: "Zepto", aliases: ["Kiranakart", "Zepto India"], careerPageUrl: "https://zeptonow.com/careers", priorityLevel: "MEDIUM" },
  { name: "CRED", aliases: ["Dreamplug Technologies"], careerPageUrl: "https://cred.club/careers", priorityLevel: "MEDIUM" },
];

export const PREFERRED_ROLE_OPTIONS = [
  "Software Development Engineer (SDE 1)",
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Developer",
  "Software Engineer Intern",
  "Data Engineer",
  "DevOps / Cloud Engineer",
  "AI / ML Engineer",
  "QA / Automation Engineer",
  "Product Engineering Intern",
];

export const PREFERRED_LOCATION_OPTIONS = [
  "Pan India",
  "Bengaluru / Bangalore",
  "Hyderabad",
  "Pune",
  "Delhi NCR / Gurgaon / Noida",
  "Mumbai",
  "Chennai",
  "Remote - India",
  "Remote - Global",
];
