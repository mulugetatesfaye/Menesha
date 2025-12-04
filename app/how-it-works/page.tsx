import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  UserPlus,
  ClipboardCheck,
  Rocket,
  Heart,
  Trophy,
  ArrowRight,
} from "lucide-react";

export default function HowItWorksPage() {
  const creatorSteps = [
    {
      icon: UserPlus,
      title: "Apply to be a Creator",
      description:
        "Sign up and submit your creator application. Tell us about yourself and your project ideas.",
    },
    {
      icon: ClipboardCheck,
      title: "Get Approved",
      description:
        "Our team reviews your application. Once approved, you can start creating campaigns.",
    },
    {
      icon: Rocket,
      title: "Launch Your Campaign",
      description:
        "Create your campaign with a compelling story, set your funding goal, and submit for review.",
    },
    {
      icon: Trophy,
      title: "Reach Your Goal",
      description:
        "Share your campaign, engage with backers, and watch your project come to life.",
    },
  ];

  const backerSteps = [
    {
      icon: UserPlus,
      title: "Create an Account",
      description:
        "Sign up with your Google account to start supporting projects.",
    },
    {
      icon: Heart,
      title: "Discover Campaigns",
      description:
        "Browse through various categories and find projects that inspire you.",
    },
    {
      icon: Rocket,
      title: "Make a Pledge",
      description:
        "Support creators by making a pledge. Choose your amount and leave an optional message.",
    },
    {
      icon: Trophy,
      title: "Watch Projects Succeed",
      description:
        "Track the campaigns you&apos;ve supported and see them reach their goals.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">How Menesha Works</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you&apos;re a creator looking to fund your project or a
              backer wanting to support great ideas, we make it easy.
            </p>
          </div>

          {/* For Creators */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              For Creators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {creatorSteps.map((step, index) => (
                <Card key={index} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-4xl font-bold text-muted-foreground/30">
                        {index + 1}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                  {index < creatorSteps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                  )}
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild size="lg">
                <Link href="/dashboard/become-creator">Become a Creator</Link>
              </Button>
            </div>
          </section>

          {/* For Backers */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              For Backers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {backerSteps.map((step, index) => (
                <Card key={index} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-4xl font-bold text-muted-foreground/30">
                        {index + 1}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                  {index < backerSteps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                  )}
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild size="lg" variant="outline">
                <Link href="/campaigns">Explore Campaigns</Link>
              </Button>
            </div>
          </section>

          {/* FAQ Preview */}
          <section className="bg-muted/50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
            <p className="text-muted-foreground mb-6">
              Check out our FAQ for answers to common questions.
            </p>
            <Button asChild variant="secondary">
              <Link href="/faq">View FAQ</Link>
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
