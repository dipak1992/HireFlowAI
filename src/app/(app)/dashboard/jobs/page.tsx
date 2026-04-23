"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Target,
  Filter,
  X,
  Zap,
  Globe,
  Building2,
  Loader2,
  Database,
  RefreshCw,
  Info,
} from "lucide-react";
import type { Job, JobFilters, JobType, ExperienceLevel } from "@/lib/job-types";
import { JOB_TYPE_LABELS, EXPERIENCE_LABELS } from "@/lib/job-types";
import {
  getJobs,
  getRecommendedJobs,
  getRemoteJobs,
  getUrgentJobs,
  getNearbyJobs,
  saveJob,
  unsaveJob,
  getSavedJobIds,
} from "@/lib/job-actions";
import SavedJobsView from "@/components/jobs/saved-jobs-view";

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState("recommended");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Filters
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState<JobType | "">("");
  const [experienceFilter, setExperienceFilter] = useState<ExperienceLevel | "">("");
  const [salaryMin, setSalaryMin] = useState<number | "">("");
  const [salaryMax, setSalaryMax] = useState<number | "">("");

  const loadJobs = useCallback(async (tab: string) => {
    setLoading(true);
    let data: Job[] = [];

    switch (tab) {
      case "recommended":
        data = (await getRecommendedJobs()) as Job[];
        break;
      case "nearby":
        data = (await getNearbyJobs()) as Job[];
        break;
      case "remote":
        data = (await getRemoteJobs()) as Job[];
        break;
      case "urgent":
        data = (await getUrgentJobs()) as Job[];
        break;
      default:
        data = (await getJobs()) as Job[];
    }

    setJobs(data);
    setLastRefreshed(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadJobs(activeTab);
    loadSavedIds();
  }, [activeTab, loadJobs]);

  async function loadSavedIds() {
    const ids = await getSavedJobIds();
    setSavedJobIds(ids);
  }

  async function handleToggleSave(jobId: string) {
    const isSaved = savedJobIds.includes(jobId);
    if (isSaved) {
      await unsaveJob(jobId);
      setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
    } else {
      await saveJob(jobId);
      setSavedJobIds((prev) => [...prev, jobId]);
    }
  }

  // Apply client-side filters
  const filteredJobs = jobs.filter((job) => {
    if (search) {
      const s = search.toLowerCase();
      if (
        !job.title.toLowerCase().includes(s) &&
        !job.company.toLowerCase().includes(s) &&
        !job.description.toLowerCase().includes(s)
      ) return false;
    }
    if (locationFilter && !job.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    if (jobTypeFilter && job.job_type !== jobTypeFilter) return false;
    if (experienceFilter && job.experience_level !== experienceFilter) return false;
    if (salaryMin && job.salary_max < salaryMin) return false;
    if (salaryMax && job.salary_min > salaryMax) return false;
    return true;
  });

  function clearFilters() {
    setSearch("");
    setLocationFilter("");
    setJobTypeFilter("");
    setExperienceFilter("");
    setSalaryMin("");
    setSalaryMax("");
  }

  const hasActiveFilters = search || locationFilter || jobTypeFilter || experienceFilter || salaryMin || salaryMax;

  function formatSalary(min: number, max: number, currency: string, period: string) {
    if (!min && !max) return null;
    const fmt = (n: number) => {
      if (period === "yearly" && n >= 1000) return `${currency === "USD" ? "$" : currency}${(n / 1000).toFixed(0)}k`;
      return `${currency === "USD" ? "$" : currency}${n.toLocaleString()}`;
    };
    if (min && max) return `${fmt(min)} – ${fmt(max)}${period === "hourly" ? "/hr" : period === "monthly" ? "/mo" : "/yr"}`;
    if (min) return `${fmt(min)}+${period === "hourly" ? "/hr" : period === "monthly" ? "/mo" : "/yr"}`;
    return `Up to ${fmt(max)}${period === "hourly" ? "/hr" : period === "monthly" ? "/mo" : "/yr"}`;
  }

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  }

  function formatRefreshTime(date: Date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  if (showSaved) {
    return <SavedJobsView onBack={() => setShowSaved(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Job Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Discover jobs matched to your skills and experience.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowSaved(true)}>
            <Bookmark className="h-4 w-4 mr-1.5" />
            Saved Jobs
          </Button>
          <Button
            variant={showFilters ? "secondary" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-1.5" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                !
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Data source trust banner */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30 px-4 py-3">
        <Database className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
            Live jobs from our verified database
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5">
            Jobs are sourced directly from employer postings and updated regularly. AI matching ranks results by your profile fit.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 shrink-0">
          <RefreshCw className="h-3 w-3" />
          <span>Updated {formatRefreshTime(lastRefreshed)}</span>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search jobs by title, company, or keywords..."
          className="pl-9"
        />
      </div>

      {/* Filters panel */}
      {showFilters && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-1.5">
                <Label className="text-xs">Location</Label>
                <Input
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="City, State"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Job Type</Label>
                <select
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value as JobType | "")}
                  className="w-full h-8 rounded-lg border border-border bg-background px-2 text-sm"
                >
                  <option value="">All Types</option>
                  {Object.entries(JOB_TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Experience</Label>
                <select
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value as ExperienceLevel | "")}
                  className="w-full h-8 rounded-lg border border-border bg-background px-2 text-sm"
                >
                  <option value="">All Levels</option>
                  {Object.entries(EXPERIENCE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Min Salary</Label>
                <Input
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value ? Number(e.target.value) : "")}
                  placeholder="$0"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Max Salary</Label>
                <Input
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value ? Number(e.target.value) : "")}
                  placeholder="$500k"
                />
              </div>
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" className="mt-3" onClick={clearFilters}>
                <X className="h-3 w-3 mr-1" />
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="recommended" onValueChange={(v) => setActiveTab(v ?? "recommended")}>
        <TabsList variant="line" className="mb-4">
          <TabsTrigger value="recommended">
            <Zap className="h-3.5 w-3.5 mr-1.5" />
            Recommended
          </TabsTrigger>
          <TabsTrigger value="nearby">
            <MapPin className="h-3.5 w-3.5 mr-1.5" />
            Nearby
          </TabsTrigger>
          <TabsTrigger value="remote">
            <Globe className="h-3.5 w-3.5 mr-1.5" />
            Remote
          </TabsTrigger>
          <TabsTrigger value="urgent">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            Urgent Hiring
          </TabsTrigger>
        </TabsList>

        {/* Job listings (same content for all tabs, data changes) */}
        {["recommended", "nearby", "remote", "urgent"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            {loading ? (
              /* Skeleton loader */
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="pt-4">
                      <div className="flex gap-4">
                        <div className="hidden sm:block h-12 w-12 rounded-lg bg-muted animate-pulse shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-48 rounded bg-muted animate-pulse" />
                          <div className="h-3 w-32 rounded bg-muted animate-pulse" />
                          <div className="flex gap-2 mt-2">
                            <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                            <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                            <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                          </div>
                          <div className="h-3 w-full rounded bg-muted animate-pulse" />
                          <div className="h-3 w-3/4 rounded bg-muted animate-pulse" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              /* Honest empty state */
              <Card>
                <CardContent className="py-16">
                  <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                      <Briefcase className="h-8 w-8 text-muted-foreground/60" />
                    </div>
                    <h3 className="text-lg font-semibold">
                      {hasActiveFilters ? "No matching jobs" : "No jobs available yet"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {hasActiveFilters
                        ? "Try broadening your filters — fewer criteria usually returns more results."
                        : tab === "urgent"
                        ? "No urgent hiring postings right now. Check the Recommended tab for all available jobs."
                        : tab === "nearby"
                        ? "No local jobs found for your location. Make sure your profile location is up to date, or browse Remote jobs."
                        : tab === "remote"
                        ? "No remote jobs in the database right now. New jobs are added regularly — check back soon."
                        : "We're actively adding new jobs to the platform. Check back soon, or complete your profile so we can match you better."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 mt-5">
                      {hasActiveFilters && (
                        <Button variant="outline" size="sm" onClick={clearFilters}>
                          <X className="h-3.5 w-3.5 mr-1.5" />
                          Clear Filters
                        </Button>
                      )}
                      <Link href="/dashboard/profile">
                        <Button variant="outline" size="sm">
                          Update Profile
                        </Button>
                      </Link>
                    </div>
                    <div className="mt-6 flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2.5 text-left">
                      <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        HireFlow AI pulls jobs directly from our database. A complete profile improves your AI match score significantly.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {/* Results count + data freshness */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{filteredJobs.length}</span>{" "}
                    job{filteredJobs.length !== 1 ? "s" : ""} found
                    {hasActiveFilters && " (filtered)"}
                  </p>
                  <button
                    onClick={() => loadJobs(activeTab)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Refresh
                  </button>
                </div>

                {filteredJobs.map((job) => {
                  const isSaved = savedJobIds.includes(job.id);
                  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period);
                  const isNew = (Date.now() - new Date(job.posted_at).getTime()) < 1000 * 60 * 60 * 24 * 2; // < 2 days

                  return (
                    <Card key={job.id} className="transition-all hover:shadow-md hover:border-primary/20">
                      <CardContent className="pt-4">
                        <div className="flex gap-4">
                          {/* Company logo placeholder */}
                          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <Building2 className="h-6 w-6" />
                          </div>

                          {/* Job info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-sm leading-tight">
                                  {job.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                  {job.company}
                                </p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                                {isNew && (
                                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-[10px]">
                                    New
                                  </Badge>
                                )}
                                {job.is_urgent && (
                                  <Badge className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 text-[10px]">
                                    Urgent
                                  </Badge>
                                )}
                                {job.is_remote && (
                                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 text-[10px]">
                                    Remote
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Meta info */}
                            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
                              {job.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {job.location}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                {JOB_TYPE_LABELS[job.job_type]}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {EXPERIENCE_LABELS[job.experience_level]}
                              </span>
                              {salary && (
                                <span className="flex items-center gap-1 font-medium text-foreground">
                                  <DollarSign className="h-3 w-3" />
                                  {salary}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {timeAgo(job.posted_at)}
                              </span>
                            </div>

                            {/* Tags */}
                            {job.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {job.tags.slice(0, 6).map((tag, i) => (
                                  <Badge key={i} variant="secondary" className="text-[10px]">
                                    {tag}
                                  </Badge>
                                ))}
                                {job.tags.length > 6 && (
                                  <Badge variant="secondary" className="text-[10px]">
                                    +{job.tags.length - 6}
                                  </Badge>
                                )}
                              </div>
                            )}

                            {/* Description preview */}
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                              {job.description}
                            </p>

                            {/* Actions */}
                            <div className="flex items-center gap-2 mt-3 flex-wrap">
                              <Button
                                variant={isSaved ? "secondary" : "outline"}
                                size="sm"
                                onClick={() => handleToggleSave(job.id)}
                              >
                                {isSaved ? (
                                  <BookmarkCheck className="h-3.5 w-3.5 mr-1" />
                                ) : (
                                  <Bookmark className="h-3.5 w-3.5 mr-1" />
                                )}
                                {isSaved ? "Saved" : "Save"}
                              </Button>

                              {job.apply_url && (
                                <a
                                  href={job.apply_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button variant="outline" size="sm">
                                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                    Apply
                                  </Button>
                                </a>
                              )}

                              <Link href={`/dashboard/tailoring?job=${encodeURIComponent(job.description.slice(0, 2000))}&title=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}`}>
                                <Button variant="outline" size="sm">
                                  <Target className="h-3.5 w-3.5 mr-1" />
                                  Tailor Resume
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
