"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { completeOnboarding } from "@/lib/onboarding-actions";
import type { OnboardingData, OnboardingGoal } from "@/lib/types";
import {
  Zap,
  Rocket,
  TrendingUp,
  MapPin,
  DollarSign,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const TOTAL_STEPS = 4;

const JOB_CATEGORIES = [
  "Software Engineering",
  "Product Management",
  "Design / UX",
  "Data Science / Analytics",
  "Marketing",
  "Sales",
  "Operations",
  "Finance / Accounting",
  "Human Resources",
  "Customer Support",
  "Healthcare",
  "Education",
  "Legal",
  "Other",
];

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [goal, setGoal] = useState<OnboardingGoal | "">("");
  const [location, setLocation] = useState("");
  const [remotePreference, setRemotePreference] = useState<
    "remote" | "hybrid" | "onsite" | "any"
  >("any");
  const [payMin, setPayMin] = useState("");
  const [payMax, setPayMax] = useState("");
  const [payType, setPayType] = useState<"salary" | "hourly">("salary");
  const [jobCategory, setJobCategory] = useState("");

  const progress = (step / TOTAL_STEPS) * 100;

  function canProceed(): boolean {
    switch (step) {
      case 1:
        return goal !== "";
      case 2:
        return location.trim() !== "";
      case 3:
        return payMin !== "" && payMax !== "";
      case 4:
        return jobCategory !== "";
      default:
        return false;
    }
  }

  async function handleComplete() {
    if (!goal) return;

    setLoading(true);

    const data: OnboardingData = {
      goal: goal as OnboardingGoal,
      location,
      desired_pay_min: parseInt(payMin) || 0,
      desired_pay_max: parseInt(payMax) || 0,
      pay_type: payType,
      job_category: jobCategory,
      remote_preference: remotePreference,
    };

    const result = await completeOnboarding(data);

    if (result?.error) {
      console.error(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="w-full max-w-lg space-y-6">
        {/* Logo & Progress */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="w-full max-w-xs">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>
                Step {step} of {TOTAL_STEPS}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Step 1: Goal */}
        {step === 1 && (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                What&apos;s your primary goal?
              </CardTitle>
              <CardDescription>
                This helps us tailor your experience and job recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={goal}
                onValueChange={(v) => setGoal(v as OnboardingGoal)}
                className="space-y-3"
              >
                <label
                  htmlFor="need_work_fast"
                  className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-all ${
                    goal === "need_work_fast"
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/30"
                  }`}
                >
                  <RadioGroupItem
                    value="need_work_fast"
                    id="need_work_fast"
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Need Work Fast</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      I need to find a job quickly. Prioritize speed and
                      available positions.
                    </p>
                  </div>
                </label>

                <label
                  htmlFor="grow_career"
                  className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-all ${
                    goal === "grow_career"
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/30"
                  }`}
                >
                  <RadioGroupItem
                    value="grow_career"
                    id="grow_career"
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Grow My Career</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      I want to find the right role for long-term career growth
                      and development.
                    </p>
                  </div>
                </label>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">
                Where are you looking for work?
              </CardTitle>
              <CardDescription>
                Enter your preferred work location.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., San Francisco, CA or Remote"
                />
              </div>

              <div className="space-y-2">
                <Label>Work Preference</Label>
                <RadioGroup
                  value={remotePreference}
                  onValueChange={(v) =>
                    setRemotePreference(
                      v as "remote" | "hybrid" | "onsite" | "any"
                    )
                  }
                  className="grid grid-cols-2 gap-2"
                >
                  {[
                    { value: "remote", label: "Remote" },
                    { value: "hybrid", label: "Hybrid" },
                    { value: "onsite", label: "On-site" },
                    { value: "any", label: "Any" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      htmlFor={`remote-${option.value}`}
                      className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition-all text-sm ${
                        remotePreference === option.value
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/30"
                      }`}
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`remote-${option.value}`}
                      />
                      {option.label}
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Pay */}
        {step === 3 && (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">
                What&apos;s your desired pay?
              </CardTitle>
              <CardDescription>
                Set your expected compensation range.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Pay Type</Label>
                <RadioGroup
                  value={payType}
                  onValueChange={(v) =>
                    setPayType(v as "salary" | "hourly")
                  }
                  className="grid grid-cols-2 gap-2"
                >
                  <label
                    htmlFor="pay-salary"
                    className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition-all text-sm ${
                      payType === "salary"
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/30"
                    }`}
                  >
                    <RadioGroupItem value="salary" id="pay-salary" />
                    Annual Salary
                  </label>
                  <label
                    htmlFor="pay-hourly"
                    className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition-all text-sm ${
                      payType === "hourly"
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/30"
                    }`}
                  >
                    <RadioGroupItem value="hourly" id="pay-hourly" />
                    Hourly Rate
                  </label>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payMin">
                    Minimum {payType === "salary" ? "($/year)" : "($/hour)"}
                  </Label>
                  <Input
                    id="payMin"
                    type="number"
                    value={payMin}
                    onChange={(e) => setPayMin(e.target.value)}
                    placeholder={payType === "salary" ? "60000" : "25"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payMax">
                    Maximum {payType === "salary" ? "($/year)" : "($/hour)"}
                  </Label>
                  <Input
                    id="payMax"
                    type="number"
                    value={payMax}
                    onChange={(e) => setPayMax(e.target.value)}
                    placeholder={payType === "salary" ? "120000" : "75"}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Job Category */}
        {step === 4 && (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">
                What type of work are you looking for?
              </CardTitle>
              <CardDescription>
                Select the job category that best fits your skills.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Job Category</Label>
                <Select
                  value={jobCategory}
                  onValueChange={(v) => setJobCategory(v ?? "")}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {jobCategory && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <p className="text-sm">
                    Great choice! We&apos;ll prioritize{" "}
                    <strong>{jobCategory}</strong> roles for you.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {step < TOTAL_STEPS ? (
            <Button
              onClick={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))}
              disabled={!canProceed()}
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!canProceed() || loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              )}
              Complete Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
