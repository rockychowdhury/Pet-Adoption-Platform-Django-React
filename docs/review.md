# Project Implementation Review (Frontend & Backend)

## Executive Summary
- Backend implements most MVP data models and endpoints across users, pets/rehoming, adopter profiles/applications, services, reviews, and admin analytics. A few controller/contract mismatches block end‑to‑end flows.
- Frontend has near-complete page coverage and polished UI, but many core screens still rely on mock data and are not wired to live APIs.
- Priority: align API contracts (messaging, applications owner query), replace mock data with real hooks, and enforce business rules (filters, moderation, scoring).

## Backend Review
**Strengths**
- Comprehensive models match the spec: `User`/`UserProfile`/`VerificationDocument`, `PetProfile`, `RehomingListing`, `RehomingIntervention`, `ListingReview`, `AdopterProfile`, `AdoptionApplication`, `AdoptionReview`, `ServiceProvider` (+ foster/vet/trainer), `ServiceReview`, `LegalAgreement`, `UserReport`, `PlatformMetrics`.
- Validation and constraints: adoption fee 0–300, readiness_score bounds, indexes on status/location/fee, unique application per pet+user.
- Admin/analytics support with moderation logging and metrics snapshots.

**Issues / Gaps**
- Messaging API mismatch: `Conversation` uses `participant_1`/`participant_2`, but `ConversationViewSet` assumes `participants` M2M and `is_group`; queryset uses `self.request.user.conversations`, which does not exist. Needs rewrite to match the model (or update the model).
- AdoptionApplicationViewSet `get_queryset` filters `pet__owner`; model uses `pet_owner`. Owners cannot see applications as written.
- Rehoming intervention is not enforced before listing creation; listing moderation side-effects not clearly coupled to `ListingReview`.
- Filter/search richness for listings and services not verified (spec expects species/age/size/traits/location/fee and service-specific filters).
- Adopter readiness scoring exists as a field but no scoring algorithm is visible.
- Review prompts/email sending and scheduled metrics tasks are stubbed.

## Frontend Review
**Strengths**
- Route coverage matches `UI.txt` (auth, pets, rehoming, applications, messaging, services, admin, legal/static). Layouts and components follow the design system.
- High-fidelity UI for My Pets, listing browse/detail, intervention, adopter profile wizard, messaging, service cards, admin dashboards, review forms.

**Issues / Gaps**
- Mock-data reliance: MyPetsPage, MessagesPage, AdopterProfileSetupPage, parts of admin dashboards, and some rehoming flows are local-state demos with no API calls.
- API wiring gaps:
  - My pets should use `/user/pets/`; rehoming browse uses `/pets/` but personal pet management does not.
  - Messaging UI is not connected to `/messaging/` endpoints (and backend endpoint needs fix).
  - Adopter profile wizard does not POST/PATCH to adopter profile API; application submit/review pages lack hooks to `/adoption/applications/`.
  - Rehoming intervention page does not call `/rehoming/intervention/`.
  - Reviews (adoption/service) likely not bound to `/reviews/` or `/services/reviews/`.
- Path consistency: some routes differ from spec (`/dashboard/pets/create` vs `/pets/new`; check redirects and links).

## Priority Fixes (Short Term)
1) **Messaging contract**: Rewrite ConversationViewSet (or model) to use participant_1/participant_2; fix querysets and start conversation logic; add unread/read endpoints; then wire frontend MessagesPage to real APIs.
2) **Applications owner visibility**: Fix `AdoptionApplicationViewSet.get_queryset` to filter on `pet__pet_owner`; add filters for owner vs applicant; expose listing-level applications list for owner review pages.
3) **Replace mock data with API hooks**:
   - MyPetsPage → `/user/pets/` CRUD; enable edit/delete/add.
   - MessagesPage → `/messaging/conversations/` + `/messages/`.
   - AdopterProfileSetupPage → adopter profile API (create/update); add view/edit page.
   - InterventionPage → `/rehoming/intervention/` create/fetch/acknowledge; gate listing creation.
4) **Review submission**: Connect adoption review and service review forms to backend endpoints with proper permission checks.
5) **Admin moderation wiring**: Use `/admin/listings/pending`, approve/reject/change endpoints; hook reports queue to `/admin/reports/`; charts to `/admin/analytics/`.

## Follow-ups (Medium Term)
- Implement adopter readiness scoring logic and surface it in applications.
- Ensure listing search filters and service search filters match the spec (species/age/size/traits/fee/location for pets; species/availability/price/services/open-now for services).
- Add email/notification flows: verification, application status, moderation decisions, review prompts.
- Add basic rate limiting and privacy enforcement (profile visibility/contact visibility) in views/serializers.
- Add tests for critical flows (auth, pets CRUD, listings create/review, applications submit/review, messaging CRUD).

## Suggested Implementation Steps
1) Backend quick fixes: messaging viewset, application queryset, add filter params for listings/services, add readiness score calculator utility.
2) Frontend data wiring: build React Query hooks for messaging, adopter profile, applications, reviews, and rehome intervention; swap mock data for live calls.
3) Moderation/admin integration: call admin endpoints for listings/reports; feed analytics charts from `/admin/analytics/`.
4) UX polish: align route paths with spec; add loading/error states and validation messages mapped from API errors.
5) Hardening: add server-side permission checks for owner/applicant roles; ensure `can_create_listing` (email+phone verified) is enforced on listing creation.

## Quick Code Notes
- `ConversationViewSet.start` currently filters on `participants`/`is_group` (not in model) → refactor to use `participant_1/participant_2` and a symmetric lookup (`Q(participant_1=u, participant_2=other) | Q(participant_2=u, participant_1=other)`).
- `AdoptionApplicationViewSet.get_queryset` should use `models.Q(applicant=user) | models.Q(pet__pet_owner=user)`.
- Frontend `MyPetsPage` should switch from static array to `useQuery` on `/user/pets/` with server-side filters (species/status).
- Frontend messaging: replace mock state with conversations/messages fetched by ID; add optimistic send + read receipts mapped to backend.
- Intervention page: POST to `/rehoming/intervention/`, use `active_intervention` to resume, and enforce acknowledgments before navigating to listing creation.

