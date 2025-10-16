import { useState } from "react";
import { Clock, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface DayHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface OperatingHoursProps {
  selectedStore: string;
  onHasChanges: (hasChanges: boolean) => void;
}

const OperatingHours = ({ selectedStore, onHasChanges }: OperatingHoursProps) => {
  const [hours, setHours] = useState<DayHours[]>([
    { day: "Monday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { day: "Tuesday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { day: "Wednesday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { day: "Thursday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { day: "Friday", isOpen: true, openTime: "09:00", closeTime: "23:00" },
    { day: "Saturday", isOpen: true, openTime: "10:00", closeTime: "23:00" },
    { day: "Sunday", isOpen: true, openTime: "10:00", closeTime: "22:00" }
  ]);

  const updateDay = (index: number, field: keyof DayHours, value: any) => {
    const newHours = [...hours];
    newHours[index] = { ...newHours[index], [field]: value };
    setHours(newHours);
    onHasChanges(true);
  };

  const copyToAll = (index: number) => {
    const template = hours[index];
    setHours(hours.map(day => ({
      ...day,
      openTime: template.openTime,
      closeTime: template.closeTime
    })));
    onHasChanges(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Operating Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hours.map((dayHours, index) => (
            <div key={dayHours.day} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-28 font-medium">{dayHours.day}</div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={dayHours.isOpen}
                  onCheckedChange={(checked) => updateDay(index, 'isOpen', checked)}
                />
                <span className="text-sm text-muted-foreground">
                  {dayHours.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>

              {dayHours.isOpen && (
                <>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">Opens:</Label>
                    <Input
                      type="time"
                      value={dayHours.openTime}
                      onChange={(e) => updateDay(index, 'openTime', e.target.value)}
                      className="w-32"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">Closes:</Label>
                    <Input
                      type="time"
                      value={dayHours.closeTime}
                      onChange={(e) => updateDay(index, 'closeTime', e.target.value)}
                      className="w-32"
                    />
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToAll(index)}
                    title="Copy to all days"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default OperatingHours;
