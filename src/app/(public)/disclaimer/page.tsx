import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer — HireFlow AI",
  description: "Important disclaimers regarding HireFlow AI's services, AI-generated content, and job search outcomes.",
};

export default function DisclaimerPage() {
  const lastUpdated = "April 1, 2024";

  return (
    <div className="min-h-screen">
      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-3">Disclaimer</h1>
            <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>

          <div className="space-y-10 text-muted-foreground">
            {/* General */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. General Disclaimer</h2>
              <p>
                The information provided by HireFlow AI, Inc. (&quot;HireFlow AI,&quot; &quot;we,&quot; &quot;us,&quot;
                or &quot;our&quot;) on{" "}
                <a href="https://hireflow.ai" className="underline hover:text-foreground">
                  hireflow.ai
                </a>{" "}
                and through our platform is for general informational and career assistance purposes only. All
                information on the site is provided in good faith; however, we make no representation or warranty of
                any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or
                completeness of any information on the site.
              </p>
            </section>

            {/* AI Content */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. AI-Generated Content Disclaimer</h2>
              <p className="mb-3">
                HireFlow AI uses artificial intelligence and machine learning technologies to generate resume content,
                cover letters, job match scores, and career recommendations. You acknowledge and agree that:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  AI-generated content may contain errors, inaccuracies, or outdated information and should always be
                  reviewed and edited by you before use.
                </li>
                <li>
                  Resume and cover letter suggestions are generated based on patterns in training data and may not
                  perfectly reflect your unique experience or the specific requirements of a job posting.
                </li>
                <li>
                  Job match scores and compatibility ratings are estimates based on algorithmic analysis and do not
                  guarantee interview invitations or job offers.
                </li>
                <li>
                  You are solely responsible for reviewing, editing, and approving all AI-generated content before
                  submitting it to employers.
                </li>
                <li>
                  HireFlow AI is not responsible for any consequences arising from the use of AI-generated content in
                  job applications.
                </li>
              </ul>
            </section>

            {/* No Employment Guarantee */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. No Employment Guarantee</h2>
              <p className="mb-3">
                HireFlow AI is a job search assistance platform. We do not guarantee employment, interviews, job
                offers, or any specific career outcomes. Our platform is designed to improve your chances of success,
                but results vary based on many factors outside our control, including:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Current job market conditions and employer demand</li>
                <li>Your qualifications, experience, and skills relative to job requirements</li>
                <li>Geographic location and industry-specific hiring trends</li>
                <li>Individual employer hiring decisions and processes</li>
                <li>Economic conditions and industry-specific factors</li>
              </ul>
              <p className="mt-3">
                Statistics cited on our platform (such as &quot;94% interview rate&quot; or &quot;average $31k salary
                increase&quot;) are based on self-reported data from a subset of our users and may not be representative
                of all users&apos; experiences.
              </p>
            </section>

            {/* Third-Party Links */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Third-Party Links and Job Listings</h2>
              <p className="mb-3">
                Our platform may contain links to third-party websites, job boards, and employer career pages. These
                links are provided for your convenience only. We have no control over the content of those sites and
                accept no responsibility for them or for any loss or damage that may arise from your use of them.
              </p>
              <p>
                Job listings displayed through HireFlow AI are sourced from third-party providers. We do not verify
                the accuracy, completeness, or legitimacy of individual job postings. Always exercise caution and
                conduct your own due diligence before applying to any position or sharing personal information with
                potential employers.
              </p>
            </section>

            {/* Professional Advice */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Not Professional Career Advice</h2>
              <p>
                The content provided by HireFlow AI does not constitute professional career counseling, legal advice,
                or financial advice. For specific career guidance, legal questions related to employment, or financial
                planning, we recommend consulting with qualified professionals in those respective fields.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Limitation of Liability</h2>
              <p className="mb-3">
                To the maximum extent permitted by applicable law, HireFlow AI shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Loss of employment opportunities or income</li>
                <li>Damage to professional reputation</li>
                <li>Reliance on AI-generated content that contains errors</li>
                <li>Unauthorized access to or use of our servers and/or any personal information stored therein</li>
                <li>Any interruption or cessation of transmission to or from our service</li>
              </ul>
            </section>

            {/* Accuracy */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Accuracy of Information</h2>
              <p>
                While we strive to keep the information on our platform current and accurate, the job market,
                employment laws, and industry standards change frequently. HireFlow AI makes no warranties about the
                completeness, reliability, or accuracy of this information. Any action you take upon the information
                you find on this platform is strictly at your own risk.
              </p>
            </section>

            {/* Changes */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Changes to This Disclaimer</h2>
              <p>
                We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon
                posting to the website. Your continued use of HireFlow AI after any changes constitutes your acceptance
                of the new disclaimer.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Contact Us</h2>
              <p>
                If you have questions about this disclaimer, please contact us at{" "}
                <a href="mailto:legal@hireflow.ai" className="underline hover:text-foreground">
                  legal@hireflow.ai
                </a>{" "}
                or visit our{" "}
                <Link href="/contact" className="underline hover:text-foreground">
                  Contact page
                </Link>
                .
              </p>
            </section>

            {/* Related policies */}
            <div className="premium-card p-6 mt-8">
              <p className="text-sm font-medium text-foreground mb-3">Related Policies</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <Link href="/terms" className="underline hover:text-foreground">
                  Terms of Use
                </Link>
                <span className="text-border">·</span>
                <Link href="/privacy" className="underline hover:text-foreground">
                  Privacy Policy
                </Link>
                <span className="text-border">·</span>
                <Link href="/cookies" className="underline hover:text-foreground">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
