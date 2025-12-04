"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CAMPAIGN_CATEGORIES } from "@/lib/categories";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2 } from "lucide-react";

interface EditCampaignFormData {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  goalAmount: string;
  imageUrl: string;
  videoUrl: string;
  endDate: string;
}

export default function EditCampaignPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const campaignId = params.id as Id<"campaigns">;

  const campaign = useQuery(api.campaigns.getCampaignById, { id: campaignId });
  const updateCampaign = useMutation(api.campaigns.updateCampaign);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<EditCampaignFormData>({
    title: "",
    shortDescription: "",
    description: "",
    category: "",
    goalAmount: "",
    imageUrl: "",
    videoUrl: "",
    endDate: "",
  });

  useEffect(() => {
    if (campaign) {
      setFormData({
        title: campaign.title,
        shortDescription: campaign.shortDescription,
        description: campaign.description,
        category: campaign.category,
        goalAmount: campaign.goalAmount.toString(),
        imageUrl: campaign.imageUrl || "",
        videoUrl: campaign.videoUrl || "",
        endDate: new Date(campaign.endDate).toISOString().split("T")[0],
      });
    }
  }, [campaign]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateCampaign({
        campaignId,
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        category: formData.category,
        goalAmount: parseFloat(formData.goalAmount),
        imageUrl: formData.imageUrl || undefined,
        videoUrl: formData.videoUrl || undefined,
        endDate: new Date(formData.endDate).getTime(),
      });

      toast.success("Campaign updated!", {
        description: "Your campaign has been updated successfully.",
      });

      router.push("/dashboard/campaigns");
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to update campaign",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof EditCampaignFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (campaign === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (campaign === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Campaign not found</p>
      </div>
    );
  }

  if (campaign.status !== "draft") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Only draft campaigns can be edited</p>
      </div>
    );
  }

  return (
    <AuthGuard requiredRole="creator">
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Edit Campaign</h1>

            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Campaign Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="Give your campaign a clear title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">
                      Short Description *
                    </Label>
                    <Input
                      id="shortDescription"
                      value={formData.shortDescription}
                      onChange={(e) =>
                        handleChange("shortDescription", e.target.value)
                      }
                      placeholder="A brief summary (max 120 characters)"
                      maxLength={120}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Full Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      placeholder="Describe your project in detail"
                      rows={8}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleChange("category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CAMPAIGN_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          handleChange("endDate", e.target.value)
                        }
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goalAmount">Funding Goal *</Label>
                    <Input
                      id="goalAmount"
                      type="number"
                      value={formData.goalAmount}
                      onChange={(e) =>
                        handleChange("goalAmount", e.target.value)
                      }
                      placeholder="5000"
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Campaign Image URL</Label>
                    <Input
                      id="imageUrl"
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => handleChange("imageUrl", e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">Video URL (Optional)</Label>
                    <Input
                      id="videoUrl"
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => handleChange("videoUrl", e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Update Campaign
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
