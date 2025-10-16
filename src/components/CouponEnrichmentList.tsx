import { useState } from "react";
import { Search, Percent } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/PaginationControls";

interface Coupon {
  id: string;
  code: string;
  title: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  validFrom: string;
  validUntil: string;
  active: boolean;
  enriched: boolean;
}

const mockCoupons: Coupon[] = [
  {
    id: "1",
    code: "WELCOME20",
    title: "Welcome Discount",
    discountType: "percentage",
    discountValue: 20,
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    active: true,
    enriched: true,
  },
  {
    id: "2",
    code: "FIRST50",
    title: "First Order Bonus",
    discountType: "fixed",
    discountValue: 50,
    validFrom: "2024-01-01",
    validUntil: "2024-06-30",
    active: true,
    enriched: false,
  },
  {
    id: "3",
    code: "PIZZA30",
    title: "Pizza Lover Deal",
    discountType: "percentage",
    discountValue: 30,
    validFrom: "2024-03-01",
    validUntil: "2024-03-31",
    active: true,
    enriched: true,
  },
  {
    id: "4",
    code: "FAMILY100",
    title: "Family Feast Discount",
    discountType: "fixed",
    discountValue: 100,
    validFrom: "2024-02-01",
    validUntil: "2024-12-31",
    active: false,
    enriched: false,
  },
  {
    id: "5",
    code: "WEEKEND15",
    title: "Weekend Special",
    discountType: "percentage",
    discountValue: 15,
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    active: true,
    enriched: true,
  },
  {
    id: "6",
    code: "STUDENT25",
    title: "Student Discount",
    discountType: "percentage",
    discountValue: 25,
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    active: true,
    enriched: true,
  },
  {
    id: "7",
    code: "LUNCH20",
    title: "Lunchtime Special",
    discountType: "percentage",
    discountValue: 20,
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    active: true,
    enriched: false,
  },
  {
    id: "8",
    code: "BIRTHDAY50",
    title: "Birthday Celebration",
    discountType: "fixed",
    discountValue: 50,
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    active: true,
    enriched: true,
  },
  {
    id: "9",
    code: "REFER30",
    title: "Referral Bonus",
    discountType: "fixed",
    discountValue: 30,
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    active: true,
    enriched: false,
  },
  {
    id: "10",
    code: "LOYALTY10",
    title: "Loyalty Rewards",
    discountType: "percentage",
    discountValue: 10,
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    active: true,
    enriched: true,
  },
  {
    id: "11",
    code: "SUMMER40",
    title: "Summer Sale",
    discountType: "fixed",
    discountValue: 40,
    validFrom: "2024-06-01",
    validUntil: "2024-08-31",
    active: false,
    enriched: false,
  },
  {
    id: "12",
    code: "FLASH35",
    title: "Flash Sale",
    discountType: "percentage",
    discountValue: 35,
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    active: true,
    enriched: true,
  },
];

interface CouponEnrichmentListProps {
  onSelectCoupon: (couponId: string) => void;
  selectedCouponId: string | null;
}

const CouponEnrichmentList = ({ onSelectCoupon, selectedCouponId }: CouponEnrichmentListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCoupons = mockCoupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coupon.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const {
    paginatedData,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    goToPage,
    changePageSize,
    hasNextPage,
    hasPreviousPage,
  } = usePagination(filteredCoupons);

  return (
    <Card className="h-[calc(100vh-250px)]">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="space-y-4 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search coupons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 mt-4 -mx-4 px-4">
          <div className="space-y-2">
            {paginatedData.map((coupon) => (
              <Card
                key={coupon.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedCouponId === coupon.id && "border-primary ring-2 ring-primary/20"
                )}
                onClick={() => onSelectCoupon(coupon.id)}
              >
                <CardContent className="p-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Percent className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{coupon.title}</h4>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {coupon.active ? (
                        <Badge variant="default" className="bg-success text-success-foreground text-xs">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Inactive</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={goToPage}
            onPageSizeChange={changePageSize}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
          />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CouponEnrichmentList;
