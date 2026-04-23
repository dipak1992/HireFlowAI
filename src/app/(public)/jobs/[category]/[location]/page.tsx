import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Briefcase,
  TrendingUp,
  Star,
  ArrowRight,
  CheckCircle,
  DollarSign,
  Clock,
  Users,
} from "lucide-react";

// SEO data for each category/location combo
const JOB_DATA: Record<
  string,
  Record<
    string,
    {
      title: string;
      h1: string;
      description: string;
      keywords: string[];
      avgSalary: string;
      jobCount: string;
      topEmployers: string[];
      requirements: string[];
      benefits: string[];
      relatedSearches: string[];
      faqs: { q: string; a: string }[];
    }
  >
> = {
  "warehouse-jobs": {
    "dallas-tx": {
      title: "Warehouse Jobs in Dallas, TX — Find & Apply Today",
      h1: "Warehouse Jobs in Dallas, TX",
      description:
        "Find warehouse jobs in Dallas, TX. Browse forklift operators, order pickers, shipping & receiving roles. Apply with AI-optimized resume in minutes.",
      keywords: [
        "warehouse jobs dallas tx",
        "warehouse jobs dallas",
        "forklift jobs dallas",
        "order picker dallas",
      ],
      avgSalary: "$18–$24/hr",
      jobCount: "2,400+",
      topEmployers: ["Amazon", "FedEx", "UPS", "Home Depot", "Target", "Walmart"],
      requirements: [
        "High school diploma or GED",
        "Ability to lift 50+ lbs",
        "Forklift certification (preferred)",
        "Basic computer skills",
        "Reliable transportation",
      ],
      benefits: [
        "Health insurance",
        "401(k) matching",
        "Paid time off",
        "Overtime opportunities",
        "Career advancement",
      ],
      relatedSearches: [
        "warehouse jobs houston tx",
        "warehouse jobs austin tx",
        "forklift operator jobs dallas",
        "logistics jobs dallas",
        "distribution center jobs dallas",
      ],
      faqs: [
        {
          q: "What is the average pay for warehouse jobs in Dallas?",
          a: "Warehouse jobs in Dallas typically pay $18–$24 per hour depending on experience, shift, and employer. Forklift operators and team leads earn more.",
        },
        {
          q: "Do I need experience for warehouse jobs in Dallas?",
          a: "Many entry-level warehouse positions in Dallas don't require prior experience. Employers like Amazon and FedEx offer on-the-job training.",
        },
        {
          q: "How do I apply for warehouse jobs in Dallas with HireFlow AI?",
          a: "Sign up free, import your resume or LinkedIn profile, and our AI will match you with warehouse jobs in Dallas and tailor your resume for each application.",
        },
      ],
    },
    "houston-tx": {
      title: "Warehouse Jobs in Houston, TX — Apply Now",
      h1: "Warehouse Jobs in Houston, TX",
      description:
        "Browse warehouse jobs in Houston, TX. Forklift operators, pickers, packers, and logistics roles. AI-powered job matching gets you hired faster.",
      keywords: [
        "warehouse jobs houston tx",
        "warehouse jobs houston",
        "forklift jobs houston",
        "logistics jobs houston",
      ],
      avgSalary: "$17–$23/hr",
      jobCount: "3,100+",
      topEmployers: ["Amazon", "Port of Houston", "Sysco", "Shell", "H-E-B", "UPS"],
      requirements: [
        "High school diploma or GED",
        "Ability to lift 50+ lbs",
        "Forklift certification (preferred)",
        "Team player attitude",
        "Flexible schedule",
      ],
      benefits: [
        "Competitive hourly pay",
        "Health & dental insurance",
        "Paid holidays",
        "Shift differentials",
        "Tuition assistance",
      ],
      relatedSearches: [
        "warehouse jobs dallas tx",
        "port jobs houston",
        "logistics jobs houston",
        "shipping jobs houston",
        "night shift warehouse houston",
      ],
      faqs: [
        {
          q: "What warehouse jobs are available in Houston?",
          a: "Houston has a large logistics sector with roles including forklift operators, order pickers, shipping/receiving clerks, and warehouse supervisors.",
        },
        {
          q: "Are there night shift warehouse jobs in Houston?",
          a: "Yes, many Houston warehouses operate 24/7 and offer night shift positions with shift differential pay.",
        },
        {
          q: "How does HireFlow AI help me find warehouse jobs in Houston?",
          a: "HireFlow AI matches your skills to open warehouse positions in Houston and automatically tailors your resume to each job description.",
        },
      ],
    },
    "austin-tx": {
      title: "Warehouse Jobs in Austin, TX — Find Work Today",
      h1: "Warehouse Jobs in Austin, TX",
      description:
        "Find warehouse and logistics jobs in Austin, TX. Entry-level to experienced roles available. Use AI to match your skills and apply faster.",
      keywords: [
        "warehouse jobs austin tx",
        "warehouse jobs austin",
        "logistics jobs austin",
        "distribution jobs austin texas",
      ],
      avgSalary: "$19–$25/hr",
      jobCount: "1,200+",
      topEmployers: ["Amazon", "Dell", "Apple", "Tesla", "Whole Foods", "FedEx"],
      requirements: [
        "High school diploma or GED",
        "Physical stamina",
        "Attention to detail",
        "Forklift experience (a plus)",
        "Availability for various shifts",
      ],
      benefits: [
        "Above-average pay rates",
        "Health benefits",
        "Stock options (tech warehouses)",
        "Flexible scheduling",
        "Growth opportunities",
      ],
      relatedSearches: [
        "warehouse jobs dallas tx",
        "warehouse jobs houston tx",
        "tech warehouse jobs austin",
        "logistics coordinator austin",
        "supply chain jobs austin",
      ],
      faqs: [
        {
          q: "What is the pay for warehouse jobs in Austin?",
          a: "Austin warehouse jobs pay $19–$25/hr on average, higher than many Texas cities due to the tech industry presence.",
        },
        {
          q: "Which companies hire warehouse workers in Austin?",
          a: "Major employers include Amazon, Dell, Apple, Tesla, and Whole Foods Market, all with large distribution operations in Austin.",
        },
        {
          q: "Can I find remote warehouse management jobs in Austin?",
          a: "While physical warehouse roles require on-site presence, logistics coordinator and supply chain management roles often have hybrid options.",
        },
      ],
    },
  },
  "remote-software-jobs": {
    texas: {
      title: "Remote Software Jobs in Texas — Work From Home",
      h1: "Remote Software Jobs in Texas",
      description:
        "Find remote software engineering jobs in Texas. Full-stack, backend, frontend, and DevOps roles. Apply with an AI-tailored resume and land interviews faster.",
      keywords: [
        "remote software jobs texas",
        "remote developer jobs texas",
        "work from home software engineer texas",
        "remote tech jobs texas",
      ],
      avgSalary: "$95,000–$160,000/yr",
      jobCount: "8,500+",
      topEmployers: ["Dell", "AT&T", "Oracle", "IBM", "Salesforce", "GitHub"],
      requirements: [
        "Bachelor's in CS or equivalent experience",
        "3+ years software development",
        "Proficiency in modern frameworks",
        "Strong communication skills",
        "Home office setup",
      ],
      benefits: [
        "Fully remote flexibility",
        "Competitive salaries",
        "Stock options/RSUs",
        "Home office stipend",
        "Unlimited PTO",
      ],
      relatedSearches: [
        "remote software jobs california",
        "remote full stack developer texas",
        "remote react developer texas",
        "remote python developer texas",
        "remote devops engineer texas",
      ],
      faqs: [
        {
          q: "What remote software jobs are available in Texas?",
          a: "Texas has a thriving tech scene with remote roles in full-stack development, cloud engineering, data science, DevOps, and mobile development.",
        },
        {
          q: "Do remote software jobs in Texas require Texas residency?",
          a: "Most remote jobs listed in Texas are open to candidates nationwide, though some prefer Texas residents for occasional in-person meetings.",
        },
        {
          q: "How does HireFlow AI help me land remote software jobs?",
          a: "HireFlow AI analyzes job descriptions and tailors your resume with the right keywords and skills to pass ATS systems and get noticed by recruiters.",
        },
      ],
    },
    "united-states": {
      title: "Remote Software Jobs in the US — Apply Today",
      h1: "Remote Software Jobs in the United States",
      description:
        "Browse thousands of remote software engineering jobs across the US. AI-powered matching finds the best fit for your skills. Apply in minutes.",
      keywords: [
        "remote software jobs usa",
        "remote developer jobs united states",
        "work from home software engineer",
        "fully remote software jobs",
      ],
      avgSalary: "$90,000–$180,000/yr",
      jobCount: "45,000+",
      topEmployers: ["Google", "Meta", "Amazon", "Microsoft", "Stripe", "Shopify"],
      requirements: [
        "Strong programming fundamentals",
        "Experience with version control (Git)",
        "Ability to work independently",
        "Excellent written communication",
        "Reliable internet connection",
      ],
      benefits: [
        "Work from anywhere in the US",
        "Top-tier compensation",
        "Equity packages",
        "Learning & development budget",
        "Flexible hours",
      ],
      relatedSearches: [
        "remote software jobs texas",
        "remote software jobs california",
        "remote software jobs new york",
        "entry level remote software jobs",
        "senior remote software engineer",
      ],
      faqs: [
        {
          q: "How many remote software jobs are available in the US?",
          a: "There are tens of thousands of remote software positions available at any time, spanning startups to Fortune 500 companies.",
        },
        {
          q: "What skills are most in demand for remote software jobs?",
          a: "React, Node.js, Python, AWS, TypeScript, and Go are among the most sought-after skills for remote software roles in 2024.",
        },
        {
          q: "How can I stand out for remote software jobs?",
          a: "HireFlow AI tailors your resume to each job's specific requirements, highlighting the skills and experience that matter most to each employer.",
        },
      ],
    },
    california: {
      title: "Remote Software Jobs in California — Work From Home",
      h1: "Remote Software Jobs in California",
      description:
        "Find remote software engineering jobs in California. Top tech companies hiring remotely. AI-tailored resume gets you past ATS and into interviews.",
      keywords: [
        "remote software jobs california",
        "remote developer jobs california",
        "work from home software engineer california",
        "remote tech jobs bay area",
      ],
      avgSalary: "$110,000–$200,000/yr",
      jobCount: "12,000+",
      topEmployers: ["Apple", "Google", "Meta", "Netflix", "Airbnb", "Lyft"],
      requirements: [
        "Strong CS fundamentals",
        "5+ years experience (senior roles)",
        "System design knowledge",
        "Agile/Scrum experience",
        "Portfolio or GitHub profile",
      ],
      benefits: [
        "Silicon Valley salaries",
        "Generous equity",
        "Premium health benefits",
        "Remote-first culture",
        "Conference & learning budget",
      ],
      relatedSearches: [
        "remote software jobs san francisco",
        "remote software jobs los angeles",
        "remote software jobs texas",
        "faang remote jobs",
        "remote senior engineer california",
      ],
      faqs: [
        {
          q: "Do California tech companies hire remote workers?",
          a: "Yes, many California tech companies including Google, Meta, and Apple offer fully remote or hybrid positions open to candidates nationwide.",
        },
        {
          q: "What is the average salary for remote software jobs in California?",
          a: "Remote software engineers working for California companies earn $110,000–$200,000+ annually, often with significant equity packages.",
        },
        {
          q: "How do I apply for California remote software jobs from another state?",
          a: "HireFlow AI helps you craft a compelling application that highlights your remote work capabilities and technical skills, regardless of your location.",
        },
      ],
    },
  },
  "nurse-jobs": {
    "near-me": {
      title: "Nurse Jobs Near Me — Find RN, LPN & NP Positions",
      h1: "Nurse Jobs Near You",
      description:
        "Find RN, LPN, NP, and travel nurse jobs near you. AI-powered job matching connects nurses with top hospitals and healthcare systems. Apply today.",
      keywords: [
        "nurse jobs near me",
        "rn jobs near me",
        "nursing jobs near me",
        "registered nurse jobs near me",
      ],
      avgSalary: "$65,000–$110,000/yr",
      jobCount: "18,000+",
      topEmployers: ["HCA Healthcare", "Tenet Health", "CommonSpirit", "Mayo Clinic", "Kaiser", "VA Hospitals"],
      requirements: [
        "Active RN or LPN license",
        "BLS/ACLS certification",
        "Clinical experience (varies by role)",
        "Strong patient care skills",
        "EMR/EHR proficiency",
      ],
      benefits: [
        "Competitive salaries",
        "Sign-on bonuses",
        "Tuition reimbursement",
        "Shift differentials",
        "Relocation assistance",
      ],
      relatedSearches: [
        "rn jobs near me",
        "travel nurse jobs",
        "icu nurse jobs near me",
        "er nurse jobs near me",
        "nurse practitioner jobs near me",
      ],
      faqs: [
        {
          q: "How do I find nursing jobs near me?",
          a: "HireFlow AI uses your location and nursing specialty to match you with open positions at nearby hospitals, clinics, and healthcare systems.",
        },
        {
          q: "What nursing specialties are most in demand?",
          a: "ICU, ER, OR, and telemetry nurses are in high demand nationwide. Nurse practitioners and CRNAs command the highest salaries.",
        },
        {
          q: "Can I find travel nurse jobs with HireFlow AI?",
          a: "Yes, HireFlow AI lists both permanent and travel nursing positions, with filters for contract length, specialty, and location.",
        },
      ],
    },
    "dallas-tx": {
      title: "Nurse Jobs in Dallas, TX — RN & NP Positions",
      h1: "Nurse Jobs in Dallas, TX",
      description:
        "Find RN, LPN, and NP jobs in Dallas, TX. Top hospitals and healthcare systems hiring now. AI-tailored applications get you noticed faster.",
      keywords: [
        "nurse jobs dallas tx",
        "rn jobs dallas",
        "nursing jobs dallas texas",
        "registered nurse dallas",
      ],
      avgSalary: "$68,000–$115,000/yr",
      jobCount: "3,200+",
      topEmployers: ["UT Southwestern", "Baylor Scott & White", "Texas Health", "Parkland", "Children's Health", "Methodist"],
      requirements: [
        "Texas RN license (or compact license)",
        "BLS certification required",
        "ACLS preferred for acute care",
        "1+ years clinical experience",
        "Epic EMR experience preferred",
      ],
      benefits: [
        "Competitive Dallas market pay",
        "No state income tax",
        "Relocation packages",
        "Continuing education support",
        "Retirement matching",
      ],
      relatedSearches: [
        "rn jobs dallas",
        "icu nurse jobs dallas",
        "er nurse jobs dallas",
        "nurse practitioner jobs dallas",
        "travel nurse dallas tx",
      ],
      faqs: [
        {
          q: "What hospitals are hiring nurses in Dallas?",
          a: "Major Dallas employers include UT Southwestern Medical Center, Baylor Scott & White, Texas Health Resources, and Parkland Memorial Hospital.",
        },
        {
          q: "What is the average RN salary in Dallas, TX?",
          a: "Registered nurses in Dallas earn $68,000–$115,000 annually depending on specialty, experience, and facility type.",
        },
        {
          q: "Does Texas have a nursing shortage?",
          a: "Yes, Texas faces a significant nursing shortage, creating excellent job opportunities and competitive salaries for qualified nurses.",
        },
      ],
    },
    "houston-tx": {
      title: "Nurse Jobs in Houston, TX — Apply Now",
      h1: "Nurse Jobs in Houston, TX",
      description:
        "Browse nursing jobs in Houston, TX at top medical centers. RN, LPN, NP, and travel nurse positions available. Apply with AI-optimized resume.",
      keywords: [
        "nurse jobs houston tx",
        "rn jobs houston",
        "nursing jobs houston texas",
        "texas medical center jobs",
      ],
      avgSalary: "$67,000–$112,000/yr",
      jobCount: "4,100+",
      topEmployers: ["Texas Medical Center", "Houston Methodist", "Memorial Hermann", "HCA Houston", "UTHealth", "MD Anderson"],
      requirements: [
        "Texas RN license",
        "BLS/ACLS certification",
        "Clinical experience preferred",
        "Strong critical thinking",
        "Team collaboration skills",
      ],
      benefits: [
        "World-class medical facilities",
        "Research opportunities",
        "Competitive compensation",
        "Professional development",
        "Diverse patient population",
      ],
      relatedSearches: [
        "nurse jobs dallas tx",
        "md anderson nurse jobs",
        "houston methodist nursing jobs",
        "icu nurse houston",
        "travel nurse houston tx",
      ],
      faqs: [
        {
          q: "Is Houston a good city for nurses?",
          a: "Houston is home to the Texas Medical Center, the world's largest medical complex, offering exceptional career opportunities for nurses of all specialties.",
        },
        {
          q: "What nursing specialties are in demand in Houston?",
          a: "Oncology, cardiac, trauma, and pediatric nurses are especially in demand in Houston due to its world-class medical institutions.",
        },
        {
          q: "How do I apply for nursing jobs at Houston hospitals?",
          a: "HireFlow AI helps you create a nursing-specific resume tailored to each hospital's requirements and ATS system, maximizing your chances of getting an interview.",
        },
      ],
    },
    "new-york-ny": {
      title: "Nurse Jobs in New York, NY — RN & NP Positions",
      h1: "Nurse Jobs in New York, NY",
      description:
        "Find nursing jobs in New York City. Top hospitals hiring RNs, LPNs, and NPs. Competitive NYC salaries. AI-powered applications get you hired faster.",
      keywords: [
        "nurse jobs new york",
        "rn jobs nyc",
        "nursing jobs new york city",
        "registered nurse new york",
      ],
      avgSalary: "$85,000–$140,000/yr",
      jobCount: "6,500+",
      topEmployers: ["NYC Health + Hospitals", "NYU Langone", "Mount Sinai", "NewYork-Presbyterian", "Northwell Health", "Montefiore"],
      requirements: [
        "New York RN license",
        "BLS/ACLS certification",
        "2+ years experience preferred",
        "Strong clinical assessment skills",
        "Bilingual a plus (Spanish/Mandarin)",
      ],
      benefits: [
        "Highest nursing salaries in US",
        "Union representation available",
        "Comprehensive benefits",
        "Career advancement paths",
        "Diverse patient population",
      ],
      relatedSearches: [
        "rn jobs nyc",
        "nyu langone nursing jobs",
        "mount sinai nurse jobs",
        "travel nurse new york",
        "nurse practitioner nyc",
      ],
      faqs: [
        {
          q: "What is the average nurse salary in New York City?",
          a: "RNs in NYC earn $85,000–$140,000 annually, among the highest in the nation, reflecting the high cost of living and strong union presence.",
        },
        {
          q: "Are nursing unions strong in New York?",
          a: "Yes, New York has strong nursing unions including NYSNA, which negotiate competitive wages, benefits, and safe staffing ratios.",
        },
        {
          q: "How competitive are nursing jobs in NYC?",
          a: "While competitive, NYC has a high demand for nurses. HireFlow AI helps your application stand out with a tailored resume and cover letter.",
        },
      ],
    },
  },
};

type Params = { category: string; location: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category, location } = await params;
  const data = JOB_DATA[category]?.[location];

  if (!data) {
    return {
      title: "Jobs | HireFlow AI",
      description: "Find your next job with HireFlow AI.",
    };
  }

  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hireflow.ai";

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    openGraph: {
      title: data.title,
      description: data.description,
      url: `${BASE_URL}/jobs/${category}/${location}`,
      type: "website",
    },
    alternates: {
      canonical: `${BASE_URL}/jobs/${category}/${location}`,
    },
  };
}

export function generateStaticParams() {
  const params: Params[] = [];
  for (const category of Object.keys(JOB_DATA)) {
    for (const location of Object.keys(JOB_DATA[category])) {
      params.push({ category, location });
    }
  }
  return params;
}

export default async function JobLandingPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category, location } = await params;
  const data = JOB_DATA[category]?.[location];

  if (!data) notFound();

  const categoryLabel = category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const locationLabel = location.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: data.h1,
    description: data.description,
    hiringOrganization: {
      "@type": "Organization",
      name: "HireFlow AI",
      sameAs: process.env.NEXT_PUBLIC_APP_URL || "https://hireflow.ai",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: locationLabel,
        addressCountry: "US",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: {
        "@type": "QuantitativeValue",
        value: data.avgSalary,
        unitText: "YEAR",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 text-blue-200 text-sm mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/jobs" className="hover:text-white transition-colors">
                Jobs
              </Link>
              <span>/</span>
              <span>{categoryLabel}</span>
              <span>/</span>
              <span>{locationLabel}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.h1}</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl">{data.description}</p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <Briefcase className="h-5 w-5 text-blue-200" />
                <span className="font-semibold">{data.jobCount} Open Positions</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <DollarSign className="h-5 w-5 text-blue-200" />
                <span className="font-semibold">{data.avgSalary} Avg. Pay</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <MapPin className="h-5 w-5 text-blue-200" />
                <span className="font-semibold">{locationLabel}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                render={<Link href="/signup" />}
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold text-base px-8"
              >
                Find My Match — Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                render={<Link href="/login" />}
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-semibold text-base px-8"
              >
                Sign In
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-white border-b py-6 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{data.jobCount}</div>
              <div className="text-sm text-muted-foreground">Active Jobs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{data.avgSalary}</div>
              <div className="text-sm text-muted-foreground">Average Pay</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">2x</div>
              <div className="text-sm text-muted-foreground">Faster Hiring</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">94%</div>
              <div className="text-sm text-muted-foreground">Match Accuracy</div>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Top Employers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Top Employers Hiring Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.topEmployers.map((employer) => (
                    <Badge
                      key={employer}
                      variant="secondary"
                      className="text-sm px-3 py-1"
                    >
                      {employer}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Common Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.requirements.map((req) => (
                    <li key={req} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Typical Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {data.faqs.map((faq, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold">
                        {faq.q}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{faq.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA Card */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg">Find Your Perfect Match</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  HireFlow AI matches you with {data.jobCount} open positions and tailors your resume automatically.
                </p>
                <Button
                  render={<Link href="/signup" />}
                  className="w-full"
                  size="lg"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  No credit card required
                </p>
              </CardContent>
            </Card>

            {/* Related Searches */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Related Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.relatedSearches.map((search) => {
                    const slug = search.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                    return (
                      <li key={search}>
                        <Link
                          href={`/signup?q=${encodeURIComponent(search)}`}
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <ArrowRight className="h-3 w-3" />
                          {search}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  How HireFlow AI Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {[
                    "Import your resume or LinkedIn profile",
                    "AI matches you with relevant jobs",
                    "Resume auto-tailored for each role",
                    "Track applications in one place",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4 mt-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Find {categoryLabel}?
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Join thousands of job seekers who found their dream job with HireFlow AI.
              Get matched with {data.jobCount} open positions today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                render={<Link href="/signup" />}
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8"
              >
                Start for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                render={<Link href="/pricing" />}
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-semibold px-8"
              >
                View Pricing
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
