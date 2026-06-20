# Scaffold - Blood Donor Organization

Scaffold is a full-featured blood donor organization web application built with React, Firebase Authentication, role-based dashboard access, donor search, donation request management, and Stripe-ready funding support.

## Live Links

- Client Live Site: Add your live client link here
- Server Live Site: Add your live server link here
- Client Repository: Add your client GitHub repository link here
- Server Repository: Add your server GitHub repository link here

## Admin Credentials

- Email: admin@scaffold.com
- Password: Admin123

## Volunteer Credentials

- Email: volunteer@scaffold.com
- Password: Volunteer123

## Project Purpose

The purpose of Scaffold is to help people find blood donors faster during emergency situations. Users can register as donors, search donors by blood group and location, create blood donation requests, manage their own requests, and support the organization through a funding system.

## Core Features

- Firebase email and password authentication.
- Role-based dashboard for donor, volunteer, and admin.
- Donor registration with blood group, district, upazila, and avatar information.
- Public donor search by blood group, district, and upazila.
- Public pending donation request listing.
- Private donation request details page with donate confirmation modal.
- Donor dashboard with profile update system.
- Donor can create, view, edit, delete, filter, and manage own donation requests.
- Blocked users cannot create donation requests.
- Volunteer can view all blood donation requests and update request status.
- Admin can manage all users, block or unblock users, and make volunteer or admin.
- Admin can view all donation requests, update status, and delete requests.
- Private funding page with funding history table and Stripe Elements UI.
- Responsive layout for desktop, tablet, and mobile.
- Clean 404 not found page.

## User Roles

### Donor

- Can view and update profile.
- Can create donation request if account status is active.
- Can manage own donation requests.
- Can mark in-progress request as done or canceled.
- Can access private funding page.

### Volunteer

- Can view profile.
- Can view all blood donation requests.
- Can update donation request status.
- Cannot delete donation requests.
- Can access private funding page.

### Admin

- Can view profile.
- Can manage all users.
- Can block or unblock users.
- Can make users volunteer or admin.
- Can view all donation requests.
- Can update request status.
- Can delete donation requests.
- Can access private funding page.

## Main Routes

### Public Routes

- `/`
- `/donation-requests`
- `/search`
- `/login`
- `/register`

### Private Routes

- `/funding`
- `/donation-requests/:id`
- `/dashboard`
- `/dashboard/profile`
- `/dashboard/create-donation-request`
- `/dashboard/my-donation-requests`
- `/dashboard/update-donation-request/:id`

### Volunteer/Admin Routes

- `/dashboard/all-blood-donation-request`

### Admin Routes

- `/dashboard/all-users`

## Technologies Used

- React 18
- Vite
- React Router DOM
- Tailwind CSS
- daisyUI
- Firebase Authentication
- React Hook Form
- TanStack Query
- Axios
- Recharts
- Stripe React Stripe JS
- React Hot Toast
- SweetAlert2

## Environment Variables

Create a `.env.local` file in the root of the client project and add the following variables:

```env
