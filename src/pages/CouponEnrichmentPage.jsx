import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDeployment } from "@/contexts/DeploymentContext";
import CouponEnrichmentList from "@/components/CouponEnrichmentList";
import CouponEnrichmentForm from "@/components/CouponEnrichmentForm";

const CouponEnrichmentPage = () => {
  const { toast } = useToast();
  const { addChange } = useDeployment();
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSaveChanges = () => {
    if (selectedCoupon) {
      addChange({
        type: "coupon",
        action: "updated",
        itemName: selectedCoupon,
        description: `Updated coupon enrichment`,
      });
    }
    setHasUnsavedChanges(false);
    toast({
      title: "Changes Saved",
      description: "Your changes have been saved. Go to Deploy to make them live.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coupon Enrichment</h1>
          <p className="text-muted-foreground mt-2">
            Enrich coupons with marketing media and descriptions
          </p>
        </div>
        <Button 
          onClick={handleSaveChanges} 
          disabled={!hasUnsavedChanges}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4">
          <CouponEnrichmentList
            onSelectCoupon={setSelectedCoupon}
            selectedCouponId={selectedCoupon}
          />
        </div>
        <div className="col-span-8">
          {selectedCoupon ? (
            <CouponEnrichmentForm
              couponId={selectedCoupon}
              onHasChanges={setHasUnsavedChanges}
            />
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed rounded-lg min-h-[500px]">
              <p className="text-muted-foreground">Select a coupon to enrich</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponEnrichmentPage;
