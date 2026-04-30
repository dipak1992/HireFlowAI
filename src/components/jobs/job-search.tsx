// src/components/jobs/job-search.tsx
"use client";

import { useState, useTransition, useCallback, useEffect } from "react";
import { Search, MapPin, Filter, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobCard } from "@/components/jobs/job-card";
import { searchJobsAction, getSavedJobIdsAction } from "@/lib/job-actions";
import type { NormalizedJob, JobSearchFilters } from "@/lib/jsearch-types";
import {
  DEFAULT_FILTERS,
  JOB_TYPE_LABELS,
  DATE_POSTED_LABELS,
  EXPERIENCE_LABELS,
} from "@/lib/jsearch-types";

export function JobSearch() {
  const [filters, setFilters] = useState<JobSearchFilters>({
    ...DEFAULT_FILTERS,
  });
  const [jobs, setJobs] = useState<NormalizedJob[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [totalFound, setTotalFound] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getSavedJobIdsAction().then(setSavedJobIds);
  }, []);

  const handleSearch = useCallback(
    (overrideFilters?: Partial<JobSearchFilters>) => {
      const searchFilters = { ...filters, ...overrideFilters, page: 1 };
      setFilters(searchFilters);
      setHasSearched(true);

      startTransition(async () => {
        const result = await searchJobsAction(searchFilters);
        setJobs(result.jobs);
        setTotalFound(result.totalFound);
        setError(result.error || null);
      });
    },
    [filters]
  );

  const handleLoadMore = useCallback(() => {
    const nextPage = filters.page + 1;
    const updatedFilters = { ...filters, page: nextPage };
    setFilters(updatedFilters);

    startTransition(async () => {
      const result = await searchJobsAction(updatedFilters);
      setJobs((prev) => [...prev, ...result.jobs]);
      setTotalFound(result.totalFound);
      setError(result.error || null);
    });
  }, [filters]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleJobType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      jobType: prev.jobType.includes(type)
        ? prev.jobType.filter((t) => t !== type)
        : [...prev.jobType, type],
    }));
  };

  const clearFilters = () => {
    setFilters({
      ...DEFAULT_FILTERS,
      query: filters.query,
      location: filters.location,
    });
  };

  const activeFilterCount =
    (filters.datePosted !== "all" ? 1 : 0) +
    (filters.remoteOnly ? 1 : 0) +
    filters.jobType.length +
    (filters.experienceLevel ? 1 : 0) +
    (filters.salaryMin ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Job title, keywords, or company"
              value={filters.query}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, query: e.target.value }))
              }
              onKeyDown={handleKeyDown}
              className="pl-10"
            />
          </div>
          <div className="relative flex-1 sm:max-w-[220px]">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="City, state, or Remote"
              value={filters.location}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, location: e.target.value }))
              }
              onKeyDown={handleKeyDown}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => handleSearch()}
            disabled={isPending}
            className="sm:w-auto w-full"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Search Jobs
          </Button>
        </div>

        {/* Filter Toggle Row */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <Filter className="h-3 w-3" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-0.5 bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                {activeFilterCount}
              </span>
            )}
          </button>

          {filters.remoteOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-200 dark:border-blue-800">
              Remote only
              <button
                onClick={() => {
                  setFilters((prev) => ({ ...prev, remoteOnly: false }));
                  handleSearch({ remoteOnly: false });
                }}
                className="ml-0.5 hover:text-blue-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.jobType.map((type) => (
            <span
              key={type}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium"
            >
              {JOB_TYPE_LABELS[type] || type}
              <button onClick={() => toggleJobType(type)}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            {/* Date Posted */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Date Posted
              </label>
              <select
                value={filters.datePosted}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    datePosted: e.target.value as JobSearchFilters["datePosted"],
                  }))
                }
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
              >
                {Object.entries(DATE_POSTED_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Type */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Job Type
              </label>
              <div className="flex flex-wrap gap-1">
                {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => toggleJobType(value)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      filters.jobType.includes(value)
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Experience Level
              </label>
              <select
                value={filters.experienceLevel}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    experienceLevel: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
              >
                {Object.entries(EXPERIENCE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Remote Toggle */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Remote
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    remoteOnly: !prev.remoteOnly,
                  }))
                }
                className="w-full"
              >
                {filters.remoteOnly ? "✓ Remote Only" : "Include All"}
              </Button>
            </div>

            {/* Apply Filters Button */}
            <div className="col-span-2 sm:col-span-4 flex justify-end">
              <Button onClick={() => handleSearch()} size="sm">
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Results Header */}
      {hasSearched && !isPending && !error && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {totalFound > 0 ? (
              <>
                Showing{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {jobs.length}
                </span>{" "}
                jobs
                {filters.query && (
                  <> for &ldquo;{filters.query}&rdquo;</>
                )}
                {filters.location && <> in {filters.location}</>}
              </>
            ) : (
              <>
                No jobs found
                {filters.query && <> for &ldquo;{filters.query}&rdquo;</>}
                {filters.location && <> in {filters.location}</>}. Try
                broadening your search.
              </>
            )}
          </p>

          {/* Sort */}
          <select
            value={filters.sortBy}
            onChange={(e) => {
              const sortBy = e.target.value as JobSearchFilters["sortBy"];
              handleSearch({ sortBy });
            }}
            className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs"
          >
            <option value="relevance">Sort by: Relevance</option>
            <option value="date">Sort by: Most Recent</option>
            <option value="salary">Sort by: Highest Salary</option>
          </select>
        </div>
      )}

      {/* Job Cards — Loading Skeletons */}
      {isPending ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 animate-pulse"
            >
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-3/4" />
                  <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-1/2" />
                  <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={savedJobIds.includes(job.id)}
              onSavedChange={(saved) => {
                if (saved) {
                  setSavedJobIds((prev) => [...prev, job.id]);
                } else {
                  setSavedJobIds((prev) => prev.filter((id) => id !== job.id));
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {jobs.length > 0 && jobs.length >= 10 && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" onClick={handleLoadMore} disabled={isPending}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Load More Jobs
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!hasSearched && (
        <div className="text-center py-16 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto">
            <Search className="h-8 w-8 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Search for jobs
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
              Enter a job title and location to find real job listings from
              Indeed, LinkedIn, Glassdoor, ZipRecruiter, and more.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { query: "Software Engineer", location: "San Francisco, CA" },
              { query: "Warehouse Associate", location: "Dallas, TX" },
              { query: "Registered Nurse", location: "New York, NY" },
              { query: "Data Analyst", location: "Remote" },
            ].map((suggestion) => (
              <button
                key={suggestion.query}
                onClick={() => {
                  setFilters((prev) => ({
                    ...prev,
                    query: suggestion.query,
                    location: suggestion.location,
                  }));
                  handleSearch({
                    query: suggestion.query,
                    location: suggestion.location,
                  });
                }}
                className="px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                {suggestion.query} · {suggestion.location}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
