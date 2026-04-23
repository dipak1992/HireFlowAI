"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LinkedInIcon } from "@/components/icons";
import {
  acceptLinkedInConsent,
  skipLinkedInConsent,
  uploadResumeInstead,
} from "@/lib/linkedin-actions";
import {
  Zap,
  FileText,
  Target,
  Rocket,
  Upload,
  SkipForward,
  CheckCircle2,
} from "lucide-react";

export default function LinkedInConsentClient({
  userName,
}: {
  userName: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="w-full max-w-lg space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Zap className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold mt-2">
            Welcome, {userName}! 🎉
          </h1>
          <p className="text-muted-foreground text-sm text-center">
            You signed in with LinkedIn. We can use your profile to supercharge
            your experience.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0A66C2]/10">
                <LinkedInIcon className="h-7 w-7 text-[#0A66C2]" />
              </div>
            </div>
            <CardTitle className="text-xl">Import LinkedIn Profile?</CardTitle>
            <CardDescription className="text-base">
              We can use your LinkedIn profile to:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Benefits */}
            <div className="space-y-4">
              <BenefitItem
                icon={<FileText className="h-5 w-5" />}
                number={1}
                title="Build your resume"
                description="Auto-generate a professional resume from your experience"
              />
              <BenefitItem
                icon={<Target className="h-5 w-5" />}
                number={2}
                title="Improve job matches"
                description="Get more accurate job recommendations based on your skills"
              />
              <BenefitItem
                icon={<Rocket className="h-5 w-5" />}
                number={3}
                title="Speed up onboarding"
                description="Skip manual data entry and get started faster"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <form action={acceptLinkedInConsent}>
                <Button type="submit" className="w-full h-11 text-base">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Import My Profile
                </Button>
              </form>

              <form action={skipLinkedInConsent}>
                <Button
                  type="submit"
                  variant="ghost"
                  className="w-full h-11"
                >
                  <SkipForward className="h-4 w-4 mr-2" />
                  Skip
                </Button>
              </form>

              <form action={uploadResumeInstead}>
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full h-11"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Resume Instead
                </Button>
              </form>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Your data is encrypted and stored securely. We never share your
              information without your consent.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BenefitItem({
  icon,
  number,
  title,
  description,
}: {
  icon: React.ReactNode;
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 p-3 rounded-xl bg-muted/50">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="font-medium text-sm">
          <span className="text-primary mr-1">{number}.</span>
          {title}
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}
