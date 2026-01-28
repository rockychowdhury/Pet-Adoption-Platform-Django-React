import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import useAuth from "../hooks/useAuth";
import PrivateRoute, { AdminRoute, ServiceProviderRoute } from './PrivateRoute';

// Layouts
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminLayout from "../components/Admin/Layout/AdminLayout";

// Home & Error
import HomePage from "../pages/HomePages/HomePage";
import NotFoundPage from "../pages/ErrorPages/NotFoundPage";
import ServerErrorPage from "../pages/ErrorPages/ServerErrorPage";

// Auth Pages
import LoginPage from "../pages/AuthPages/LoginPage";
import RegisterPage from "../pages/AuthPages/RegisterPage";
import VerifyEmailPage from "../pages/AuthPages/VerifyEmailPage";
import ForgotPasswordPage from "../pages/AuthPages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/AuthPages/ResetPasswordPage";

// Public Pages (Static)
import AboutPage from "../pages/AboutPages/AboutPage";
import ContactPage from "../pages/LegalPages/ContactPage";
import HowItWorksPage from "../pages/AboutPages/HowItWorksPage";
import FAQPage from "../pages/AboutPages/FAQPage";
import TermsOfServicePage from "../pages/LegalPages/TermsOfServicePage";
import PrivacyPolicyPage from "../pages/LegalPages/PrivacyPolicyPage";

// Feature Pages
import PetListingPage from "../pages/PetPages/PetListingPage";
import PetDetailPage from "../pages/PetPages/PetDetailPage";
import PublicProfilePage from "../pages/ProfilePages/PublicProfilePage";

// Services
import ServiceSearchPage from "../pages/ServicePages/ServiceSearchPage";
import ServiceDetailPage from "../pages/ServicePages/ServiceDetailPage";
import ServiceReviewPage from "../pages/ServicePages/ServiceReviewPage";
import ServiceProviderRegistrationPage from "../pages/ServicePages/ServiceProviderRegistrationPage";
import ProviderDashboardPage from "../pages/ServicePages/ProviderDashboardPage";

// Rehoming
import RehomingFlowLayout from "../layouts/RehomingFlowLayout";
import RehomingPetSelectionPage from '../pages/RehomingPages/RehomingPetSelectionPage';
import RehomingSituationPage from "../pages/RehomingPages/RehomingSituationPage";
import RehomingDetailsPage from "../pages/RehomingPages/RehomingDetailsPage";
import RehomingReviewPage from "../pages/RehomingPages/RehomingReviewPage";
import RehomingListingDetailPage from "../pages/RehomingPages/RehomingListingDetailPage";
import RehomingDashboardPage from "../pages/RehomingPages/RehomingDashboardPage";
// import RehomingRequestPage removed

// Applications & Reviews
// Applications & Reviews
// import AdoptionProfileSetupPage removed
import AdoptionProfilePage from "../pages/ApplicationPages/AdoptionProfilePage";
import ApplicationSubmitPage from "../pages/ApplicationPages/ApplicationSubmitPage";
import MyApplicationsPage from "../pages/ApplicationPages/MyApplicationsPage";
import ApplicationDetailPage from "../pages/ApplicationPages/ApplicationDetailPage";
import OwnerApplicationReviewPage from "../pages/ApplicationPages/OwnerApplicationReviewPage";
import OwnerApplicationDetailPage from "../pages/ApplicationPages/OwnerApplicationDetailPage";
import AdoptionReviewPage from "../pages/ReviewPages/AdoptionReviewPage";
import AIApplicationPage from "../pages/ApplicationPages/AIApplicationPage";
import ApplicationMailboxPage from "../pages/ApplicationPages/ApplicationMailboxPage";

// Messages - Removed

// Dashboard (User)
import UserDashboardOverview from "../pages/Dashboard/UserDashboardOverview";
import UserProfilePage from "../pages/ProfilePages/UserProfilePage";
import EditProfilePage from "../pages/ProfilePages/EditProfilePage";
import ProfileSettingsPage from "../pages/ProfilePages/ProfileSettingsPage";
import VerificationPage from "../pages/ProfilePages/VerificationPage";
import MyPetsPage from "../pages/PetPages/MyPetsPage";
import AddPetPage from "../pages/PetPages/AddPetPage";

// Admin
import AdminDashboard from "../pages/AdminPages/AdminDashboard";
import UserManagementPage from "../pages/AdminPages/UserManagementPage";
import UserDetailPage from "../pages/AdminPages/UserDetailPage";
import ListingModerationPage from "../pages/AdminPages/ListingModerationPage";
import ReportManagementPage from "../pages/AdminPages/ReportManagementPage";
import AnalyticsPage from "../pages/AdminPages/AnalyticsPage";
import RoleRequestsPage from "../pages/AdminPages/RoleRequestsPage";

// --- Guards imported from PrivateRoute.jsx ---


// --- Router ---

const router = createBrowserRouter([
    {
        element: <Outlet />,
        errorElement: <ServerErrorPage />,
        children: [
            /* =======================
               PUBLIC (NO AUTH)
            ======================== */
            { path: "/", element: <HomePage /> },

            { path: "/login", element: <LoginPage /> },
            { path: "/register", element: <RegisterPage /> },
            { path: "/verify-email", element: <VerifyEmailPage /> },
            { path: "/forgot-password", element: <ForgotPasswordPage /> },
            { path: "/password-reset/:uid/:token", element: <ResetPasswordPage /> },

            /* =======================
               PUBLIC SITE (MainLayout)
            ======================== */
            {
                element: <MainLayout />,
                children: [
                    /* Pets */
                    { path: "/pets", element: <PetListingPage /> },
                    { path: "/pets/:id", element: <PetDetailPage /> },

                    /* SEO aliases → redirect */
                    { path: "/browse", element: <Navigate to="/pets" replace /> },
                    { path: "/adopt", element: <Navigate to="/pets" replace /> },
                    { path: "/find-pet", element: <Navigate to="/pets" replace /> },

                    /* Rehoming - Authenticated only now */
                    { path: "/rehoming/listings/:id", element: <RehomingListingDetailPage /> },

                    /* Services */
                    { path: "/services", element: <ServiceSearchPage /> },
                    { path: "/services/:id", element: <ServiceDetailPage /> },

                    /* Static */
                    { path: "/about", element: <AboutPage /> },
                    { path: "/contact", element: <ContactPage /> },
                    { path: "/how-it-works", element: <HowItWorksPage /> },
                    { path: "/faq", element: <FAQPage /> },
                    { path: "/terms", element: <TermsOfServicePage /> },
                    { path: "/privacy", element: <PrivacyPolicyPage /> },

                    /* Public profile */
                    { path: "/profile/:username", element: <PublicProfilePage /> },
                ],
            },

            /* =======================
               AUTHENTICATED (NON-DASHBOARD)
            ======================== */
            {
                element: (
                    <PrivateRoute>
                        <MainLayout />
                    </PrivateRoute>
                ),
                children: [
                    { path: "/services/:id/review", element: <ServiceReviewPage /> },
                    { path: "/adoptions/:id/review", element: <AdoptionReviewPage /> },

                    /* Rehoming flow */
                    {
                        path: "/rehoming",
                        element: <RehomingFlowLayout />,
                        children: [
                            { index: true, element: <Navigate to="select-pet" replace /> },
                            { path: "select-pet", element: <RehomingPetSelectionPage /> },

                            /* Split Form Steps */
                            { path: "situation", element: <RehomingSituationPage /> },
                            { path: "details", element: <RehomingDetailsPage /> },
                            { path: "review", element: <RehomingReviewPage /> },
                        ]
                    },

                    /* Applications */
                    { path: "/applications", element: <MyApplicationsPage /> },
                    { path: "/applications/:id", element: <ApplicationDetailPage /> },
                    { path: "/applications/profile", element: <AdoptionProfilePage /> }, // Setup removed
                    { path: "/rehoming/listings/:id/inquiry", element: <ApplicationMailboxPage /> }, // Replaced apply
                    { path: "/rehoming/listings/:id/apply-ai", element: <AIApplicationPage /> },
                    { path: "/rehoming/listings/:id/applications", element: <OwnerApplicationReviewPage /> },
                    { path: "/applications/:id/review", element: <OwnerApplicationDetailPage /> },

                    { path: "/become-provider", element: <ServiceProviderRegistrationPage /> },
                ],
            },

            /* =======================
               SERVICE PROVIDER ROUTES
            ======================== */
            {
                element: (
                    <ServiceProviderRoute>
                        <MainLayout />
                    </ServiceProviderRoute>
                ),
                children: [
                    { path: "/provider/dashboard", element: <ProviderDashboardPage /> },
                ],
            },

            /* =======================
               USER DASHBOARD
            ======================== */
            {
                path: "/dashboard",
                element: (
                    <PrivateRoute>
                        <DashboardLayout />
                    </PrivateRoute>
                ),
                children: [
                    { index: true, element: <UserDashboardOverview /> },

                    /* Profile */
                    { path: "profile", element: <UserProfilePage /> },
                    { path: "profile/edit", element: <EditProfilePage /> },
                    { path: "profile/settings", element: <ProfileSettingsPage /> },
                    { path: "verification", element: <VerificationPage /> },

                    /* Pets */
                    { path: "my-pets", element: <MyPetsPage /> },
                    { path: "pets/create", element: <AddPetPage /> },
                    { path: "pets/:id/edit", element: <AddPetPage /> },

                    /* Rehoming */
                    { path: "rehoming", element: <RehomingDashboardPage /> },

                    /* Applications */
                    { path: "applications", element: <MyApplicationsPage /> },
                    { path: "applications/:id", element: <ApplicationDetailPage /> },

                    /* Reviews placeholder */
                    {
                        path: "reviews",
                        element: (
                            <div className="p-8">
                                <h1 className="text-2xl font-bold">Reviews</h1>
                                <p className="text-text-secondary">Coming soon.</p>
                            </div>
                        ),
                    },
                ],
            },

            /* =======================
               ADMIN
            ======================== */
            {
                path: "/admin",
                element: (
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                ),
                children: [
                    { index: true, element: <AdminDashboard /> },
                    { path: "role-requests", element: <RoleRequestsPage /> },
                    { path: "users", element: <UserManagementPage /> },
                    { path: "users/:id", element: <UserDetailPage /> },
                    { path: "moderation", element: <ListingModerationPage /> },
                    { path: "reports", element: <ReportManagementPage /> },
                    { path: "analytics", element: <AnalyticsPage /> },
                ],
            },

            /* =======================
               404
            ======================== */
            {
                element: <MainLayout />,
                children: [{ path: "*", element: <NotFoundPage /> }],
            },
        ],
    },
]);

export default router;
