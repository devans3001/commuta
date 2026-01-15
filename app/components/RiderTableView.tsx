import React, { useMemo, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RidersTableSkeleton } from "@/components/RidersTableSkeleton";
import type { Rider } from '@/lib/type';
import { CheckCircle, Eye, Star } from 'lucide-react';
import { formatDate, formatPhone } from '@/lib/helper';
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

// Import AG Grid styles
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-quartz.css';

/* Custom Cell Renderer for Status Badge */
const StatusRenderer = (params: { value: string }) => (
    <div className='flex justify-center pt-2'>

  <Badge variant={params.value === "1" ? "default" : "secondary"}>
    {params.value === "1" ? "Active" : "Inactive"}
  </Badge>
    </div>
);

/* Custom Cell Renderer for Email with verification */
const EmailRenderer = (params: { data: Rider }) => (
  <div className="flex items-center gap-1">
    <span className="truncate">{params.data.emailAddress}</span>
    {params.data.isEmailVerified === "1" && (
      <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
    )}
  </div>
);

/* Custom Cell Renderer for Phone with verification */
const PhoneRenderer = (params: { data: Rider }) => (
  <div className="flex items-center gap-1">
    <span>{formatPhone(params.data.phoneNumber)}</span>
    {params.data.isPhoneVerified === "1" && (
      <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
    )}
  </div>
);

/* Custom Cell Renderer for Rides */
const RidesRenderer = (params: { data: Rider }) => (
  <div className="flex flex-col">
    <span className="font-semibold text-center">{params.data.totalRides}</span>
    <div className="flex justify-center gap-2 text-xs text-muted-foreground">
      <span className="text-green-500">{params.data.completedRides}</span>
      <span>/</span>
      <span className="text-red-500">{params.data.cancelledRides}</span>
    </div>
  </div>
);

/* Custom Cell Renderer for Rating */
const RatingRenderer = (params: { value: number }) => (
  params.value > 0 ? (
    <div className="flex items-center gap-1 justify-center">
      <Star className="h-4 w-4 text-amber-500 fill-current" />
      <span className="font-medium">{params.value}</span>
    </div>
  ) : (
    <span className="text-muted-foreground text-center block">-</span>
  )
);

/* Custom Cell Renderer for Actions */
const ActionsRenderer = (params: { data: Rider }) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/admin/riders/${params.data.id}`)}
        title="View details"
      >
        <Eye className="h-4 w-4" />
      </Button>
    </div>
  );
};

function TableView({
  isLoading,
  paginatedRiders,
}: {
  isLoading: boolean;
  paginatedRiders: Rider[];
}) {
  const gridRef = useRef<AgGridReact<Rider>>(null);
  
  // Column Definitions: Defines & controls grid columns
  const [colDefs] = useState([
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 100,
      maxWidth: 150,
      cellRenderer: (params: { value: string; data: Rider }) => (
        <div className="flex flex-col">
          <span className="font-medium">{params.value}</span>
          <span className="text-xs text-muted-foreground">
            #{params.data.id}
          </span>
        </div>
      ),
    },
    {
      field: 'emailAddress',
      headerName: 'Email',
      minWidth: 180,
      cellRenderer: EmailRenderer,
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone',
    //   minWidth:60,
    //   flex:2,
      maxWidth: 200,
      cellRenderer: PhoneRenderer,
    },
    {
      field: 'isActive',
      headerName: 'Status',
      minWidth: 50,
      maxWidth: 80,
      cellRenderer: StatusRenderer,
      suppressSizeToFit: true
    },
    {
      headerName: 'Rides',
      minWidth: 80,
      maxWidth:100,
      cellRenderer: RidesRenderer,
    },
    {
      field: 'averageRating',
      headerName: 'Rating',
      minWidth: 60,
      maxWidth: 100,
      cellRenderer: RatingRenderer,
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
  if (!paginatedRiders || paginatedRiders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="rounded-full bg-muted p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Eye className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Riders Found</h3>
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
          rowData={paginatedRiders}
        //   rowStyle={rowStyle}
          theme={myTheme}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          rowHeight={60}
          headerHeight={45}
          pagination={true}
          paginationPageSize={10}
    
        />
      </div>
    </div>
  );
}

export default TableView;