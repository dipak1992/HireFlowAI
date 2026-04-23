import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  MapPin,
  Quote,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Success Stories — Real People, Real Results",
  description:
    "See how job seekers used HireFlow AI to land their dream jobs faster. Real success stories from warehouse workers, nurses, software engineers, and more.",
  openGraph: {
    title: "HireFlow AI Success Stories — Real People, Real Results",
    description:
      "Thousands of job seekers have found their dream jobs with HireFlow AI. Read their stories.",
  },
};

const SUCCESS_STORIES = [
  {
    name: "Marcus T.",
    role: "Software Engineer",
    company: "Stripe",
    location: "Austin, TX",
    previousRole: "Junior Developer at local agency",
    salaryIncrease: "+$45,000/yr",
    timeToHire: "3 weeks",
    avatar: "MT",
    color: "bg-blue-500",
    quote:
      "HireFlow AI tailored my resume for each application and highlighted skills I didn't even think to mention. I went from 0 callbacks to 4 interviews in one week. Landed a senior role at Stripe — couldn't believe it.",
    tags: ["Software Engineering", "Remote", "Tech"],
    rating: 5,
  },
  {
    name: "Sarah K.",
    role: "Registered Nurse",
    company: "UT Southwestern Medical Center",
    location: "Dallas, TX",
    previousRole: "RN at community clinic",
    salaryIncrease: "+$22,000/yr",
    timeToHire: "2 weeks",
    avatar: "SK",
    color: "bg-green-500",
    quote:
      "I was applying to hospital jobs for months with no luck. HireFlow AI rewrote my resume to highlight my ICU experience and certifications. Got called by UT Southwestern within 3 days. Now I'm making $28k more per year.",
    tags: ["Nursing", "Healthcare", "Dallas"],
    rating: 5,
  },
  {
    name: "James R.",
    role: "Warehouse Supervisor",
    company: "Amazon",
    location: "Houston, TX",
    previousRole: "Forklift Operator",
    salaryIncrease: "+$18,000/yr",
    timeToHire: "1 week",
    avatar: "JR",
    color: "bg-orange-500",
    quote:
      "I had 8 years of warehouse experience but my resume didn't show it well. HireFlow AI restructured everything and matched me with supervisor roles I didn't think I was qualified for. Amazon hired me in a week.",
    tags: ["Warehouse", "Logistics", "Houston"],
    rating: 5,
  },
  {
    name: "Priya M.",
    role: "Data Analyst",
    company: "Spotify",
    location: "Remote",
    previousRole: "Excel analyst at insurance company",
    salaryIncrease: "+$35,000/yr",
    timeToHire: "4 weeks",
    avatar: "PM",
    color: "bg-purple-500",
    quote:
      "I knew SQL and Python but my resume screamed 'Excel monkey.' HireFlow AI transformed it to highlight my technical skills and matched me with data roles at tech companies. Now I work remotely for Spotify.",
    tags: ["Data Analytics", "Remote", "Tech"],
    rating: 5,
  },
  {
    name: "Carlos V.",
    role: "Sales Manager",
    company: "Salesforce",
    location: "Chicago, IL",
    previousRole: "SDR at B2B startup",
    salaryIncrease: "+$40,000/yr",
    timeToHire: "3 weeks",
    avatar: "CV",
    color: "bg-red-500",
    quote:
      "The AI prep feature is incredible. It gave me exact questions to expect and how to frame my answers. Walked into my Salesforce interview fully prepared. Got the offer the same week.",
    tags: ["Sales", "Chicago", "Enterprise"],
    rating: 5,
  },
  {
    name: "Emily W.",
    role: "Marketing Manager",
    company: "HubSpot",
    location: "Remote",
    previousRole: "Social media coordinator",
    salaryIncrease: "+$28,000/yr",
    timeToHire: "5 weeks",
    avatar: "EW",
    color: "bg-pink-500",
    quote:
      "I was stuck in a coordinator role for 3 years. HireFlow AI showed me which manager-level jobs matched my experience and helped me position myself as a strategic marketer. HubSpot hired me for a fully remote role.",
    tags: ["Marketing", "Remote", "Growth"],
    rating: 5,
  },
  {
    name: "David L.",
    role: "DevOps Engineer",
    company: "Cloudflare",
    location: "Remote",
    previousRole: "IT support specialist",
    salaryIncrease: "+$55,000/yr",
    timeToHire: "6 weeks",
    avatar: "DL",
    color: "bg-cyan-500",
    quote:
      "I self-taught AWS and Kubernetes but had no formal DevOps title. HireFlow AI matched me with DevOps roles that valued hands-on experience over titles. Cloudflare saw past my job title and hired me for $55k more.",
    tags: ["DevOps", "Cloud", "Remote"],
    rating: 5,
  },
  {
    name: "Aisha B.",
    role: "Travel Nurse",
    company: "AMN Healthcare",
    location: "New York, NY",
    previousRole: "Staff RN in Texas",
    salaryIncrease: "+$60,000/yr",
    timeToHire: "1 week",
    avatar: "AB",
    color: "bg-teal-500",
    quote:
      "I wanted to try travel nursing but didn't know where to start. HireFlow AI found me contracts in NYC paying nearly double my Texas salary. The application process was seamless — everything was pre-filled and tailored.",
    tags: ["Travel Nursing", "New York", "Healthcare"],
    rating: 5,
  },
  {
    name: "Ryan P.",
    role: "Full Stack Developer",
    company: "Shopify",
    location: "Remote",
    previousRole: "Bootcamp graduate",
    salaryIncrease: "First tech job: $95,000/yr",
    timeToHire: "8 weeks",
    avatar: "RP",
    color: "bg-indigo-500",
    quote:
      "As a bootcamp grad with no CS degree, I was getting ghosted everywhere. HireFlow AI helped me build a portfolio-focused resume and matched me with companies that hire bootcamp grads. Shopify gave me my first tech job.",
    tags: ["Software Engineering", "Remote", "Entry Level"],
    rating: 5,
  },
];

const STATS = [
  { value: "12,400+", label: "Jobs Landed" },
  { value: "3 weeks", label: "Avg. Time to Hire" },
  { value: "$31,000", label: "Avg. Salary Increase" },
  { value: "94%", label: "Interview Rate" },
];

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
            Real Results
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Real People. Real Jobs.{" "}
            <span className="text-blue-400">Real Results.</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Over 12,000 job seekers have used HireFlow AI to land better jobs
            faster. Here are some of their stories.
          </p>
          <Button
            render={<Link href="/signup" />}
            size="lg"
            className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8"
          >
            Start Your Success Story
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Stories Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUCCESS_STORIES.map((story) => (
            <Card
              key={story.name}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-full ${story.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                  >
                    {story.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{story.name}</div>
                    <div className="text-sm text-blue-600 font-medium">
                      {story.role}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {story.company}
                    </div>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: story.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative mb-4">
                  <Quote className="h-6 w-6 text-blue-200 absolute -top-1 -left-1" />
                  <p className="text-sm text-muted-foreground pl-5 italic leading-relaxed">
                    {story.quote}
                  </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-green-600 font-semibold text-xs">
                      <DollarSign className="h-3 w-3" />
                      {story.salaryIncrease}
                    </div>
                    <div className="text-xs text-muted-foreground">Salary</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-600 font-semibold text-xs">
                      <Clock className="h-3 w-3" />
                      {story.timeToHire}
                    </div>
                    <div className="text-xs text-muted-foreground">To Hire</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-purple-600 font-semibold text-xs">
                      <MapPin className="h-3 w-3" />
                      {story.location.split(",")[0]}
                    </div>
                    <div className="text-xs text-muted-foreground">Location</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {story.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs px-2 py-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-blue-200" />
          <h2 className="text-3xl font-bold mb-4">
            Your Success Story Starts Here
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join 12,000+ job seekers who found better jobs faster with HireFlow
            AI. Free to start, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              render={<Link href="/signup" />}
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8"
            >
              Get Started Free
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
  );
}
