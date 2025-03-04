
import { toast } from "@/hooks/use-toast";

export const shareProperty = (propertyId: string, propertyTitle: string) => {
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/property/${propertyId}`;
  
  // Copy to clipboard
  navigator.clipboard.writeText(shareUrl)
    .then(() => {
      toast({
        title: "Link Copied!",
        description: `Share link for "${propertyTitle}" has been copied to your clipboard.`,
      });
    })
    .catch((error) => {
      console.error("Failed to copy:", error);
      toast({
        title: "Couldn't Copy Link",
        description: "Please copy this URL manually: " + shareUrl,
        variant: "destructive",
      });
    });
    
  // Return URL in case we want to use it elsewhere
  return shareUrl;
};
