import { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us — HireFlow AI",
  description: "Get in touch with the HireFlow AI team. We're here to help.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <section className="section-padding">
        <div className="container-tight">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Have a question, feedback, or need help? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: <Mail className="h-5 w-5" />,
                title: "Email Support",
                desc: "Our team typically responds within 24 hours.",
                action: "support@hireflow.ai",
                href: "mailto:support@hireflow.ai",
              },
              {
                icon: <MessageSquare className="h-5 w-5" />,
                title: "Live Chat",
                desc: "Chat with us directly from your dashboard.",
                action: "Open Dashboard",
                href: "/dashboard",
              },
              {
                icon: <MapPin className="h-5 w-5" />,
                title: "Headquarters",
                desc: "HireFlow AI, Inc.",
                action: "Austin, TX 78701",
                href: "#",
              },
            ].map((item) => (
              <div key={item.title} className="premium-card p-6 text-center">
                <div className="flex justify-center mb-3 text-primary">{item.icon}</div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
                <Link href={item.href} className="text-sm text-primary hover:underline font-medium">
                  {item.action}
                </Link>
              </div>
            ))}
          </div>

          <div className="max-w-xl mx-auto premium-card p-8">
            <h2 className="text-xl font-semibold mb-6">Send us a message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">First name</label>
                  <input
                    type="text"
                    className="w-full h-9 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Last name</label>
                  <input
                    type="text"
                    className="w-full h-9 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full h-9 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Subject</label>
                <input
                  type="text"
                  className="w-full h-9 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="How can we help?"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Tell us more..."
                />
              </div>
              <button
                type="submit"
                className="w-full h-10 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
