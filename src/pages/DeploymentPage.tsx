import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Rocket, Package, Clock, Store, CheckCircle2, XCircle, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDeployment } from "@/contexts/DeploymentContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const mockStores = [
  { id: "store-1", name: "Downtown Location", code: "DT001" },
  { id: "store-2", name: "Westside Mall", code: "WS002" },
  { id: "store-3", name: "Airport Terminal", code: "AP003" },
  { id: "store-4", name: "North Branch", code: "NB004" },
];

const DeploymentPage = () => {
  const { toast } = useToast();
  const { changes, clearChanges, clearNewProducts, deploymentHistory, addDeployment, updateDeploymentStatus } = useDeployment();
  const [selectedEnvironment, setSelectedEnvironment] = useState<"sandbox" | "production" | null>(null);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [expandedDeployments, setExpandedDeployments] = useState<Set<string>>(new Set());

  const handleStoreToggle = (storeId: string) => {
    setSelectedStores((prev) =>
      prev.includes(storeId)
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId]
    );
  };

  const handleSelectAllStores = () => {
    if (selectedStores.length === mockStores.length) {
      setSelectedStores([]);
    } else {
      setSelectedStores(mockStores.map((store) => store.id));
    }
  };

  const handleDeploy = async () => {
    if (!selectedEnvironment) {
      toast({
        title: "Select Environment",
        description: "Please select either Pre-production or Production to deploy.",
        variant: "destructive",
      });
      return;
    }

    if (selectedEnvironment === "sandbox" && selectedStores.length === 0) {
      toast({
        title: "Select Stores",
        description: "Please select at least one store for Pre-production deployment.",
        variant: "destructive",
      });
      return;
    }

    setIsDeploying(true);
    const startTime = Date.now();

    // Create deployment record
    const deploymentId = addDeployment({
      environment: selectedEnvironment,
      status: "pending",
      changesCount: changes.length,
      changes: [...changes],
      targetStores: selectedEnvironment === "sandbox" ? selectedStores : undefined,
      deployedBy: "Admin User", // In real app, this would be the logged-in user
    });

    // Update to in-progress
    updateDeploymentStatus(deploymentId, "in-progress", [
      "Validating changes...",
      `Deploying ${changes.length} changes...`,
    ]);

    // Simulate deployment steps
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateDeploymentStatus(deploymentId, "in-progress", [
      "Building deployment package...",
    ]);

    await new Promise((resolve) => setTimeout(resolve, 800));
    updateDeploymentStatus(deploymentId, "in-progress", [
      selectedEnvironment === "sandbox"
        ? `Deploying to ${selectedStores.length} store(s)...`
        : "Deploying to all production stores...",
    ]);

    await new Promise((resolve) => setTimeout(resolve, 700));
    updateDeploymentStatus(deploymentId, "in-progress", [
      "Updating configurations...",
    ]);

    const duration = Date.now() - startTime;

    // Complete deployment
    updateDeploymentStatus(deploymentId, "success", [
      "Deployment completed successfully!",
      `Total duration: ${(duration / 1000).toFixed(2)}s`,
    ], duration);

    const deploymentTarget =
      selectedEnvironment === "sandbox"
        ? `${selectedStores.length} store(s)`
        : "all production stores";

    // Clear new products badge when deploying to production
    if (selectedEnvironment === "production") {
      clearNewProducts();
    }

    clearChanges();
    setSelectedEnvironment(null);
    setSelectedStores([]);
    setIsDeploying(false);

    toast({
      title: "Deployment Successful",
      description: `${changes.length} changes deployed to ${deploymentTarget} in ${selectedEnvironment}.`,
    });
  };

  const toggleDeploymentExpanded = (deploymentId: string) => {
    setExpandedDeployments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(deploymentId)) {
        newSet.delete(deploymentId);
      } else {
        newSet.add(deploymentId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "in-progress":
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">Success</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">In Progress</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getActionColor = (action: string) => {
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "product":
        return "Product";
      case "recipe":
        return "Recipe";
      case "identifier":
        return "Icon Identifier";
      case "ingredient":
        return "Ingredient";
      case "coupon":
        return "Coupon";
      default:
        return type;
    }
  };

  return (
    <div className="container mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Deploy Changes</h1>
        <p className="text-muted-foreground mt-2">
          Review and deploy your Central Ops changes to Pre-production or Production
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Changes Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Pending Changes
              <Badge variant="secondary">{changes.length}</Badge>
            </CardTitle>
            <CardDescription>
              Review all changes before deployment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              {changes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Package className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-center">No pending changes</p>
                  <p className="text-xs text-center mt-2">
                    Make changes in Product Enrichment or Coupon Enrichment to see them here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {changes.map((change) => (
                    <div
                      key={change.id}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                    >
                      <Clock className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={getActionColor(change.action)}>
                            {change.action}
                          </Badge>
                          <Badge variant="secondary">{getTypeLabel(change.type)}</Badge>
                          <span className="font-medium text-sm">{change.itemName}</span>
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
          </CardContent>
        </Card>

        {/* Deployment Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              Deployment Configuration
            </CardTitle>
            <CardDescription>
              Select environment and target stores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Environment Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Environment</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={selectedEnvironment === "sandbox" ? "default" : "outline"}
                  className="h-auto flex-col items-start p-4"
                  onClick={() => {
                    setSelectedEnvironment("sandbox");
                    setSelectedStores([]);
                  }}
                >
                  <Package className="w-5 h-5 mb-2" />
                  <span className="font-semibold">Pre-production</span>
                  <span className="text-xs opacity-70">Select specific stores</span>
                </Button>
                <Button
                  variant={selectedEnvironment === "production" ? "default" : "outline"}
                  className="h-auto flex-col items-start p-4"
                  onClick={() => {
                    setSelectedEnvironment("production");
                    setSelectedStores([]);
                  }}
                >
                  <Rocket className="w-5 h-5 mb-2" />
                  <span className="font-semibold">Production</span>
                  <span className="text-xs opacity-70">All live stores</span>
                </Button>
              </div>
            </div>

            {/* Store Selection for Sandbox */}
            {selectedEnvironment === "sandbox" && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Target Stores</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSelectAllStores}
                    >
                      {selectedStores.length === mockStores.length ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                  <ScrollArea className="h-[280px] rounded-md border p-4">
                    <div className="space-y-3">
                      {mockStores.map((store) => (
                        <div
                          key={store.id}
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                          onClick={() => handleStoreToggle(store.id)}
                        >
                          <Checkbox
                            id={store.id}
                            checked={selectedStores.includes(store.id)}
                            onCheckedChange={() => handleStoreToggle(store.id)}
                          />
                          <Label
                            htmlFor={store.id}
                            className="flex-1 cursor-pointer flex items-center gap-2"
                          >
                            <Store className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{store.name}</div>
                              <div className="text-xs text-muted-foreground">{store.code}</div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  {selectedStores.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {selectedStores.length} store(s) selected
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Production Warning */}
            {selectedEnvironment === "production" && (
              <>
                <Separator />
                <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4">
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
                    ⚠️ Production Deployment
                  </p>
                  <p className="text-xs text-yellow-600/80 dark:text-yellow-400/80 mt-1">
                    Changes will be deployed to all live stores. Please ensure all changes have been tested in Pre-production.
                  </p>
                </div>
              </>
            )}

            {/* Deploy Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleDeploy}
              disabled={
                changes.length === 0 ||
                !selectedEnvironment ||
                (selectedEnvironment === "sandbox" && selectedStores.length === 0) ||
                isDeploying
              }
            >
              {isDeploying ? (
                <>
                  <Package className="w-4 h-4 mr-2 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Deploy {changes.length} Change(s)
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Deployment History */}
      {deploymentHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Deployment History
            </CardTitle>
            <CardDescription>
              View past deployments with detailed logs and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {deploymentHistory.map((deployment) => (
                  <Collapsible
                    key={deployment.id}
                    open={expandedDeployments.has(deployment.id)}
                    onOpenChange={() => toggleDeploymentExpanded(deployment.id)}
                  >
                    <Card className="border-l-4" style={{
                      borderLeftColor: 
                        deployment.status === "success" ? "rgb(34, 197, 94)" :
                        deployment.status === "failed" ? "rgb(239, 68, 68)" :
                        deployment.status === "in-progress" ? "rgb(59, 130, 246)" :
                        "rgb(156, 163, 175)"
                    }}>
                      <CollapsibleTrigger className="w-full">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              {getStatusIcon(deployment.status)}
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {getStatusBadge(deployment.status)}
                                  <Badge variant="outline">{deployment.environment}</Badge>
                                  <span className="text-sm font-medium">
                                    {deployment.changesCount} change(s)
                                  </span>
                                  {deployment.targetStores && (
                                    <Badge variant="secondary" className="text-xs">
                                      {deployment.targetStores.length} store(s)
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Deployed by {deployment.deployedBy} • {deployment.timestamp.toLocaleString()}
                                </p>
                                {deployment.duration && (
                                  <p className="text-xs text-muted-foreground">
                                    Duration: {(deployment.duration / 1000).toFixed(2)}s
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="ml-2">
                              {expandedDeployments.has(deployment.id) ? (
                                <ChevronDown className="w-5 h-5 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0 pb-4 px-4">
                          <Separator className="mb-4" />
                          
                          {/* Deployment Logs */}
                          <div className="space-y-2 mb-4">
                            <h4 className="text-sm font-semibold flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              Deployment Logs
                            </h4>
                            <div className="bg-muted/50 rounded-lg p-3 font-mono text-xs space-y-1">
                              {deployment.logs.map((log, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <span className="text-muted-foreground">[{idx + 1}]</span>
                                  <span>{log}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Changes List */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Changes Deployed</h4>
                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                              {deployment.changes.map((change) => (
                                <div
                                  key={change.id}
                                  className="flex items-start gap-2 p-2 rounded-lg border bg-card text-xs"
                                >
                                  <Badge variant="outline" className={getActionColor(change.action)}>
                                    {change.action}
                                  </Badge>
                                  <div className="flex-1">
                                    <div className="font-medium">{change.itemName}</div>
                                    <div className="text-muted-foreground">{change.description}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeploymentPage;
