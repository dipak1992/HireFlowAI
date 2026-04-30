"use client";

import { useState, useRef, useTransition } from "react";
import { Upload, FileText, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadAndParseResumeAction } from "@/lib/resume-upload-actions";
import { useRouter } from "next/navigation";

interface ResumeUploadDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ResumeUploadDialog({ open, onClose }: ResumeUploadDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    resumeId?: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleFile = (file: File) => {
    setSelectedFile(file);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const res = await uploadAndParseResumeAction(formData);
      if (res.success) {
        setResult({
          success: true,
          message: "Resume parsed successfully! Redirecting to editor…",
          resumeId: res.resumeId,
        });
        setTimeout(() => {
          router.push(`/dashboard/resume/${res.resumeId}`);
          onClose();
        }, 1500);
      } else {
        setResult({ success: false, message: res.error ?? "Upload failed." });
      }
    });
  };

  const handleClose = () => {
    if (isPending) return;
    setSelectedFile(null);
    setResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border bg-card shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Upload Resume</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              We&apos;ll parse it with AI and pre-fill your resume editor.
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isPending}
            className="rounded-lg p-1.5 hover:bg-muted transition-colors text-muted-foreground disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drop zone */}
        {!result && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all ${
              dragOver
                ? "border-primary bg-primary/5"
                : selectedFile
                ? "border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
                : "border-border hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            {selectedFile ? (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 truncate max-w-[200px]">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Choose different file
                </button>
              </>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">
                    Drop your resume here
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    PDF, JPG, PNG, or WEBP · Max 10 MB
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Result state */}
        {result && (
          <div
            className={`flex items-start gap-3 rounded-xl p-4 ${
              result.success
                ? "bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800"
                : "bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800"
            }`}
          >
            {result.success ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <p
              className={`text-sm font-medium ${
                result.success ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"
              }`}
            >
              {result.message}
            </p>
          </div>
        )}

        {/* Actions */}
        {!result && (
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isPending}
              className="flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Parsing…
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload & Parse
                </>
              )}
            </button>
          </div>
        )}

        {result && !result.success && (
          <button
            onClick={() => setResult(null)}
            className="w-full rounded-xl border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
