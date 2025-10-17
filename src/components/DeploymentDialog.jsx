import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Rocket, Package, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DeploymentDialog = ({
  open,
  onOpenChange,
  changes,
  onDeploy,
}) => {
  const { toast } = useToast();
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async () => {
    if (!selectedEnvironment) {
      toast({
        title: "Select Environment",
        description: "Please select either Pre-production or Production to deploy.",
        variant: "destructive",
      });
      return;
    }

    setIsDeploying(true);
    
    // Simulate deployment
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    onDeploy(selectedEnvironment);
    setIsDeploying(false);
    setSelectedEnvironment(null);
    onOpenChange(false);

    toast({
      title: "Deployment Successful",
      description: `Changes deployed to ${selectedEnvironment === "sandbox" ? "Pre-production" : "Production"} environment.`,
    });
  };

  const getActionColor = (action) => {
    switch (action) {
      case "created":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "updated":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "deleted":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "product":
        return "Product";
      case "recipe":
        return "Recipe";
      case "identifier":
        return "Icon Identifier";
      case "ingredient":
        return "Ingredient";
      default:
        return type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Deploy Changes
          </DialogTitle>
          <DialogDescription>
            Review your changes and select deployment environment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Change Log */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">
              Change Log ({changes.length} {changes.length === 1 ? "change" : "changes"})
            </h3>
            <ScrollArea className="h-[300px] rounded-md border p-4">
              {changes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Package className="w-8 h-8 mb-2" />
                  <p>No changes to deploy</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {changes.map((change) => (
                    <div
                      key={change.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <Clock className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={getActionColor(change.action)}>
                            {change.action}
                          </Badge>
                          <Badge variant="secondary">{getTypeLabel(change.type)}</Badge>
                          <span className="font-medium">{change.itemName}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {change.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {change.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Environment Selection */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Select Environment</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={selectedEnvironment === "sandbox" ? "default" : "outline"}
                className="h-auto flex-col items-start p-4"
                onClick={() => setSelectedEnvironment("sandbox")}
              >
                <Package className="w-5 h-5 mb-2" />
                <span className="font-semibold">Pre-production</span>
                <span className="text-xs opacity-70">Test environment</span>
              </Button>
              <Button
                variant={selectedEnvironment === "production" ? "default" : "outline"}
                className="h-auto flex-col items-start p-4"
                onClick={() => setSelectedEnvironment("production")}
              >
                <Rocket className="w-5 h-5 mb-2" />
                <span className="font-semibold">Production</span>
                <span className="text-xs opacity-70">Live environment</span>
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDeploy}
            disabled={changes.length === 0 || !selectedEnvironment || isDeploying}
          >
            {isDeploying ? "Deploying..." : "Deploy Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeploymentDialog;
