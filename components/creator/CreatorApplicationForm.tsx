"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function CreatorApplicationForm() {
  const submitApplication = useMutation(
    api.creatorApplications.submitApplication
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    website: "",
    twitter: "",
    linkedin: "",
    github: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitApplication({
        fullName: formData.fullName,
        bio: formData.bio,
        website: formData.website || undefined,
        socialLinks: {
          twitter: formData.twitter || undefined,
          linkedin: formData.linkedin || undefined,
          github: formData.github || undefined,
        },
      });

      toast.success("Application submitted!", {
        description: "We'll review your application and get back to you soon.",
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit application",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Become a Creator</CardTitle>
          <CardDescription>
            Apply to become a creator and start launching campaigns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio *</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Tell us about yourself and what you want to create..."
              rows={6}
              required
            />
            <p className="text-sm text-muted-foreground">
              Minimum 100 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div className="space-y-4">
            <Label>Social Links (Optional)</Label>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="text-sm font-normal">
                Twitter/X
              </Label>
              <Input
                id="twitter"
                value={formData.twitter}
                onChange={(e) => handleChange("twitter", e.target.value)}
                placeholder="https://twitter.com/username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin" className="text-sm font-normal">
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => handleChange("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github" className="text-sm font-normal">
                GitHub
              </Label>
              <Input
                id="github"
                value={formData.github}
                onChange={(e) => handleChange("github", e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Application
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
