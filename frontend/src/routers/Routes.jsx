import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePages/HomePage";
// import PetsPage from "../pages/PetPages/PetsPage"; // Replaced by PetSearchPage or similar if needed, keeping simple for now
import ErrorComponent from "../components/common/ErrorComponent";
// import GroupDetailPage from "../pages/CommunityPages/GroupDetailPage"; // Now in dedicated folder
import MessagingPage from "../pages/MessagingPages/MessagingPage"; // Keep existing if valid
import AboutPage from "../pages/AboutPages/AboutPage";
import VerifyEmailPage from "../pages/AuthPages/VerifyEmailPage";
import Navbar from "../components/common/Navbar";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthPageLayout from "../layouts/AuthPageLayout";
import AdopterDashboard from "../pages/Dashboard/AdopterDashboard";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router";

// Imported Pages
import UserProfilePage from "../pages/ProfilePages/UserProfilePage";
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
import MyPetsPage from "../pages/PetPages/MyPetsPage";
// Assuming PetsPage was the search page, let's map it to a new one or keep existing if viable.
// For now, let's assume we use a PetSearchPage, but I'll use the existing PetPages/PetsPage if it existed or create one.
// The script didn't create PetsPage, but listed MyPetsPage. I'll stick to what I created.

import RehomingLandingPage from "../pages/RehomingPages/RehomingLandingPage";
import RehomingInterventionPage from "../pages/RehomingPages/RehomingInterventionPage";
import RehomingCreateListingPage from "../pages/RehomingPages/RehomingCreateListingPage";
import RehomingListingDetailPage from "../pages/RehomingPages/RehomingListingDetailPage";
import RehomingDashboardPage from "../pages/RehomingPages/RehomingDashboardPage";
import AdoptionApplicationPage from "../pages/RehomingPages/AdoptionApplicationPage";
import ApplicationManagementPage from "../pages/RehomingPages/ApplicationManagementPage";

import ConversationListPage from "../pages/MessagingPages/ConversationListPage";
import ChatPage from "../pages/MessagingPages/ChatPage";

import AdminDashboard from "../pages/AdminPages/AdminDashboard";
import UserManagementPage from "../pages/AdminPages/UserManagementPage";
import ListingModerationPage from "../pages/AdminPages/ListingModerationPage";
import ReportManagementPage from "../pages/AdminPages/ReportManagementPage";
import AnalyticsPage from "../pages/AdminPages/AnalyticsPage";

import ServiceSearchPage from "../pages/ServicePages/ServiceSearchPage";
import ServiceDetailPage from "../pages/ServicePages/ServiceDetailPage";
import ServiceProviderRegistrationPage from "../pages/ServicePages/ServiceProviderRegistrationPage";

import CommunityFeedPage from "../pages/CommunityPages/CommunityFeedPage";
import GroupListPage from "../pages/CommunityPages/GroupListPage";
import GroupDetailPage from "../pages/CommunityPages/GroupDetailPage";
import EventListPage from "../pages/CommunityPages/EventListPage";

import TermsOfServicePage from "../pages/LegalPages/TermsOfServicePage";
import PrivacyPolicyPage from "../pages/LegalPages/PrivacyPolicyPage";
import ContactPage from "../pages/LegalPages/ContactPage";

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

const router = createBrowserRouter([
    // Public Routes
    {
        path: '/',
        element: <HomePage />,
    },
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
        path: '/forgot-password',
        element: <ForgotPasswordPage />
    },
    {
        path: '/password-reset/:uid/:token',
        element: <ResetPasswordPage />
    },
    {
        path: '/about',
        element: <><Navbar /><AboutPage /></>
    },
    {
        path: '/contact',
        element: <><Navbar /><ContactPage /></>
    },
    {
        path: '/terms',
        element: <><Navbar /><TermsOfServicePage /></>
    },
    {
        path: '/privacy',
        element: <><Navbar /><PrivacyPolicyPage /></>
    },

    // Services
    {
        path: '/services',
        element: <><Navbar /><ServiceSearchPage /></>
    },
    {
        path: '/services/:id',
        element: <><Navbar /><ServiceDetailPage /></>
    },
    {
        path: '/become-provider',
        element: <PrivateRoute><><Navbar /><ServiceProviderRegistrationPage /></></PrivateRoute>
    },

    // Community
    {
        path: '/community',
        element: <><Navbar /><CommunityFeedPage /></>
    },
    {
        path: '/groups',
        element: <><Navbar /><GroupListPage /></>
    },
    {
        path: '/groups/:id',
        element: <><Navbar /><GroupDetailPage /></>
    },
    {
        path: '/events',
        element: <><Navbar /><EventListPage /></>
    },

    // Rehoming (Public View)
    {
        path: '/rehoming', // Landing for rehoming
        element: <><Navbar /><RehomingLandingPage /></>
    },
    {
        path: '/listings/:id',
        element: <><Navbar /><RehomingListingDetailPage /></>
    },

    // Protected Routes (Dashboard & Actions)
    {
        path: '/dashboard',
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
            { path: '', element: <AdopterDashboard /> }, // Default dashboard

            // Profile
            { path: 'profile', element: <UserProfilePage /> },
            { path: 'profile/edit', element: <EditProfilePage /> },
            { path: 'verification', element: <VerificationPage /> },

            // Pets
            { path: 'my-pets', element: <MyPetsPage /> },
            { path: 'pets/create', element: <PetCreatePage /> },
            { path: 'pets/edit/:id', element: <PetEditPage /> },

            // Rehoming Actions
            { path: 'rehoming/start', element: <RehomingInterventionPage /> },
            { path: 'rehoming/create', element: <RehomingCreateListingPage /> },
            { path: 'rehoming/manage', element: <RehomingDashboardPage /> },
            { path: 'applications/manage', element: <ApplicationManagementPage /> }, // For owners
            { path: 'adopt/:listingId', element: <AdoptionApplicationPage /> }, // For adopters

            // Messaging
            { path: 'messages', element: <ConversationListPage /> },
            { path: 'messages/:id', element: <ChatPage /> },
        ]
    },

    // Public Profiles
    {
        path: '/profile/:username',
        element: <><Navbar /><PublicProfilePage /></>
    },

    // Admin Routes
    {
        path: '/admin',
        element: <AdminRoute><DashboardLayout /></AdminRoute>, // Reuse layout or create AdminLayout
        children: [
            { path: '', element: <AdminDashboard /> },
            { path: 'users', element: <UserManagementPage /> },
            { path: 'moderation', element: <ListingModerationPage /> },
            { path: 'reports', element: <ReportManagementPage /> },
            { path: 'analytics', element: <AnalyticsPage /> },
        ]
    },

    // Catch all
    {
        path: "*",
        element: <ErrorComponent />
    }
]);

export default router;
