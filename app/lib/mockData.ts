// Generate realistic mock data for the admin dashboard

export interface Rider {
  id: string;
  name: string;
  phoneNumber: string;
  emailAddress: string;
  gender: "Male" | "Female";
  isActive: "1" | "0";
  isPhoneVerified: "1" | "0";
  isEmailVerified: "1" | "0";
  createdAt: string;
  updatedAt: string;
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  averageRating: number;
}

export interface Driver {
  id: string;
  name: string;
  phoneNumber: string;
  emailAddress: string;
  gender: "Male" | "Female" | "Other";
  isActive: "0" | "1"; // "1" for Active, "0" for Inactive
  isPhoneVerified: "0" | "1";
  isEmailVerified: "0" | "1";
  vehicleType: string;
  vehicleColor: string;
  licensePlate: string;
  isOnline: "0" | "1"; // "1" for Online, "0" for Offline
  isAvailable: "0" | "1"; // "1" for Available, "0" for Unavailable
  lastOnline: string; // ISO date string
  currentLat: string;
  currentLng: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  averageRating: number;
  totalEarnings: number;
}

export interface Trip {
  rideId: string;
  rideType: "Instant" | "Scheduled";
  driverName: string;
  driverPhone: string;
  driverVehicleNumber: string;
  riderName: string;
  riderEmail:string;
  riderPhone: string;
  pickupAddress: string;
  dropoffAddress: string;
  rideStatus: string;
finalFare:number;
expectedEarning:number;
serviceCharge:number;
createdAt:string;
  tripDate: string;
  paymentStatus: "Paid" | "Pending" | "Failed";
  // driverEarnings: number;
  paymentMethod: "Card" | "Cash" | "Wallet";
  paymentChannel: string;
 
}


export interface ForumUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Rider" | "Driver" | "Forum-only";
  communitiesJoined: number;
  postsCount: number;
  signupDate: string;
}

export interface ForumPost {
  id: string;
  communityName: string;
  authorName: string;
  createdDate: string;
  likes: number;
  comments: number;
  shares: number;
  title: string;
}

export interface PayoutDriver {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  amountOwed: number;
  tripCount: number;
  lastTripDate: string;
  rideIds: number[];
}

export interface PaymentHistoryType {
  driverId: string;
  driverName: string;
  amount: number;
  markedAt: string;
  payoutId:string;
  payoutReference: string;
  status: string;
}

export interface DashboardData {
  status: number;
  error: boolean;
  message: string;
  data: {
    metadata: {
      period: number;
      periodLabel: string;
    };
    overview: {
      riders: {
        total: number;
        recent: number;
      };
      drivers: {
        total: number;
        recent: number;
      };
      rides: {
        total: number;
        recent: number;
      };
      users: {
        total: number;
        recent: number;
      };
    };
    trends: Array<{
      date: string;
      label: string;
      riders: number;
      drivers: number;
    }>;
  };
}