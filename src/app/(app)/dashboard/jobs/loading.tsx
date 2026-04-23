import { JobListSkeleton } from "@/components/ui/skeletons";

export default function JobsLoading() {
  return (
    <div className="p-6">
      <JobListSkeleton />
    </div>
  );
}
