"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { formatRelativeTime } from "@/lib/utils";
import { CommentWithUser } from "@/types";
import { MessageSquare, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface CommentSectionProps {
  campaignId: Id<"campaigns">;
}

export function CommentSection({ campaignId }: CommentSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const comments = useQuery(api.comments.getCampaignComments, { campaignId });
  const createComment = useMutation(api.comments.createComment);
  const deleteComment = useMutation(api.comments.deleteComment);

  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await createComment({ campaignId, content });
      setContent("");
      toast.success("Comment posted", {
        description: "Your comment has been added.",
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to post comment",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: Id<"comments">) => {
    try {
      await deleteComment({ commentId });
      toast.success("Comment deleted", {
        description: "Your comment has been removed.",
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to delete comment",
      });
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <MessageSquare className="h-6 w-6" />
        Comments ({comments?.length || 0})
      </h2>

      {isAuthenticated && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                required
              />
              <Button type="submit" disabled={isSubmitting}>
                Post Comment
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {comments?.map((comment: CommentWithUser) => (
          <Card key={comment._id}>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src={comment.user?.image} />
                  <AvatarFallback>
                    {getInitials(comment.user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold">{comment.user?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatRelativeTime(comment.createdAt)}
                      </p>
                    </div>
                    {user && comment.userId === user._id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(comment._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {comments?.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}
