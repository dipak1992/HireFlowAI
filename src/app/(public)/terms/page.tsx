import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use — HireFlow AI",
  description: "Terms and conditions for using HireFlow AI.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-3">Terms of Use</h1>
            <p className="text-sm text-muted-foreground">Last updated: April 1, 2024</p>
          </div>
          <div className="space-y-8 text-muted-foreground text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using HireFlow AI (&quot;Service&quot;), you agree to be bound by these Terms of Use. If you do not agree, do not use the Service.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
              <p>HireFlow AI provides an AI-powered job matching, resume building, and application tracking platform. We offer free and paid subscription tiers with varying feature access.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. User Accounts</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information and keep it updated. You may not share your account with others.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Acceptable Use</h2>
              <p className="mb-2">You agree not to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Use the Service for any unlawful purpose</li>
                <li>Attempt to reverse engineer or scrape our platform</li>
                <li>Upload false, misleading, or fraudulent resume information</li>
                <li>Impersonate another person or entity</li>
                <li>Interfere with the proper functioning of the Service</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. AI-Generated Content</h2>
              <p>Our AI tools assist in creating and tailoring resume content. You are solely responsible for reviewing and verifying all AI-generated content before submitting applications. HireFlow AI does not guarantee the accuracy or effectiveness of AI-generated content.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Subscriptions and Payments</h2>
              <p>Paid subscriptions are billed monthly. You may cancel at any time. Refunds are provided at our discretion. Prices may change with 30 days notice.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Intellectual Property</h2>
              <p>HireFlow AI and its content are owned by HireFlow AI, Inc. You retain ownership of content you create using our tools. You grant us a license to use your content to provide and improve the Service.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Disclaimer of Warranties</h2>
              <p>The Service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that the Service will be uninterrupted, error-free, or that it will result in job placement.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, HireFlow AI shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">10. Governing Law</h2>
              <p>These Terms are governed by the laws of the State of Texas, without regard to conflict of law principles.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">11. Contact</h2>
              <p>For questions about these Terms, contact us at legal@hireflow.ai.</p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
