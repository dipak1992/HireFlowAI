import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — HireFlow AI",
  description: "How HireFlow AI collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  const lastUpdated = "April 1, 2024";
  return (
    <div className="min-h-screen">
      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>

          <div className="prose prose-sm max-w-none space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
              <p>HireFlow AI, Inc. (&quot;HireFlow AI,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform at hireflow.ai.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
              <p className="mb-3">We collect information you provide directly to us, including:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Account information (name, email address)</li>
                <li>Profile information (work history, education, skills)</li>
                <li>Resume content you upload or create</li>
                <li>Job application data and preferences</li>
                <li>LinkedIn profile data (when you connect your account)</li>
                <li>Payment information (processed securely by Stripe)</li>
              </ul>
              <p className="mt-3">We also collect information automatically, including usage data, device information, and cookies.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>To provide, maintain, and improve our services</li>
                <li>To match you with relevant job opportunities</li>
                <li>To generate and tailor your resume content</li>
                <li>To process payments and manage subscriptions</li>
                <li>To send you service-related communications</li>
                <li>To analyze usage patterns and improve our AI models</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Sharing</h2>
              <p>We do not sell your personal data. We may share your information with:</p>
              <ul className="list-disc pl-5 space-y-1 mt-3">
                <li>Service providers (Supabase for database, Stripe for payments, OpenAI for AI features)</li>
                <li>Analytics providers (PostHog for usage analytics)</li>
                <li>Error monitoring services (Sentry)</li>
                <li>Law enforcement when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Security</h2>
              <p>We implement industry-standard security measures including encryption at rest and in transit, row-level security on our database, and regular security audits. However, no method of transmission over the internet is 100% secure.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal data. You can export your data or close your account at any time from your account settings. For requests, contact us at privacy@hireflow.ai.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Cookies</h2>
              <p>We use essential cookies for authentication and optional analytics cookies. See our Cookie Policy for details.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Children&apos;s Privacy</h2>
              <p>Our services are not directed to children under 16. We do not knowingly collect personal information from children under 16.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Contact Us</h2>
              <p>For privacy-related questions, contact us at privacy@hireflow.ai or write to HireFlow AI, Inc., Austin, TX 78701.</p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
