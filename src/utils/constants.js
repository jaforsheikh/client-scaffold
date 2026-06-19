export const APP_NAME = "Scaffold";

export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export const USER_ROLES = {
  DONOR: "donor",
  VOLUNTEER: "volunteer",
  ADMIN: "admin",
};

export const USER_STATUS = {
  ACTIVE: "active",
  BLOCKED: "blocked",
};

export const USER_STATUS_OPTIONS = [
  {
    label: "Active",
    value: USER_STATUS.ACTIVE,
  },
  {
    label: "Blocked",
    value: USER_STATUS.BLOCKED,
  },
];

export const DONATION_STATUS = {
  PENDING: "pending",
  INPROGRESS: "inprogress",
  DONE: "done",
  CANCELED: "canceled",
};

export const DONATION_STATUS_OPTIONS = [
  {
    label: "Pending",
    value: DONATION_STATUS.PENDING,
  },
  {
    label: "In Progress",
    value: DONATION_STATUS.INPROGRESS,
  },
  {
    label: "Done",
    value: DONATION_STATUS.DONE,
  },
  {
    label: "Canceled",
    value: DONATION_STATUS.CANCELED,
  },
];

export const DISTRICT_DATA_PATH = "/data/districts.json";
export const UPAZILA_DATA_PATH = "/data/upazilas.json";

export const DEFAULT_AVATAR =
  "https://i.ibb.co.com/4pDNDk1/avatar-placeholder.png";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  SEARCH: "/search",
  FUNDING: "/funding",
  DONATION_REQUESTS: "/donation-requests",
  DASHBOARD: "/dashboard",
  PROFILE: "/dashboard/profile",
  CREATE_REQUEST: "/dashboard/create-donation-request",
  MY_REQUESTS: "/dashboard/my-donation-requests",
  ALL_USERS: "/dashboard/all-users",
  ALL_REQUESTS: "/dashboard/all-blood-donation-request",
};