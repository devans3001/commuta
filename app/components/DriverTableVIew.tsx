import React, { useMemo, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RidersTableSkeleton } from "@/components/RidersTableSkeleton";
import type { Driver } from '@/lib/type';
import { CheckCircle, Eye, Car, Wifi, WifiOff } from 'lucide-react';
import { formatPhone } from '@/lib/helper';
import { Button } from './ui/button';
import { useNavigate } from 'react-router';

// Import AG Grid
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

import { themeQuartz } from 'ag-grid-community';

// to use myTheme in an application, pass it to the theme grid option
const myTheme = themeQuartz
    .withParams({
        backgroundColor: "#1f2836",
        browserColorScheme: "light",
        chromeBackgroundColor: {
            ref: "foregroundColor",
            mix: 0.07,
            onto: "backgroundColor"
        },
        foregroundColor: "#FFF",
        headerFontSize: 14
    });


// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

/* Custom Cell Renderer for Online Status */
const OnlineStatusRenderer = (params: { value: string }) => (
  <div className="flex justify-center pt-2">
    {params.value === "1" ? (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <Wifi className="h-3 w-3 mr-1" />
        Online
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
        <WifiOff className="h-3 w-3 mr-1" />
        Offline
      </Badge>
    )}
  </div>
);

/* Custom Cell Renderer for Phone with verification */
const PhoneRenderer = (params: { data: Driver }) => (
  <div className="flex items-center gap-1">
    <span>{formatPhone(params.data.phoneNumber)}</span>
    {params.data.isPhoneVerified === "1" && (
      <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
    )}
  </div>
);

/* Custom Cell Renderer for Vehicle */
const VehicleRenderer = (params: { data: Driver }) => (
  <div className="flex items-center gap-2">
    <Car className="h-4 w-4 text-muted-foreground" />
    <div>
      <p className="font-medium text-sm">{params.data.vehicleType}</p>
      <p className="text-xs text-muted-foreground">{params.data.licensePlate}</p>
    </div>
  </div>
);

/* Custom Cell Renderer for Earnings */
const EarningsRenderer = (params: { value: number }) => (
  <div className="text-center">
    <span className="font-semibold text-green-600">
      ₦{(params.value || 0).toLocaleString()}
    </span>
  </div>
);

/* Custom Cell Renderer for Actions */
const ActionsRenderer = (params: { data: Driver }) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/admin/drivers/${params.data.id}`)}
        title="View details"
      >
        <Eye className="h-4 w-4" />
      </Button>
    </div>
  );
};

function DriverTableView({
  isLoading,
  paginatedDrivers,
}: {
  isLoading: boolean;
  paginatedDrivers: Driver[];
}) {
  const gridRef = useRef<AgGridReact<Driver>>(null);
  
  // Column Definitions: Defines & controls grid columns
  const [colDefs] = useState([
    {
      field: 'name',
      headerName: 'Name',
    //   minWidth: 120,
      minWidth: 250,
      cellRenderer: (params: { value: string; data: Driver }) => (
        <div className="flex flex-col">
          <span className="font-medium">{params.value}</span>
          <span className="text-xs text-muted-foreground">
            #{params.data.id}
          </span>
        </div>
      ),
      flex:2
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone',
       maxWidth: 180,
      cellRenderer: PhoneRenderer,
    },
    {
      headerName: 'Vehicle',
      minWidth: 100,
      maxWidth: 170,
      cellRenderer: VehicleRenderer,
    },
    {
      field: 'isOnline',
      headerName: 'Status',
      minWidth: 100,
      maxWidth: 120,
      cellRenderer: OnlineStatusRenderer,
    },

    {
      field: 'totalRides',
      headerName: 'Rides',
      minWidth: 70,
      maxWidth: 70,
      cellRenderer: (params: { value: number }) => (
        <div className="text-center font-semibold">
          {params.value}
        </div>
      ),
    },
    {
      field: 'totalEarnings',
      headerName: 'Earnings',
      minWidth: 70,
      maxWidth: 100,
      cellRenderer: EarningsRenderer,
    },
    {
      headerName: 'Actions',
      minWidth: 80,
      maxWidth: 90,
      cellRenderer: ActionsRenderer,
    },
  ]);

  // Apply settings across all columns
  const defaultColDef = useMemo(() => {
    return {
      filter: false,
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 100,
      suppressSizeToFit: false,
    };
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <RidersTableSkeleton />
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!paginatedDrivers || paginatedDrivers.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="rounded-full bg-muted p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Car className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Drivers Found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search criteria.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full h-full">
      <div 
        className="ag-theme-quartz" 
        style={{ 
          height: 500,
          width: '100%',
        }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={paginatedDrivers}
          theme={myTheme}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          rowHeight={60}
          headerHeight={45}
          pagination={true}
          paginationPageSize={10}
          suppressCellFocus={true}
        //   enableCellTextSelection={true}
        //   ensureDomOrder={true}
        />
      </div>
    </div>
  );
}

export default DriverTableView;