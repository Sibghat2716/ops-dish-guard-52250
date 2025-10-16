import { useState, useEffect } from "react";
import { Upload, Download, FileSpreadsheet, Check, X, AlertCircle, History, Clock, User, MapPin, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useDeployment } from "@/contexts/DeploymentContext";
import PageHeader from "@/components/PageHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/PaginationControls";
import * as XLSX from "xlsx";

type UploadType = 'menu' | 'location';

interface ParsedItem {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  status: 'success' | 'failed';
  errorMessage?: string;
}

interface UploadHistoryItem {
  id: string;
  uploadType: UploadType;
  fileName: string;
  uploadDate: string;
  uploadedBy: string;
  totalItems: number;
  successCount: number;
  failedCount: number;
  status: 'completed' | 'partial' | 'failed';
}

// Dummy upload history data
const initialHistory: UploadHistoryItem[] = [
  {
    id: '1',
    uploadType: 'menu',
    fileName: 'menu-items-january.xlsx',
    uploadDate: '2025-01-10T14:30:00',
    uploadedBy: 'John Smith',
    totalItems: 45,
    successCount: 45,
    failedCount: 0,
    status: 'completed',
  },
  {
    id: '2',
    uploadType: 'location',
    fileName: 'new-store-locations.csv',
    uploadDate: '2025-01-08T09:15:00',
    uploadedBy: 'Sarah Johnson',
    totalItems: 12,
    successCount: 10,
    failedCount: 2,
    status: 'partial',
  },
  {
    id: '3',
    uploadType: 'menu',
    fileName: 'seasonal-menu-winter.xlsx',
    uploadDate: '2025-01-05T16:45:00',
    uploadedBy: 'Mike Chen',
    totalItems: 28,
    successCount: 25,
    failedCount: 3,
    status: 'partial',
  },
  {
    id: '4',
    uploadType: 'location',
    fileName: 'expansion-stores-Q1.xlsx',
    uploadDate: '2025-01-03T11:20:00',
    uploadedBy: 'Emily Davis',
    totalItems: 8,
    successCount: 8,
    failedCount: 0,
    status: 'completed',
  },
  {
    id: '5',
    uploadType: 'menu',
    fileName: 'breakfast-items.csv',
    uploadDate: '2024-12-28T08:30:00',
    uploadedBy: 'John Smith',
    totalItems: 15,
    successCount: 0,
    failedCount: 15,
    status: 'failed',
  },
];

const BulkUpload = () => {
  const [uploadType, setUploadType] = useState<UploadType>('menu');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);
  const [uploadHistory, setUploadHistory] = useState<UploadHistoryItem[]>(initialHistory);
  const { toast } = useToast();
  const { addChange, addNewProducts } = useDeployment();

  // Load upload history from localStorage and merge with initial dummy data
  useEffect(() => {
    const savedHistory = localStorage.getItem('bulkUploadHistory');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      // Merge with initial history, removing duplicates by id
      const merged = [...parsed, ...initialHistory].filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      );
      setUploadHistory(merged);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension === 'csv' || fileExtension === 'xlsx' || fileExtension === 'xls') {
        setFile(selectedFile);
        toast({
          title: "File selected",
          description: `${selectedFile.name} is ready to upload`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV or Excel file",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    
    // Simulate upload process - parse file and show items with success/failure
    setTimeout(() => {
      setUploading(false);
      
      // Mock parsed data based on upload type
      const mockMenuItems: ParsedItem[] = [
        { id: '1', name: 'Classic Burger', category: 'Burgers', price: '12.99', description: 'Beef patty with lettuce', status: 'success' },
        { id: '2', name: 'Veggie Burger', category: 'Burgers', price: '10.99', description: 'Plant-based patty', status: 'success' },
        { id: '3', name: 'Caesar Salad', category: 'Salads', price: 'invalid', description: 'Fresh romaine lettuce', status: 'failed', errorMessage: 'Invalid price format' },
        { id: '4', name: 'Margherita Pizza', category: 'Pizza', price: '15.99', description: 'Classic Italian pizza', status: 'success' },
        { id: '5', name: 'Pepperoni Pizza', category: '', price: '17.99', description: 'Loaded with pepperoni', status: 'failed', errorMessage: 'Category is required' },
        { id: '6', name: 'Chicken Wings', category: 'Appetizers', price: '8.99', description: 'Spicy buffalo wings', status: 'success' },
        { id: '7', name: '', category: 'Desserts', price: '6.99', description: 'Chocolate brownie', status: 'failed', errorMessage: 'Product name is required' },
        { id: '8', name: 'Ice Cream Sundae', category: 'Desserts', price: '5.99', description: 'Vanilla ice cream with toppings', status: 'success' },
      ];

      const mockLocationItems: ParsedItem[] = [
        { id: '1', name: 'Downtown Store', category: 'Main Street 123', price: '08:00-22:00', description: 'City center location', status: 'success' },
        { id: '2', name: 'Mall Branch', category: 'Westfield Mall, Floor 2', price: '10:00-21:00', description: 'Shopping mall outlet', status: 'success' },
        { id: '3', name: '', category: 'Airport Terminal 1', price: '06:00-23:00', description: 'Airport location', status: 'failed', errorMessage: 'Store name is required' },
        { id: '4', name: 'Beach Store', category: 'Seaside Blvd 45', price: 'invalid', description: 'Beachfront location', status: 'failed', errorMessage: 'Invalid time format' },
        { id: '5', name: 'Suburban Outlet', category: 'Park Avenue 78', price: '09:00-20:00', description: 'Residential area store', status: 'success' },
      ];
      
      const items = uploadType === 'menu' ? mockMenuItems : mockLocationItems;
      setParsedItems(items);
      
      const successCount = items.filter(item => item.status === 'success').length;
      const failedCount = items.filter(item => item.status === 'failed').length;
      
      toast({
        title: "File Parsed",
        description: `${successCount} items parsed successfully, ${failedCount} failed. Review the details below.`,
        variant: failedCount > 0 ? "destructive" : "default",
      });
    }, 2000);
  };

  const handleAcceptUpload = () => {
    if (parsedItems.length === 0) return;
    
    const successItems = parsedItems.filter(item => item.status === 'success');
    
    // Track the change in deployment context (only for menu items)
    if (uploadType === 'menu') {
      addChange({
        type: "product",
        action: "created",
        itemName: `${successItems.length} Products`,
        description: `Bulk uploaded ${successItems.length} products from ${file?.name}`,
      });
      addNewProducts(successItems.length);
    }
    
    // Add to upload history
    const historyItem: UploadHistoryItem = {
      id: Date.now().toString(),
      uploadType,
      fileName: file?.name || 'Unknown',
      uploadDate: new Date().toISOString(),
      uploadedBy: 'Current User', // In real app, get from auth context
      totalItems: parsedItems.length,
      successCount: successItems.length,
      failedCount: parsedItems.filter(item => item.status === 'failed').length,
      status: successItems.length === parsedItems.length ? 'completed' : 
              successItems.length > 0 ? 'partial' : 'failed',
    };
    
    const updatedHistory = [historyItem, ...uploadHistory];
    setUploadHistory(updatedHistory);
    localStorage.setItem('bulkUploadHistory', JSON.stringify(updatedHistory));
    
    toast({
      title: "Upload Accepted",
      description: uploadType === 'menu' 
        ? `${successItems.length} items added to Product Master List. Enrich and deploy to make them live.`
        : `${successItems.length} store locations added successfully.`,
    });
    
    // Reset state
    setFile(null);
    setParsedItems([]);
  };

  const handleCancelUpload = () => {
    setFile(null);
    setParsedItems([]);
    toast({
      title: "Upload Cancelled",
      description: "No items were added.",
    });
  };

  const handleDownloadErrorFile = () => {
    const failedItems = parsedItems.filter(item => item.status === 'failed');
    
    if (failedItems.length === 0) {
      toast({
        title: "No Errors",
        description: "All items were parsed successfully.",
      });
      return;
    }
    
    // Prepare data for Excel based on upload type
    const errorData = uploadType === 'menu' 
      ? failedItems.map(item => ({
          'Product Name': item.name || 'N/A',
          'Category': item.category || 'N/A',
          'Price': item.price || 'N/A',
          'Description': item.description || 'N/A',
          'Error Message': item.errorMessage || 'Unknown error',
        }))
      : failedItems.map(item => ({
          'Store Name': item.name || 'N/A',
          'Address': item.category || 'N/A',
          'Operating Hours': item.price || 'N/A',
          'Description': item.description || 'N/A',
          'Error Message': item.errorMessage || 'Unknown error',
        }));
    
    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(errorData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Failed Items');
    
    // Generate file name with timestamp
    const fileName = `bulk-upload-errors-${uploadType}-${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Download file
    XLSX.writeFile(wb, fileName);
    
    toast({
      title: "Error File Downloaded",
      description: `${failedItems.length} failed items exported to ${fileName}`,
    });
  };

  const handleDownloadTemplate = () => {
    toast({
      title: "Template downloaded",
      description: uploadType === 'menu' 
        ? "Use this template to format your menu data"
        : "Use this template to format your store location data",
    });
  };

  const successCount = parsedItems.filter(item => item.status === 'success').length;
  const failedCount = parsedItems.filter(item => item.status === 'failed').length;

  // Pagination for parsed items
  const {
    paginatedData: paginatedParsedItems,
    currentPage: parsedItemsPage,
    pageSize: parsedItemsPageSize,
    totalPages: parsedItemsTotalPages,
    totalItems: parsedItemsTotalItems,
    goToPage: goToParsedItemsPage,
    changePageSize: changeParsedItemsPageSize,
    hasNextPage: parsedItemsHasNext,
    hasPreviousPage: parsedItemsHasPrevious,
  } = usePagination(parsedItems, 5);

  const getStatusBadge = (status: UploadHistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-success">Completed</Badge>;
      case 'partial':
        return <Badge variant="secondary">Partial Success</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const fileRequirements = uploadType === 'menu' ? {
    title: 'Menu Upload Requirements',
    items: [
      'Required columns: Product Name, Category, Price, Description',
      'Optional columns: Image URL, Availability, Dietary Info',
    ]
  } : {
    title: 'Location Upload Requirements',
    items: [
      'Required columns: Store Name, Address, Opening Time, Closing Time',
      'Optional columns: Contact Number, Manager Name',
    ]
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <PageHeader
        breadcrumbs={["Admin", "Bulk Upload"]}
        title="Bulk Upload"
        description="Upload Excel or CSV files to create menu items or store locations in bulk"
      />
      
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="upload" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Upload History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {/* Upload Type Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Select Upload Type</CardTitle>
                <CardDescription>
                  Choose whether you want to upload menu items or store locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={uploadType === 'menu' ? 'default' : 'outline'}
                    onClick={() => {
                      setUploadType('menu');
                      setFile(null);
                      setParsedItems([]);
                    }}
                    className="h-20 flex flex-col gap-2"
                  >
                    <UtensilsCrossed className="w-6 h-6" />
                    <span className="font-semibold">Menu Items</span>
                  </Button>
                  <Button
                    variant={uploadType === 'location' ? 'default' : 'outline'}
                    onClick={() => {
                      setUploadType('location');
                      setFile(null);
                      setParsedItems([]);
                    }}
                    className="h-20 flex flex-col gap-2"
                  >
                    <MapPin className="w-6 h-6" />
                    <span className="font-semibold">Store Locations</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Download Template</CardTitle>
                <CardDescription>
                  Start by downloading our template to ensure your data is formatted correctly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleDownloadTemplate} variant="outline">
                  <Download className="w-4 h-4" />
                  Download {uploadType === 'menu' ? 'Menu' : 'Location'} Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload File</CardTitle>
                <CardDescription>
                  Upload your completed Excel or CSV file to create {uploadType === 'menu' ? 'menu items' : 'store locations'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <FileSpreadsheet className="w-12 h-12 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">
                      {file ? (
                        <span className="font-medium text-foreground">{file.name}</span>
                      ) : (
                        <>
                          <span className="font-medium text-primary">Click to upload</span> or drag and drop
                        </>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      CSV, XLS, or XLSX (max 10MB)
                    </div>
                  </label>
                </div>

                {file && parsedItems.length === 0 && (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4" />
                      {uploading ? "Parsing File..." : `Parse & Preview ${uploadType === 'menu' ? 'Items' : 'Locations'}`}
                    </Button>
                    <Button
                      onClick={() => setFile(null)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                {parsedItems.length > 0 && (
                  <div className="space-y-4">
                    <Alert variant={failedCount > 0 ? "destructive" : "default"}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Upload Preview</AlertTitle>
                      <AlertDescription>
                        <div className="flex gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-success" />
                            <span><strong>{successCount}</strong> Success</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <X className="w-4 h-4 text-destructive" />
                            <span><strong>{failedCount}</strong> Failed</span>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>

                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Parsed Items</CardTitle>
                          {failedCount > 0 && (
                            <Button
                              onClick={handleDownloadErrorFile}
                              variant="outline"
                              size="sm"
                            >
                              <Download className="w-4 h-4" />
                              Download Error File
                            </Button>
                          )}
                        </div>
                        <CardDescription>
                          Review all items below. Only successful items will be added.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-3">
                            {paginatedParsedItems.map((item) => (
                              <div
                                key={item.id}
                                className={`p-4 rounded-lg border ${
                                  item.status === 'success'
                                    ? 'border-success/20 bg-success/5'
                                    : 'border-destructive/20 bg-destructive/5'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                      {item.status === 'success' ? (
                                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                                      ) : (
                                        <X className="w-4 h-4 text-destructive flex-shrink-0" />
                                      )}
                                      <h4 className="font-medium">
                                        {item.name || <span className="text-muted-foreground italic">No name</span>}
                                      </h4>
                                      <Badge variant={item.status === 'success' ? 'default' : 'destructive'} className="ml-auto">
                                        {item.status}
                                      </Badge>
                                    </div>
                                    <div className="ml-6 text-sm text-muted-foreground">
                                      {uploadType === 'menu' ? (
                                        <>
                                          <p><strong>Category:</strong> {item.category || 'N/A'}</p>
                                          <p><strong>Price:</strong> {item.price || 'N/A'}</p>
                                          <p><strong>Description:</strong> {item.description || 'N/A'}</p>
                                        </>
                                      ) : (
                                        <>
                                          <p><strong>Address:</strong> {item.category || 'N/A'}</p>
                                          <p><strong>Operating Hours:</strong> {item.price || 'N/A'}</p>
                                          <p><strong>Description:</strong> {item.description || 'N/A'}</p>
                                        </>
                                      )}
                                    </div>
                                    {item.errorMessage && (
                                      <div className="ml-6 mt-2">
                                        <Alert variant="destructive" className="py-2">
                                          <AlertDescription className="text-xs">
                                            <strong>Error:</strong> {item.errorMessage}
                                          </AlertDescription>
                                        </Alert>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {parsedItems.length > 5 && (
                            <div className="pt-4 border-t">
                              <PaginationControls
                                currentPage={parsedItemsPage}
                                totalPages={parsedItemsTotalPages}
                                pageSize={parsedItemsPageSize}
                                totalItems={parsedItemsTotalItems}
                                onPageChange={goToParsedItemsPage}
                                onPageSizeChange={changeParsedItemsPageSize}
                                hasNextPage={parsedItemsHasNext}
                                hasPreviousPage={parsedItemsHasPrevious}
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex gap-2">
                      <Button onClick={handleAcceptUpload} className="flex-1" disabled={successCount === 0}>
                        <Check className="w-4 h-4" />
                        Accept {successCount} Successful Items
                      </Button>
                      <Button onClick={handleCancelUpload} variant="outline">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{fileRequirements.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• File must be in CSV, XLS, or XLSX format</li>
                  <li>• Maximum file size: 10MB</li>
                  {fileRequirements.items.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                  <li>• First row should contain column headers</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Upload History
                </CardTitle>
                <CardDescription>
                  View all previous bulk upload attempts for menu items and store locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {uploadHistory.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No upload history yet</p>
                    <p className="text-sm">Upload your first file to see history here</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-4">
                      {uploadHistory.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                {item.uploadType === 'menu' ? (
                                  <UtensilsCrossed className="w-4 h-4 text-primary" />
                                ) : (
                                  <MapPin className="w-4 h-4 text-primary" />
                                )}
                                <h4 className="font-medium">{item.fileName}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {item.uploadType === 'menu' ? 'Menu Upload' : 'Location Upload'}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3 h-3" />
                                  <span>{new Date(item.uploadDate).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="w-3 h-3" />
                                  <span>{item.uploadedBy}</span>
                                </div>
                              </div>
                              
                              <Separator className="my-2" />
                              
                              <div className="flex gap-4 flex-wrap text-sm">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                                  <span><strong>{item.totalItems}</strong> Total</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Check className="w-4 h-4 text-success" />
                                  <span><strong>{item.successCount}</strong> Success</span>
                                </div>
                                {item.failedCount > 0 && (
                                  <div className="flex items-center gap-2">
                                    <X className="w-4 h-4 text-destructive" />
                                    <span><strong>{item.failedCount}</strong> Failed</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              {getStatusBadge(item.status)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BulkUpload;