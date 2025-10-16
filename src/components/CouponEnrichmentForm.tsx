import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Upload, X, Image as ImageIcon, Video, Percent } from "lucide-react";

interface CouponEnrichmentFormProps {
  couponId: string;
  onHasChanges?: (hasChanges: boolean) => void;
  onAddChange?: (entry: { type: "coupon"; action: "created" | "updated" | "deleted"; itemName: string; description: string }) => void;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  name: string;
}

const CouponEnrichmentForm = ({ couponId, onHasChanges, onAddChange }: CouponEnrichmentFormProps) => {
  const [formData, setFormData] = useState({
    code: "WELCOME20",
    title: "Welcome Discount",
    shortDescription: "Get 20% off on your first order",
    longDescription: "Welcome to our restaurant! As a token of our appreciation, enjoy 20% off your first order. This offer is valid for both delivery and takeaway orders. Simply apply the code WELCOME20 at checkout. Terms and conditions apply.",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 20,
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    termsAndConditions: "- Valid for first-time customers only\n- Cannot be combined with other offers\n- Minimum order value: RM 50\n- Valid for all menu items except combos",
  });

  const [media, setMedia] = useState<MediaItem[]>([
    { id: "1", type: "image", url: "/placeholder.svg", name: "coupon-banner.jpg" },
  ]);

  useEffect(() => {
    onHasChanges?.(false);
  }, [couponId]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onHasChanges?.(true);
  };

  const handleRemoveMedia = (mediaId: string) => {
    setMedia(media.filter(m => m.id !== mediaId));
    onHasChanges?.(true);
  };

  return (
    <Card className="h-[calc(100vh-250px)]">
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" />
            {formData.title}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="font-mono text-sm">
              {formData.code}
            </Badge>
            <Badge variant="default" className="bg-primary/10 text-primary">
              {formData.discountType === "percentage" 
                ? `${formData.discountValue}% OFF` 
                : `RM ${formData.discountValue} OFF`}
            </Badge>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              Enriched
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Valid From:</span> {new Date(formData.validFrom).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Valid Until:</span> {new Date(formData.validUntil).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-420px)] pr-4">
          <div className="space-y-6">
            {/* Core Information (Read-only) */}
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                <Label className="text-sm font-semibold">Core Information (from platform)</Label>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Coupon Code:</span>
                    <p className="font-mono font-semibold">{formData.code}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Discount:</span>
                    <p className="font-semibold">
                      {formData.discountType === "percentage" 
                        ? `${formData.discountValue}%` 
                        : `RM ${formData.discountValue}`}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valid From:</span>
                    <p>{new Date(formData.validFrom).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valid Until:</span>
                    <p>{new Date(formData.validUntil).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Enrichment Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Display Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter display title for customers"
                />
              </div>

              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => handleChange("shortDescription", e.target.value)}
                  placeholder="Brief description shown in coupon listings"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="longDescription">Full Description</Label>
                <Textarea
                  id="longDescription"
                  value={formData.longDescription}
                  onChange={(e) => handleChange("longDescription", e.target.value)}
                  placeholder="Detailed description shown on coupon detail page"
                  rows={4}
                />
              </div>
            </div>

            <Separator />

            {/* Media Management */}
            <div className="space-y-3">
              <Label>Marketing Media</Label>
              <p className="text-sm text-muted-foreground">
                Upload banners, promotional images, or videos for this coupon
              </p>
              <div className="grid grid-cols-2 gap-3">
                {media.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="aspect-video rounded-lg border-2 border-dashed flex items-center justify-center bg-muted">
                      {item.type === 'image' ? (
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      ) : (
                        <Video className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveMedia(item.id)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{item.name}</p>
                  </div>
                ))}
                <button className="aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Upload Media</span>
                </button>
              </div>
            </div>

            <Separator />

            {/* Terms and Conditions */}
            <div className="space-y-3">
              <Label htmlFor="terms">Terms & Conditions</Label>
              <Textarea
                id="terms"
                value={formData.termsAndConditions}
                onChange={(e) => handleChange("termsAndConditions", e.target.value)}
                placeholder="Enter terms and conditions"
                rows={6}
                className="font-mono text-xs"
              />
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Customer Preview
              </h4>
              <p className="text-xs text-muted-foreground">
                These enrichment details will be displayed to customers on the e-commerce platform when they view or apply this coupon.
              </p>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CouponEnrichmentForm;
