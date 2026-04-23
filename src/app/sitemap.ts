import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hireflow.ai";

const jobCategories = [
  { category: "warehouse-jobs", location: "dallas-tx" },
  { category: "warehouse-jobs", location: "houston-tx" },
  { category: "warehouse-jobs", location: "austin-tx" },
  { category: "remote-software-jobs", location: "texas" },
  { category: "remote-software-jobs", location: "united-states" },
  { category: "remote-software-jobs", location: "california" },
  { category: "nurse-jobs", location: "near-me" },
  { category: "nurse-jobs", location: "dallas-tx" },
  { category: "nurse-jobs", location: "houston-tx" },
  { category: "nurse-jobs", location: "new-york-ny" },
  { category: "software-engineer-jobs", location: "san-francisco-ca" },
  { category: "software-engineer-jobs", location: "austin-tx" },
  { category: "marketing-jobs", location: "new-york-ny" },
  { category: "sales-jobs", location: "chicago-il" },
  { category: "data-analyst-jobs", location: "remote" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/success-stories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];

  const jobPages: MetadataRoute.Sitemap = jobCategories.map(
    ({ category, location }) => ({
      url: `${BASE_URL}/jobs/${category}/${location}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })
  );

  return [...staticPages, ...jobPages];
}
