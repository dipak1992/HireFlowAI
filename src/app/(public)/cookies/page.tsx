import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy — HireFlow AI",
  description: "Learn how HireFlow AI uses cookies and similar tracking technologies.",
};

export default function CookiesPage() {
  const lastUpdated = "April 1, 2024";

  const cookieTypes = [
    {
      name: "Strictly Necessary Cookies",
      required: true,
      description:
        "These cookies are essential for the website to function and cannot be switched off. They are usually set in response to actions you take such as logging in or filling out forms.",
      examples: [
        { name: "sb-access-token", purpose: "Supabase authentication session token", duration: "Session" },
        { name: "sb-refresh-token", purpose: "Supabase authentication refresh token", duration: "30 days" },
        { name: "__session", purpose: "User session management", duration: "Session" },
      ],
    },
    {
      name: "Analytics Cookies",
      required: false,
      description:
        "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. All information these cookies collect is aggregated and therefore anonymous.",
      examples: [
        { name: "ph_*", purpose: "PostHog analytics — tracks feature usage and user flows", duration: "1 year" },
        { name: "_ga", purpose: "Google Analytics — distinguishes unique users", duration: "2 years" },
        { name: "_gid", purpose: "Google Analytics — stores and updates a unique value for each page visited", duration: "24 hours" },
      ],
    },
    {
      name: "Functional Cookies",
      required: false,
      description:
        "These cookies enable the website to provide enhanced functionality and personalisation. They may be set by us or by third-party providers whose services we have added to our pages.",
      examples: [
        { name: "hireflow_theme", purpose: "Stores your preferred color theme (light/dark)", duration: "1 year" },
        { name: "hireflow_locale", purpose: "Stores your preferred language/locale setting", duration: "1 year" },
      ],
    },
    {
      name: "Performance Cookies",
      required: false,
      description:
        "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously, helping us improve our platform.",
      examples: [
        { name: "sentry-sc", purpose: "Sentry error monitoring — session context for error tracking", duration: "Session" },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-3">Cookie Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>

          <div className="space-y-10 text-muted-foreground">
            {/* Intro */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your device when you visit a website. They are widely
                used to make websites work, or work more efficiently, as well as to provide information to the owners of
                the site. HireFlow AI uses cookies and similar technologies to enhance your experience, analyze usage,
                and support our services.
              </p>
            </section>

            {/* How we use */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">How We Use Cookies</h2>
              <p className="mb-4">We use cookies for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-foreground">Authentication:</strong> To keep you logged in securely across
                  sessions.
                </li>
                <li>
                  <strong className="text-foreground">Preferences:</strong> To remember your settings such as theme and
                  language.
                </li>
                <li>
                  <strong className="text-foreground">Analytics:</strong> To understand how users interact with our
                  platform so we can improve it.
                </li>
                <li>
                  <strong className="text-foreground">Error monitoring:</strong> To detect and fix bugs and performance
                  issues quickly.
                </li>
              </ul>
            </section>

            {/* Cookie types */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-6">Types of Cookies We Use</h2>
              <div className="space-y-8">
                {cookieTypes.map((type) => (
                  <div key={type.name} className="premium-card p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-base font-semibold text-foreground">{type.name}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                          type.required
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {type.required ? "Always Active" : "Optional"}
                      </span>
                    </div>
                    <p className="text-sm mb-4">{type.description}</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 pr-4 font-medium text-foreground">Cookie Name</th>
                            <th className="text-left py-2 pr-4 font-medium text-foreground">Purpose</th>
                            <th className="text-left py-2 font-medium text-foreground">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {type.examples.map((cookie) => (
                            <tr key={cookie.name} className="border-b border-border/50 last:border-0">
                              <td className="py-2 pr-4 font-mono text-xs text-foreground">{cookie.name}</td>
                              <td className="py-2 pr-4">{cookie.purpose}</td>
                              <td className="py-2 whitespace-nowrap">{cookie.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Third-party */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Third-Party Cookies</h2>
              <p className="mb-3">
                Some cookies are placed by third-party services that appear on our pages. We use the following
                third-party services that may set cookies:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-foreground">Supabase</strong> — Database and authentication provider.{" "}
                  <a
                    href="https://supabase.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <strong className="text-foreground">PostHog</strong> — Product analytics.{" "}
                  <a
                    href="https://posthog.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <strong className="text-foreground">Sentry</strong> — Error monitoring.{" "}
                  <a
                    href="https://sentry.io/privacy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <strong className="text-foreground">Stripe</strong> — Payment processing.{" "}
                  <a
                    href="https://stripe.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </section>

            {/* Managing cookies */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Managing Your Cookie Preferences</h2>
              <p className="mb-3">
                You can control and manage cookies in several ways. Please note that removing or blocking cookies may
                impact your user experience and parts of our website may no longer be fully accessible.
              </p>
              <h3 className="text-base font-semibold text-foreground mb-2">Browser Settings</h3>
              <p className="mb-3">
                Most browsers allow you to view, manage, delete, and block cookies for a website. Be aware that if you
                delete all cookies, any preferences you have set will be lost, including the ability to opt-out from
                cookies as this function itself requires placement of an opt-out cookie.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground"
                  >
                    Apple Safari
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground"
                  >
                    Microsoft Edge
                  </a>
                </li>
              </ul>
            </section>

            {/* Updates */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our
                business practices. We will notify you of any significant changes by posting the new policy on this page
                with an updated &quot;Last updated&quot; date.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Contact Us</h2>
              <p>
                If you have questions about our use of cookies, please contact us at{" "}
                <a href="mailto:privacy@hireflow.ai" className="underline hover:text-foreground">
                  privacy@hireflow.ai
                </a>{" "}
                or visit our{" "}
                <Link href="/contact" className="underline hover:text-foreground">
                  Contact page
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
