import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ResumeEditorClient from "./resume-editor-client";

export default async function ResumeEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: resume } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!resume) redirect("/dashboard/resume");

  const { data: versions } = await supabase
    .from("resume_versions")
    .select("*")
    .eq("resume_id", id)
    .eq("user_id", user.id)
    .order("version_number", { ascending: false });

  return (
    <ResumeEditorClient
      initialResume={resume}
      initialVersions={versions || []}
    />
  );
}
