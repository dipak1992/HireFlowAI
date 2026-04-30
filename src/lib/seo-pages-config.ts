// src/lib/seo-pages-config.ts
// SEO landing page configurations for job category + location pages

export interface SeoPageFaq {
  question: string;
  answer: string;
}

export interface SeoPageConfig {
  category: string;
  location: string;
  searchQuery: string;
  searchLocation: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  salaryRange: string;
  topEmployers: string[];
  requirements: string[];
  benefits: string[];
  faqs: SeoPageFaq[];
  relatedSearches: Array<{ label: string; category: string; location: string }>;
}

const SEO_PAGES: SeoPageConfig[] = [
  // ─── Warehouse Jobs ───────────────────────────────────────────────────────
  {
    category: "warehouse-jobs",
    location: "dallas-tx",
    searchQuery: "warehouse jobs",
    searchLocation: "Dallas, TX",
    title: "Warehouse Jobs in Dallas, TX",
    metaTitle: "Warehouse Jobs in Dallas, TX — Apply Today | HireFlow AI",
    metaDescription:
      "Find warehouse jobs in Dallas, TX. Browse forklift operators, pickers, packers, and logistics roles. Apply with an AI-tailored resume in minutes.",
    h1: "Warehouse Jobs in Dallas, TX",
    intro:
      "Dallas is one of the fastest-growing logistics hubs in the United States, with hundreds of warehouse and distribution center openings every week. Whether you're looking for entry-level picking and packing roles or experienced forklift operator positions, HireFlow AI helps you apply faster with a resume tailored to each job.",
    salaryRange: "$15 – $28/hr",
    topEmployers: [
      "Amazon",
      "FedEx",
      "UPS",
      "Walmart Distribution",
      "Target Distribution",
      "XPO Logistics",
      "Prologis",
      "DHL Supply Chain",
    ],
    requirements: [
      "Ability to lift 50+ lbs repeatedly",
      "Forklift certification (for operator roles)",
      "Basic math and inventory counting skills",
      "Reliable transportation to distribution centers",
      "Ability to stand for extended periods",
      "High school diploma or GED (preferred)",
    ],
    benefits: [
      "Competitive hourly pay ($15–$28/hr)",
      "Health, dental, and vision insurance",
      "401(k) with employer match",
      "Paid time off and holiday pay",
      "Overtime opportunities",
      "Shift differentials for nights and weekends",
      "Tuition reimbursement programs",
    ],
    faqs: [
      {
        question: "Do I need experience to get a warehouse job in Dallas?",
        answer:
          "Many warehouse positions in Dallas are entry-level and require no prior experience. Employers like Amazon and FedEx offer paid on-the-job training. Having a forklift certification can increase your pay rate significantly.",
      },
      {
        question: "What shifts are available for warehouse jobs in Dallas?",
        answer:
          "Most Dallas warehouses operate 24/7 and offer day, evening, and overnight shifts. Flexible scheduling is common, and many facilities offer 4-day, 10-hour shift options.",
      },
      {
        question: "How much do warehouse workers make in Dallas, TX?",
        answer:
          "Warehouse workers in Dallas typically earn $15–$28 per hour depending on experience and role. Forklift operators and team leads earn on the higher end. Many employers also offer sign-on bonuses.",
      },
      {
        question: "How can HireFlow AI help me get a warehouse job faster?",
        answer:
          "HireFlow AI tailors your resume to match each warehouse job description, highlighting the skills and keywords employers are looking for. This increases your chances of passing ATS screening and getting called for an interview.",
      },
    ],
    relatedSearches: [
      { label: "Warehouse Jobs in Houston, TX", category: "warehouse-jobs", location: "houston-tx" },
      { label: "Software Engineer Jobs in Austin, TX", category: "software-engineer-jobs", location: "austin-tx" },
      { label: "Remote Software Jobs", category: "remote-software-jobs", location: "united-states" },
    ],
  },
  {
    category: "warehouse-jobs",
    location: "houston-tx",
    searchQuery: "warehouse jobs",
    searchLocation: "Houston, TX",
    title: "Warehouse Jobs in Houston, TX",
    metaTitle: "Warehouse Jobs in Houston, TX — Apply Today | HireFlow AI",
    metaDescription:
      "Browse warehouse and distribution jobs in Houston, TX. Find forklift, picker, packer, and logistics roles near you. AI-tailored resumes get more callbacks.",
    h1: "Warehouse Jobs in Houston, TX",
    intro:
      "Houston's port and energy sector make it one of the top logistics markets in the country. With major distribution centers from Amazon, UPS, and regional employers, there are thousands of warehouse openings in the greater Houston area. HireFlow AI helps you stand out with a resume optimized for each position.",
    salaryRange: "$14 – $26/hr",
    topEmployers: [
      "Amazon",
      "UPS",
      "FedEx",
      "Port of Houston Authority",
      "H-E-B Distribution",
      "Sysco",
      "Walmart Distribution",
      "C.H. Robinson",
    ],
    requirements: [
      "Ability to lift 50+ lbs in a fast-paced environment",
      "Forklift or reach truck experience (for operator roles)",
      "Inventory management and RF scanner experience",
      "Ability to work in temperature-controlled environments",
      "High school diploma or equivalent",
      "Steel-toed boots required",
    ],
    benefits: [
      "Hourly pay $14–$26/hr",
      "Medical, dental, and vision coverage",
      "401(k) retirement plan",
      "Paid holidays and vacation",
      "Weekly or bi-weekly pay",
      "Advancement opportunities to team lead",
      "Employee discount programs",
    ],
    faqs: [
      {
        question: "What types of warehouse jobs are available in Houston?",
        answer:
          "Houston has a wide variety of warehouse roles including order pickers, forklift operators, shipping/receiving clerks, inventory specialists, and warehouse supervisors. The port area also has specialized logistics and freight handling positions.",
      },
      {
        question: "Are there temp-to-hire warehouse jobs in Houston?",
        answer:
          "Yes, many Houston warehouses hire through staffing agencies like Manpower, Adecco, and Kelly Services with temp-to-hire arrangements. This is a great way to get your foot in the door and earn a permanent position.",
      },
      {
        question: "What is the average warehouse salary in Houston, TX?",
        answer:
          "Warehouse workers in Houston earn an average of $14–$26 per hour. Entry-level pickers and packers start around $14–$16/hr, while experienced forklift operators and leads can earn $20–$26/hr.",
      },
      {
        question: "How do I make my warehouse resume stand out?",
        answer:
          "Use HireFlow AI to tailor your resume to each job posting. The AI identifies keywords from the job description and ensures your resume highlights the right skills — like forklift certifications, WMS experience, and safety records.",
      },
    ],
    relatedSearches: [
      { label: "Warehouse Jobs in Dallas, TX", category: "warehouse-jobs", location: "dallas-tx" },
      { label: "Nurse Jobs in Dallas, TX", category: "nurse-jobs", location: "dallas-tx" },
      { label: "Remote Software Jobs", category: "remote-software-jobs", location: "united-states" },
    ],
  },

  // ─── Nurse Jobs ───────────────────────────────────────────────────────────
  {
    category: "nurse-jobs",
    location: "dallas-tx",
    searchQuery: "registered nurse jobs",
    searchLocation: "Dallas, TX",
    title: "Nurse Jobs in Dallas, TX",
    metaTitle: "Nurse Jobs in Dallas, TX — RN & LPN Openings | HireFlow AI",
    metaDescription:
      "Find RN, LPN, and travel nurse jobs in Dallas, TX. Browse hospital, clinic, and home health openings. Get hired faster with an AI-tailored nursing resume.",
    h1: "Nurse Jobs in Dallas, TX",
    intro:
      "Dallas is home to some of the nation's top healthcare systems including UT Southwestern, Baylor Scott & White, and Texas Health Resources. With a growing population and expanding medical facilities, demand for registered nurses, LPNs, and specialty nurses has never been higher. HireFlow AI helps nurses craft ATS-optimized resumes that highlight clinical skills and certifications.",
    salaryRange: "$65,000 – $110,000/yr",
    topEmployers: [
      "UT Southwestern Medical Center",
      "Baylor Scott & White Health",
      "Texas Health Resources",
      "Parkland Health",
      "Children's Health Dallas",
      "Methodist Health System",
      "Medical City Healthcare",
      "VA North Texas Health Care System",
    ],
    requirements: [
      "Active RN or LPN license in Texas",
      "BLS/ACLS certification",
      "1–2 years clinical experience (for most hospital roles)",
      "EMR/EHR proficiency (Epic, Cerner)",
      "Strong patient assessment and communication skills",
      "Ability to work 12-hour shifts",
    ],
    benefits: [
      "Competitive salary $65,000–$110,000/yr",
      "Comprehensive health and dental insurance",
      "Tuition reimbursement and continuing education",
      "Retirement plan with employer match",
      "Sign-on bonuses up to $15,000",
      "Relocation assistance",
      "Flexible scheduling options",
    ],
    faqs: [
      {
        question: "What nursing specialties are in high demand in Dallas?",
        answer:
          "Dallas hospitals are actively hiring ICU, ER, OR, L&D, and oncology nurses. Travel nurse positions are also abundant with premium pay rates. Home health and telehealth nursing roles are growing rapidly as well.",
      },
      {
        question: "Do I need a Texas nursing license to work in Dallas?",
        answer:
          "Yes, you need an active Texas RN or LPN license. Texas is part of the Nurse Licensure Compact (NLC), so nurses from compact states can work in Texas without obtaining a separate license.",
      },
      {
        question: "What is the average RN salary in Dallas, TX?",
        answer:
          "Registered nurses in Dallas earn between $65,000 and $110,000 per year depending on specialty and experience. ICU and OR nurses typically earn on the higher end. Travel nurses can earn significantly more with housing stipends.",
      },
      {
        question: "How can I make my nursing resume stand out in Dallas?",
        answer:
          "HireFlow AI tailors your nursing resume to each job posting, ensuring your clinical skills, certifications, and specialties are prominently featured. The AI also optimizes for ATS systems used by major Dallas hospital networks.",
      },
    ],
    relatedSearches: [
      { label: "Nurse Jobs in New York, NY", category: "nurse-jobs", location: "new-york-ny" },
      { label: "Warehouse Jobs in Dallas, TX", category: "warehouse-jobs", location: "dallas-tx" },
      { label: "Software Engineer Jobs in Austin, TX", category: "software-engineer-jobs", location: "austin-tx" },
    ],
  },
  {
    category: "nurse-jobs",
    location: "new-york-ny",
    searchQuery: "registered nurse jobs",
    searchLocation: "New York, NY",
    title: "Nurse Jobs in New York, NY",
    metaTitle: "Nurse Jobs in New York, NY — RN & LPN Openings | HireFlow AI",
    metaDescription:
      "Find RN, LPN, and travel nurse jobs in New York City. Browse NYC hospital and clinic openings. Get hired faster with an AI-tailored nursing resume.",
    h1: "Nurse Jobs in New York, NY",
    intro:
      "New York City is one of the largest healthcare markets in the world, with world-renowned hospitals like NYU Langone, Mount Sinai, and NewYork-Presbyterian constantly seeking skilled nurses. Whether you're an experienced RN or a new graduate, NYC offers exceptional career growth opportunities. HireFlow AI helps you navigate the competitive NYC nursing job market with a perfectly tailored resume.",
    salaryRange: "$80,000 – $140,000/yr",
    topEmployers: [
      "NYU Langone Health",
      "NewYork-Presbyterian Hospital",
      "Mount Sinai Health System",
      "Northwell Health",
      "NYC Health + Hospitals",
      "Memorial Sloan Kettering",
      "Montefiore Medical Center",
      "Weill Cornell Medicine",
    ],
    requirements: [
      "Active New York State RN or LPN license",
      "BLS, ACLS, and PALS certifications",
      "2+ years clinical experience preferred",
      "Epic or Cerner EMR proficiency",
      "Strong critical thinking and patient advocacy skills",
      "Ability to work in a fast-paced urban hospital environment",
    ],
    benefits: [
      "Top salaries $80,000–$140,000/yr",
      "Comprehensive benefits package",
      "Union representation (1199SEIU)",
      "Generous PTO and holiday pay",
      "Tuition reimbursement programs",
      "Sign-on bonuses up to $20,000",
      "NYC transit benefits",
    ],
    faqs: [
      {
        question: "What nursing specialties are most in demand in NYC?",
        answer:
          "NYC hospitals are actively recruiting ICU, ER, OR, NICU, oncology, and psychiatric nurses. Travel nursing in NYC offers some of the highest pay rates in the country, especially for critical care specialties.",
      },
      {
        question: "Are NYC nursing jobs unionized?",
        answer:
          "Many NYC hospital nursing positions are represented by 1199SEIU, one of the largest healthcare unions in the country. Union positions typically offer strong benefits, job security, and standardized pay scales.",
      },
      {
        question: "What is the average nurse salary in New York City?",
        answer:
          "RNs in New York City earn between $80,000 and $140,000 per year. The high cost of living is offset by some of the highest nursing salaries in the nation. Specialty nurses and those with advanced degrees earn at the top of the range.",
      },
      {
        question: "How competitive is the NYC nursing job market?",
        answer:
          "NYC nursing is competitive, especially at top-tier hospitals. HireFlow AI gives you an edge by tailoring your resume to each specific job posting, ensuring your clinical experience and certifications are highlighted in the exact language hiring managers are looking for.",
      },
    ],
    relatedSearches: [
      { label: "Nurse Jobs in Dallas, TX", category: "nurse-jobs", location: "dallas-tx" },
      { label: "Software Engineer Jobs in San Francisco, CA", category: "software-engineer-jobs", location: "san-francisco-ca" },
      { label: "Remote Software Jobs", category: "remote-software-jobs", location: "united-states" },
    ],
  },

  // ─── Software Engineer Jobs ───────────────────────────────────────────────
  {
    category: "software-engineer-jobs",
    location: "san-francisco-ca",
    searchQuery: "software engineer jobs",
    searchLocation: "San Francisco, CA",
    title: "Software Engineer Jobs in San Francisco, CA",
    metaTitle: "Software Engineer Jobs in San Francisco, CA | HireFlow AI",
    metaDescription:
      "Browse software engineer jobs in San Francisco. Find frontend, backend, full-stack, and AI/ML roles at top tech companies. Land more interviews with AI-tailored resumes.",
    h1: "Software Engineer Jobs in San Francisco, CA",
    intro:
      "San Francisco remains the epicenter of the global tech industry, home to companies like Salesforce, Stripe, Airbnb, and hundreds of high-growth startups. Software engineers in SF command some of the highest salaries in the world. HireFlow AI helps you craft a resume that cuts through the noise and lands you interviews at your dream companies.",
    salaryRange: "$130,000 – $250,000/yr",
    topEmployers: [
      "Salesforce",
      "Stripe",
      "Airbnb",
      "Lyft",
      "Twitter/X",
      "Dropbox",
      "GitHub",
      "OpenAI",
    ],
    requirements: [
      "BS/MS in Computer Science or equivalent experience",
      "Proficiency in Python, JavaScript, Go, or Java",
      "Experience with cloud platforms (AWS, GCP, Azure)",
      "Strong understanding of data structures and algorithms",
      "Experience with distributed systems",
      "Familiarity with CI/CD pipelines and DevOps practices",
    ],
    benefits: [
      "Salaries $130,000–$250,000/yr + equity",
      "Comprehensive health, dental, and vision",
      "401(k) with generous employer match",
      "Remote/hybrid flexibility",
      "Learning and development budgets",
      "Catered meals and wellness perks",
      "Generous parental leave",
    ],
    faqs: [
      {
        question: "What tech stacks are most in demand in San Francisco?",
        answer:
          "SF companies heavily use Python, TypeScript/JavaScript, Go, and Rust. Cloud-native development with Kubernetes, React/Next.js for frontend, and AI/ML frameworks like PyTorch and TensorFlow are highly sought after.",
      },
      {
        question: "Is it worth relocating to San Francisco for a software engineering job?",
        answer:
          "Many SF tech companies now offer remote or hybrid options, but being in SF still provides unmatched networking opportunities and access to the highest-paying roles. Total compensation packages often include significant equity that can be life-changing.",
      },
      {
        question: "What is the average software engineer salary in San Francisco?",
        answer:
          "Software engineers in San Francisco earn $130,000–$250,000+ in base salary, with total compensation (including equity and bonuses) often reaching $300,000–$500,000+ at top companies like Google, Meta, and Stripe.",
      },
      {
        question: "How do I get a software engineering job in SF without a CS degree?",
        answer:
          "Many SF companies hire based on skills and portfolio rather than degrees. Bootcamp graduates and self-taught engineers regularly land roles. HireFlow AI helps you craft a resume that showcases your projects, GitHub contributions, and technical skills effectively.",
      },
    ],
    relatedSearches: [
      { label: "Software Engineer Jobs in Austin, TX", category: "software-engineer-jobs", location: "austin-tx" },
      { label: "Remote Software Jobs", category: "remote-software-jobs", location: "united-states" },
      { label: "Nurse Jobs in New York, NY", category: "nurse-jobs", location: "new-york-ny" },
    ],
  },
  {
    category: "software-engineer-jobs",
    location: "austin-tx",
    searchQuery: "software engineer jobs",
    searchLocation: "Austin, TX",
    title: "Software Engineer Jobs in Austin, TX",
    metaTitle: "Software Engineer Jobs in Austin, TX | HireFlow AI",
    metaDescription:
      "Find software engineer jobs in Austin, TX. Browse roles at Tesla, Dell, Apple, and top Austin startups. Get more interviews with AI-tailored tech resumes.",
    h1: "Software Engineer Jobs in Austin, TX",
    intro:
      "Austin has emerged as one of the hottest tech markets in the US, with major companies like Tesla, Apple, Google, and Oracle establishing large engineering hubs in the city. Combined with a thriving startup ecosystem and no state income tax, Austin offers software engineers an exceptional quality of life and career opportunities. HireFlow AI helps you land your next Austin tech role faster.",
    salaryRange: "$110,000 – $200,000/yr",
    topEmployers: [
      "Tesla",
      "Apple",
      "Google",
      "Oracle",
      "Dell Technologies",
      "Indeed",
      "Atlassian",
      "HomeAway/Vrbo",
    ],
    requirements: [
      "BS in Computer Science, Engineering, or equivalent",
      "Strong proficiency in one or more: Python, Java, C++, TypeScript",
      "Experience with agile development methodologies",
      "Cloud experience (AWS preferred in Austin market)",
      "Strong problem-solving and system design skills",
      "Experience with microservices architecture",
    ],
    benefits: [
      "Competitive salaries $110,000–$200,000/yr",
      "No Texas state income tax",
      "Equity and stock options",
      "Health, dental, and vision insurance",
      "Flexible remote/hybrid work options",
      "Lower cost of living vs. SF/NYC",
      "Vibrant tech community and networking",
    ],
    faqs: [
      {
        question: "Why are so many tech companies moving to Austin?",
        answer:
          "Austin offers a combination of no state income tax, lower cost of living compared to SF/NYC, a large university talent pipeline from UT Austin, and a business-friendly environment. This has attracted Tesla, Apple, Oracle, and hundreds of startups.",
      },
      {
        question: "What is the software engineer job market like in Austin?",
        answer:
          "Austin's tech job market is very active with thousands of open positions. The market is competitive but less saturated than SF. Companies are actively recruiting both local talent and engineers relocating from more expensive cities.",
      },
      {
        question: "What is the average software engineer salary in Austin, TX?",
        answer:
          "Software engineers in Austin earn $110,000–$200,000 in base salary. While slightly lower than SF, the effective take-home pay is often higher due to Texas having no state income tax and a significantly lower cost of living.",
      },
      {
        question: "How can HireFlow AI help me get a tech job in Austin?",
        answer:
          "HireFlow AI analyzes Austin job postings and tailors your resume to match the specific requirements of each role. Whether you're targeting Tesla's engineering team or an Austin startup, the AI ensures your resume passes ATS screening and impresses hiring managers.",
      },
    ],
    relatedSearches: [
      { label: "Software Engineer Jobs in San Francisco, CA", category: "software-engineer-jobs", location: "san-francisco-ca" },
      { label: "Remote Software Jobs", category: "remote-software-jobs", location: "united-states" },
      { label: "Warehouse Jobs in Dallas, TX", category: "warehouse-jobs", location: "dallas-tx" },
    ],
  },

  // ─── Remote Software Jobs ─────────────────────────────────────────────────
  {
    category: "remote-software-jobs",
    location: "united-states",
    searchQuery: "remote software engineer jobs",
    searchLocation: "United States",
    title: "Remote Software Engineer Jobs in the United States",
    metaTitle: "Remote Software Engineer Jobs — Work From Anywhere | HireFlow AI",
    metaDescription:
      "Find remote software engineer jobs in the United States. Browse fully remote frontend, backend, full-stack, and DevOps roles. Apply with an AI-tailored resume.",
    h1: "Remote Software Engineer Jobs in the United States",
    intro:
      "Remote software engineering has become the new normal, with thousands of US companies offering fully remote positions. Whether you're looking for a fully distributed startup or a remote role at a Fortune 500 company, the opportunities are endless. HireFlow AI helps you craft a resume that stands out in the competitive remote job market.",
    salaryRange: "$100,000 – $220,000/yr",
    topEmployers: [
      "GitLab",
      "Automattic",
      "Zapier",
      "Basecamp",
      "Buffer",
      "InVision",
      "Toptal",
      "GitHub",
    ],
    requirements: [
      "Strong async communication skills",
      "Self-motivated with excellent time management",
      "Proficiency in modern web technologies",
      "Experience with remote collaboration tools (Slack, Jira, GitHub)",
      "Reliable high-speed internet connection",
      "Ability to work across time zones when needed",
    ],
    benefits: [
      "Work from anywhere in the US",
      "Competitive salaries $100,000–$220,000/yr",
      "Home office stipends",
      "Flexible working hours",
      "No commute — save time and money",
      "Access to global talent networks",
      "Async-first culture at many companies",
    ],
    faqs: [
      {
        question: "Are remote software engineering jobs as well-paying as in-office roles?",
        answer:
          "Yes, many remote software engineering roles pay competitively with in-office positions. Companies like GitLab, Automattic, and Stripe offer remote-first compensation that doesn't penalize you for location. Some companies do apply geographic pay adjustments.",
      },
      {
        question: "What skills are most important for remote software engineers?",
        answer:
          "Beyond technical skills, remote engineers need excellent written communication, strong self-management, and experience with async collaboration tools. Companies hiring remote engineers specifically look for these soft skills in addition to technical proficiency.",
      },
      {
        question: "How do I find legitimate remote software engineering jobs?",
        answer:
          "Use HireFlow AI's job search to find verified remote positions. We pull real-time listings from JSearch, which aggregates from LinkedIn, Indeed, and company career pages. Filter by 'Remote Only' to see fully distributed roles.",
      },
      {
        question: "How should I tailor my resume for remote software jobs?",
        answer:
          "HireFlow AI automatically highlights remote-relevant skills like async communication, self-direction, and distributed team experience when tailoring your resume for remote positions. This significantly increases your callback rate for remote roles.",
      },
    ],
    relatedSearches: [
      { label: "Software Engineer Jobs in San Francisco, CA", category: "software-engineer-jobs", location: "san-francisco-ca" },
      { label: "Software Engineer Jobs in Austin, TX", category: "software-engineer-jobs", location: "austin-tx" },
      { label: "Nurse Jobs in New York, NY", category: "nurse-jobs", location: "new-york-ny" },
    ],
  },
];

export function getSeoPage(
  category: string,
  location: string
): SeoPageConfig | null {
  return (
    SEO_PAGES.find(
      (p) => p.category === category && p.location === location
    ) ?? null
  );
}

export function getAllSeoPages(): Array<{ category: string; location: string }> {
  return SEO_PAGES.map((p) => ({ category: p.category, location: p.location }));
}
