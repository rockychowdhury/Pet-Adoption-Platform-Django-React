import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePages/HomePage";
// import PetsPage from "../pages/PetPages/PetsPage"; // Replaced by PetSearchPage or similar if needed, keeping simple for now
import ErrorComponent from "../components/common/ErrorComponent";
// import GroupDetailPage from "../pages/CommunityPages/GroupDetailPage"; // Now in dedicated folder
import MessagingPage from "../pages/MessagingPages/MessagingPage"; // Keep existing if valid
import AboutPage from "../pages/AboutPages/AboutPage";
import VerifyEmailPage from "../pages/AuthPages/VerifyEmailPage";
import VerifyPhonePage from "../pages/AuthPages/VerifyPhonePage";
import Navbar from "../components/common/Navbar";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthPageLayout from "../layouts/AuthPageLayout";
import AdopterDashboard from "../pages/Dashboard/AdopterDashboard";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router";

// Imported Pages
import UserProfilePage from "../pages/ProfilePages/UserProfilePage";
import ProfileSettingsPage from "../pages/ProfilePages/ProfileSettingsPage";
import EditProfilePage from "../pages/ProfilePages/EditProfilePage";
import PublicProfilePage from "../pages/ProfilePages/PublicProfilePage";
import VerificationPage from "../pages/ProfilePages/VerificationPage";

import ForgotPasswordPage from "../pages/AuthPages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/AuthPages/ResetPasswordPage";
import LoginPage from "../pages/AuthPages/LoginPage";
import RegisterPage from "../pages/AuthPages/RegisterPage";

import PetCreatePage from "../pages/PetPages/PetCreatePage";
import PetDetailPage from "../pages/PetPages/PetDetailPage";
import PetEditPage from "../pages/PetPages/PetEditPage";
import PetListingPage from "../pages/PetPages/PetListingPage";
import MyPetsPage from "../pages/PetPages/MyPetsPage";
// Assuming PetsPage was the search page, let's map it to a new one or keep existing if viable.
// For now, let's assume we use a PetSearchPage, but I'll use the existing PetPages/PetsPage if it existed or create one.
// The script didn't create PetsPage, but listed MyPetsPage. I'll stick to what I created.

import RehomingLandingPage from "../pages/RehomingPages/RehomingLandingPage";
import RehomingInterventionPage from "../pages/RehomingPages/RehomingInterventionPage";
import RehomingCreateListingPage from "../pages/RehomingPages/RehomingCreateListingPage";
import RehomingListingDetailPage from "../pages/RehomingPages/RehomingListingDetailPage";
import RehomingDashboardPage from "../pages/RehomingPages/RehomingDashboardPage";
import AdopterProfileSetupPage from "../pages/ApplicationPages/AdopterProfileSetupPage";
import AdopterProfilePage from "../pages/ApplicationPages/AdopterProfilePage";
import ApplicationSubmitPage from "../pages/ApplicationPages/ApplicationSubmitPage";
import MyApplicationsPage from "../pages/ApplicationPages/MyApplicationsPage";
import ApplicationDetailPage from "../pages/ApplicationPages/ApplicationDetailPage";
import OwnerApplicationReviewPage from "../pages/ApplicationPages/OwnerApplicationReviewPage";
import OwnerApplicationDetailPage from "../pages/ApplicationPages/OwnerApplicationDetailPage";

import MessagesPage from "../pages/MessagingPages/MessagesPage";

import AdminLayout from "../components/Admin/Layout/AdminLayout";
import AdminDashboard from "../pages/AdminPages/AdminDashboard";
import UserManagementPage from "../pages/AdminPages/UserManagementPage";
import UserDetailPage from "../pages/AdminPages/UserDetailPage";
import ListingModerationPage from "../pages/AdminPages/ListingModerationPage";
import ReportManagementPage from "../pages/AdminPages/ReportManagementPage";
import AnalyticsPage from "../pages/AdminPages/AnalyticsPage";

import ServiceSearchPage from "../pages/ServicePages/ServiceSearchPage";
import ServiceDetailPage from "../pages/ServicePages/ServiceDetailPage";
import ServiceReviewPage from "../pages/ServicePages/ServiceReviewPage";
import AdoptionReviewPage from "../pages/ReviewPages/AdoptionReviewPage";
import ServiceProviderRegistrationPage from "../pages/ServicePages/ServiceProviderRegistrationPage";
import NotFoundPage from "../pages/ErrorPages/NotFoundPage";
import ServerErrorPage from "../pages/ErrorPages/ServerErrorPage";
import { Outlet } from "react-router-dom";

import CommunityFeedPage from "../pages/CommunityPages/CommunityFeedPage";
import GroupListPage from "../pages/CommunityPages/GroupListPage";
import GroupDetailPage from "../pages/CommunityPages/GroupDetailPage";
import EventListPage from "../pages/CommunityPages/EventListPage";

import TermsOfServicePage from "../pages/LegalPages/TermsOfServicePage";
import PrivacyPolicyPage from "../pages/LegalPages/PrivacyPolicyPage";
import ContactPage from "../pages/LegalPages/ContactPage";
import HowItWorksPage from "../pages/AboutPages/HowItWorksPage";
import FAQPage from "../pages/AboutPages/FAQPage";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    // Mock admin check: user?.role === 'admin'
    return user ? children : <Navigate to="/login" />;
};

// Main Layout Wrapper for Public Pages
import MainLayout from "../layouts/MainLayout";

const routes = [
    // Public Routes (Home manages its own layout)
    {
        path: '/',
        element: <HomePage />,
    },

    // Auth Routes
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/register',
        element: <RegisterPage />
    },
    {
        path: '/verify-email',
        element: <VerifyEmailPage />
    },
    {
        path: '/verify-phone',
        element: <VerifyPhonePage />
    },
    {
        path: '/forgot-password',
        element: <ForgotPasswordPage />
    },
    {
        path: '/password-reset/:uid/:token',
        element: <ResetPasswordPage />
    },

    // Public Pages using MainLayout
    {
        element: <MainLayout />,
        children: [
            { path: '/browse', element: <PetListingPage /> },
            { path: '/adopt', element: <PetListingPage /> },
            { path: '/rehome', element: <PetListingPage /> },
            { path: '/find-pet', element: <PetListingPage /> },
            { path: '/pets', element: <PetListingPage /> },
            { path: '/pets/:id', element: <PetDetailPage /> },

            { path: '/about', element: <AboutPage /> },
            { path: '/contact', element: <ContactPage /> },
            { path: '/how-it-works', element: <HowItWorksPage /> },
            { path: '/faq', element: <FAQPage /> },
            { path: '/terms', element: <TermsOfServicePage /> },
            { path: '/privacy', element: <PrivacyPolicyPage /> },

            // Service Provider Routes
            { path: '/services', element: <ServiceSearchPage /> },
            { path: '/services/foster', element: <ServiceSearchPage /> },
            { path: '/services/vet', element: <ServiceSearchPage /> },
            { path: '/services/foster/:id', element: <ServiceDetailPage /> },
            { path: '/services/vet/:id', element: <ServiceDetailPage /> },
            { path: '/services/:type/:id', element: <ServiceDetailPage /> },

            // Community
            { path: '/community', element: <CommunityFeedPage /> },
            { path: '/groups', element: <GroupListPage /> },
            { path: '/groups/:id', element: <GroupDetailPage /> },
            { path: '/events', element: <EventListPage /> },

            // Rehoming
            { path: '/rehoming', element: <RehomingLandingPage /> },
            { path: '/listings/:id', element: <RehomingListingDetailPage /> },

            // Public Profiles
            { path: '/profile/:username', element: <PublicProfilePage /> },
        ]
    },

    // Protected Routes needing Navbar + Padding (Wrapped in PrivateRoute + MainLayout or similar)
    // Actually, Dashboard has its own layout. These are standalone protected pages.
    // If they were using <Navbar />, they should probably use MainLayout too, but wrapped in PrivateRoute.
    {
        element: <PrivateRoute><MainLayout /></PrivateRoute>,
        children: [
            { path: '/services/:id/review', element: <ServiceReviewPage /> },
            { path: '/adoptions/:id/review', element: <AdoptionReviewPage /> },
            { path: '/become-provider', element: <ServiceProviderRegistrationPage /> },

            { path: '/applications/setup', element: <AdopterProfileSetupPage /> },
            { path: '/applications/profile', element: <AdopterProfilePage /> },
            { path: '/rehoming/listings/:id/apply', element: <ApplicationSubmitPage /> },
            { path: '/applications', element: <MyApplicationsPage /> },
            { path: '/applications/:id', element: <ApplicationDetailPage /> },
            { path: '/rehoming/listings/:id/applications', element: <OwnerApplicationReviewPage /> },
            { path: '/applications/:id/review', element: <OwnerApplicationDetailPage /> },

            // Messaging
            { path: '/messages', element: <MessagesPage /> },
            { path: '/messages/:id', element: <MessagesPage /> },
        ]
    },

    // Protected Routes (Dashboard)
    {
        path: '/dashboard',
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
            { path: '', element: <UserProfilePage /> }, // Dashboard Home -> User Profile
            { path: 'applications', element: <AdopterDashboard /> },
            { path: 'profile', element: <UserProfilePage /> },
            { path: 'profile/settings', element: <ProfileSettingsPage /> },
            { path: 'profile/edit', element: <EditProfilePage /> },
            { path: 'verification', element: <VerificationPage /> },
            { path: 'my-pets', element: <MyPetsPage /> },
            { path: 'pets/create', element: <PetCreatePage /> },
            { path: 'pets/edit/:id', element: <PetEditPage /> },
            { path: 'rehoming/start', element: <RehomingInterventionPage /> },
            { path: 'rehoming/create', element: <RehomingCreateListingPage /> },
            { path: 'rehoming/manage', element: <RehomingDashboardPage /> },
            { path: 'reviews', element: <div className="p-8"><h1 className="text-2xl font-bold mb-2">Reviews</h1><p className="text-text-secondary">Your reviews dashboard is coming soon.</p></div> },
        ]
    },

    // Admin Routes
    {
        path: '/admin',
        element: <PrivateRoute><AdminLayout /></PrivateRoute>,
        children: [
            { index: true, element: <AdminDashboard /> },
            { path: 'users', element: <UserManagementPage /> },
            { path: 'users/:id', element: <UserDetailPage /> },
            { path: 'moderation', element: <ListingModerationPage /> },
            { path: 'reports', element: <ReportManagementPage /> },
            { path: 'analytics', element: <AnalyticsPage /> },
        ]
    },
    // Catch all - Wrapped in MainLayout to include Navbar as shown in design
    {
        element: <MainLayout />,
        children: [
            { path: "*", element: <NotFoundPage /> }
        ]
    }
];

const router = createBrowserRouter([
    {
        element: <Outlet />,
        errorElement: <ServerErrorPage />,
        children: routes
    }
]);

export default router;
