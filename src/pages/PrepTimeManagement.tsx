import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";

interface PrepTimeRange {
  itemCount: string;
  timeTake: string;
}

const PrepTimeManagement = () => {
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);
  const [prepTimes, setPrepTimes] = useState<PrepTimeRange[]>([
    { itemCount: "1 to 3", timeTake: "" },
    { itemCount: "3 to 5", timeTake: "" },
    { itemCount: "5 to 8", timeTake: "" },
    { itemCount: ">10", timeTake: "" },
  ]);

  const handleTimeChange = (index: number, value: string) => {
    const newPrepTimes = [...prepTimes];
    newPrepTimes[index].timeTake = value;
    setPrepTimes(newPrepTimes);
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    // Simulate save operation
    toast({
      title: "Success",
      description: "Prep time settings have been saved successfully.",
    });
    setHasChanges(false);
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      <PageHeader 
        breadcrumbs={["Central Ops", "Prep Time"]}
        title="Prep Time Management"
        description="Configure estimated preparation times based on item count ranges"
      />

      <div className="flex justify-end">
        <Button 
          onClick={handleSaveChanges} 
          disabled={!hasChanges}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preparation Time Matrix</CardTitle>
          <CardDescription>
            Use the above method to average out the prep time and share the estimated time in the following format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Item Count</TableHead>
                <TableHead>Average Time Taken (minutes)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prepTimes.map((range, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{range.itemCount}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={range.timeTake}
                      onChange={(e) => handleTimeChange(index, e.target.value)}
                      placeholder="Enter time in minutes"
                      className="max-w-[200px]"
                      min="0"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrepTimeManagement;
