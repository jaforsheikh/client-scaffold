export const dashboardStats = [
  {
    id: 1,
    label: "Total Requests",
    value: 128,
    note: "Donation requests created",
    icon: "assignment",
    tone: "primary",
  },
  {
    id: 2,
    label: "Pending",
    value: 36,
    note: "Need donor response",
    icon: "pending_actions",
    tone: "warning",
  },
  {
    id: 3,
    label: "In Progress",
    value: 18,
    note: "Currently being handled",
    icon: "sync",
    tone: "teal",
  },
  {
    id: 4,
    label: "Completed",
    value: 74,
    note: "Successful donations",
    icon: "task_alt",
    tone: "success",
  },
];

export const recentDonationRequests = [
  {
    id: "REQ-1001",
    requesterName: "Nusrat Jahan",
    recipientName: "Arif Hossain",
    bloodGroup: "A+",
    district: "Dhaka",
    upazila: "Dhanmondi",
    hospitalName: "Popular Medical College Hospital",
    donationDate: "2026-06-20",
    donationTime: "10:30 AM",
    status: "pending",
  },
  {
    id: "REQ-1002",
    requesterName: "Mehedi Hasan",
    recipientName: "Tanvir Ahmed",
    bloodGroup: "O-",
    district: "Chattogram",
    upazila: "Panchlaish",
    hospitalName: "Chattogram Medical College Hospital",
    donationDate: "2026-06-21",
    donationTime: "02:00 PM",
    status: "inprogress",
  },
  {
    id: "REQ-1003",
    requesterName: "Sadia Rahman",
    recipientName: "Mim Akter",
    bloodGroup: "B+",
    district: "Sylhet",
    upazila: "Sylhet Sadar",
    hospitalName: "MAG Osmani Medical College Hospital",
    donationDate: "2026-06-22",
    donationTime: "11:00 AM",
    status: "done",
  },
];

export const bloodGroupOverview = [
  { group: "A+", donors: 42, requests: 18 },
  { group: "A-", donors: 12, requests: 7 },
  { group: "B+", donors: 38, requests: 15 },
  { group: "B-", donors: 10, requests: 5 },
  { group: "AB+", donors: 18, requests: 8 },
  { group: "AB-", donors: 6, requests: 3 },
  { group: "O+", donors: 56, requests: 22 },
  { group: "O-", donors: 9, requests: 6 },
];

export const donationTrendData = [
  { month: "Jan", requests: 18, completed: 12 },
  { month: "Feb", requests: 24, completed: 16 },
  { month: "Mar", requests: 31, completed: 22 },
  { month: "Apr", requests: 27, completed: 19 },
  { month: "May", requests: 36, completed: 28 },
  { month: "Jun", requests: 42, completed: 31 },
];

export const dashboardTips = [
  {
    id: 1,
    icon: "verified_user",
    title: "Keep your profile updated",
    description:
      "Accurate district, upazila, phone number and blood group help requesters find the right donor faster.",
  },
  {
    id: 2,
    icon: "schedule",
    title: "Respond quickly",
    description:
      "Fast response can make a big difference during urgent blood donation situations.",
  },
  {
    id: 3,
    icon: "health_and_safety",
    title: "Donate responsibly",
    description:
      "Only accept donation requests when you are physically fit and eligible to donate.",
  },
];