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
  email: string;
  phone: string;
  bankName: string;
  accountNumber: string;
  signupDate: string;
  totalTrips: number;
  totalEarnings: number;
  status: "Active" | "Inactive";
  address: string;
}

export interface Trip {
  id: string;
  rideType: "Instant" | "Scheduled";
  tripDate: string;
  riderName: string;
  driverName: string;
  paymentStatus: "Paid" | "Pending" | "Failed";
  driverEarnings: number;
  paymentMethod: "Card" | "Cash" | "Wallet";
  from: string;
  to: string;
  fare: number;
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
}

export interface PaymentHistory {
  id: string;
  driverName: string;
  amountPaid: number;
  paymentDate: string;
  reference: string;
  status: "Completed" | "Processing";
}

const firstNames = ["John", "Jane", "Michael", "Sarah", "David", "Emily", "James", "Emma", "Robert", "Olivia", "William", "Ava", "Daniel", "Sophia", "Joseph", "Isabella", "Charles", "Mia", "Thomas", "Charlotte"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee"];
const cities = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Benin City", "Kaduna", "Enugu", "Abeokuta", "Owerri"];
const banks = ["GTBank", "Access Bank", "First Bank", "UBA", "Zenith Bank", "Stanbic IBTC", "Fidelity Bank", "FCMB", "Union Bank", "Ecobank"];
const communities = ["Riders Hub", "Driver's Den", "Tech Talk", "Safety First", "City Routes", "Night Shift", "Weekend Warriors", "News & Updates"];

function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function randomDateTime(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().replace('T', ' ').substring(0, 16);
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRiders(count: number): Rider[] {
  const riders: Rider[] = [];
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 180 * 24 * 60 * 60 * 1000); // 6 months ago

  for (let i = 0; i < count; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const totalRides = randomNumber(0, 100);
    const completedRides = Math.floor(totalRides * (0.7 + Math.random() * 0.25));
    const cancelledRides = totalRides - completedRides;
    const createdAt = randomDateTime(startDate, endDate);
    
    riders.push({
      id: String(i + 1),
      name: `${firstName} ${lastName}`,
      phoneNumber: `234${randomNumber(800, 909)}${randomNumber(100, 999)}${randomNumber(1000, 9999)}`,
      emailAddress: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      gender: Math.random() > 0.5 ? "Male" : "Female",
      isActive: Math.random() > 0.1 ? "1" : "0",
      isPhoneVerified: Math.random() > 0.2 ? "1" : "0",
      isEmailVerified: Math.random() > 0.4 ? "1" : "0",
      createdAt,
      updatedAt: createdAt,
      totalRides,
      completedRides,
      cancelledRides,
      averageRating: totalRides > 0 ? Math.round((3 + Math.random() * 2) * 10) / 10 : 0,
    });
  }

  return riders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function generateDrivers(count: number): Driver[] {
  const drivers: Driver[] = [];
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 180 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const totalTrips = randomNumber(1, 200);
    
    drivers.push({
      id: `D${String(i + 1).padStart(4, '0')}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `+234 ${randomNumber(800, 909)} ${randomNumber(100, 999)} ${randomNumber(1000, 9999)}`,
      bankName: randomElement(banks),
      accountNumber: String(randomNumber(1000000000, 9999999999)),
      signupDate: randomDate(startDate, endDate),
      totalTrips,
      totalEarnings: totalTrips * randomNumber(600, 2500),
      status: Math.random() > 0.15 ? "Active" : "Inactive",
      address: `${randomElement(cities)}, Nigeria`,
    });
  }

  return drivers.sort((a, b) => new Date(b.signupDate).getTime() - new Date(a.signupDate).getTime());
}

export function generateTrips(count: number, riders: Rider[], drivers: Driver[]): Trip[] {
  const trips: Trip[] = [];
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    const fare = randomNumber(500, 5000);
    
    trips.push({
      id: `T${String(i + 1).padStart(5, '0')}`,
      rideType: Math.random() > 0.2 ? "Instant" : "Scheduled",
      tripDate: randomDateTime(startDate, endDate),
      riderName: randomElement(riders).name,
      driverName: randomElement(drivers).name,
      paymentStatus: Math.random() > 0.05 ? "Paid" : Math.random() > 0.5 ? "Pending" : "Failed",
      driverEarnings: Math.floor(fare * 0.75),
      paymentMethod: randomElement(["Card", "Cash", "Wallet"] as const),
      from: `${randomElement(cities)} Area`,
      to: `${randomElement(cities)} District`,
      fare,
    });
  }

  return trips.sort((a, b) => new Date(b.tripDate).getTime() - new Date(a.tripDate).getTime());
}

export function generateForumUsers(count: number): ForumUser[] {
  const users: ForumUser[] = [];
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 180 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    
    users.push({
      id: `F${String(i + 1).padStart(4, '0')}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `+234 ${randomNumber(800, 909)} ${randomNumber(100, 999)} ${randomNumber(1000, 9999)}`,
      role: randomElement(["Rider", "Driver", "Forum-only"] as const),
      communitiesJoined: randomNumber(1, 5),
      postsCount: randomNumber(0, 50),
      signupDate: randomDate(startDate, endDate),
    });
  }

  return users.sort((a, b) => new Date(b.signupDate).getTime() - new Date(a.signupDate).getTime());
}

export function generateForumPosts(count: number, forumUsers: ForumUser[]): ForumPost[] {
  const posts: ForumPost[] = [];
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 60 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    posts.push({
      id: `P${String(i + 1).padStart(5, '0')}`,
      communityName: randomElement(communities),
      authorName: randomElement(forumUsers).name,
      createdDate: randomDateTime(startDate, endDate),
      likes: randomNumber(0, 100),
      comments: randomNumber(0, 50),
      shares: randomNumber(0, 30),
      title: `Post about ${randomElement(["safety tips", "best routes", "app features", "driver experience", "rider feedback", "community events"])}`,
    });
  }

  return posts.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
}

export function generatePayoutDrivers(drivers: Driver[]): PayoutDriver[] {
  const payoutDrivers: PayoutDriver[] = [];
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Select random drivers who are owed money
  const selectedDrivers = drivers.filter(() => Math.random() > 0.7).slice(0, 15);

  selectedDrivers.forEach((driver) => {
    const tripCount = randomNumber(5, 30);
    payoutDrivers.push({
      id: driver.id,
      name: driver.name,
      bankName: driver.bankName,
      accountNumber: driver.accountNumber,
      amountOwed: tripCount * randomNumber(600, 2500),
      tripCount,
      lastTripDate: randomDate(startDate, endDate),
    });
  });

  return payoutDrivers;
}

export function generatePaymentHistory(count: number): PaymentHistory[] {
  const history: PaymentHistory[] = [];
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    
    history.push({
      id: `PH${String(i + 1).padStart(4, '0')}`,
      driverName: `${firstName} ${lastName}`,
      amountPaid: randomNumber(10000, 100000),
      paymentDate: randomDate(startDate, endDate),
      reference: `TXN${randomNumber(100000, 999999)}`,
      status: Math.random() > 0.1 ? "Completed" : "Processing",
    });
  }

  return history.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
}

// Generate initial data
export const mockRiders = generateRiders(150);
export const mockDrivers = generateDrivers(80);
export const mockTrips = generateTrips(500, mockRiders, mockDrivers);
export const mockForumUsers = generateForumUsers(120);
export const mockForumPosts = generateForumPosts(200, mockForumUsers);
export const mockPayoutDrivers = generatePayoutDrivers(mockDrivers);
export const mockPaymentHistory = generatePaymentHistory(25);

// Calculate overview metrics based on date range
export function calculateMetrics(days: number) {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

  const ridersInRange = mockRiders.filter(r => new Date(r.createdAt) >= startDate).length;
  const driversInRange = mockDrivers.filter(d => new Date(d.signupDate) >= startDate).length;
  const tripsInRange = mockTrips.filter(t => new Date(t.tripDate) >= startDate).length;
  const forumUsersInRange = mockForumUsers.filter(u => new Date(u.signupDate) >= startDate).length;

  return {
    totalRiders: ridersInRange,
    totalDrivers: driversInRange,
    totalTrips: tripsInRange,
    totalForumUsers: forumUsersInRange,
  };
}

// Generate chart data based on date range
export function generateChartData(days: number) {
  const data = [];
  const endDate = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(endDate.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    
    const ridersCount = mockRiders.filter(r => r.createdAt.split(' ')[0] === dateStr).length;
    const driversCount = mockDrivers.filter(d => d.signupDate === dateStr).length;
    
    data.push({
      date: i === 0 ? 'Today' : i === 1 ? 'Yesterday' : date.toLocaleDateString('en-US', { weekday: 'short' }),
      riders: ridersCount,
      drivers: driversCount,
    });
  }
  
  return data;
}
