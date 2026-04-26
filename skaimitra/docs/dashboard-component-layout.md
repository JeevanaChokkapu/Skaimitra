# Dashboard Component Layout

This file is a quick map for anyone opening the frontend for the first time. It explains where each dashboard starts, which component folders support it, and how the pieces are connected.

## Frontend Framework And UI Stack

This UI is built with a React + TypeScript + Vite stack.

Core framework:

- `React 19`: component framework used for all dashboard screens and reusable UI pieces.
- `React DOM`: renders the React app into the browser.
- `TypeScript`: adds typed props, form models, dashboard records, and API response types.
- `Vite`: local dev server and production build tool.
- `@vitejs/plugin-react`: Vite plugin that enables React support and fast refresh.

Routing:

- `react-router-dom`: handles app routes such as `/admin`, `/teacher`, `/student`, and `/parent`.
- `src/App.tsx` is the route map for the frontend.

Styling approach:

- The project mainly uses plain CSS files, not Tailwind or Bootstrap.
- `src/pages/role-dashboard.css` holds most dashboard layout and component styling.
- `src/pages/Dashboard.css` styles the older/simple dashboard placeholder pages.
- `src/index.css` and `src/App.css` hold global/base styles.
- Component JSX uses class names such as `role-*`, `admin-*`, `teacher-*`, `student-*`, `planner-*`, and `course-calendar-*`.

UI component approach:

- `src/components/ui` contains reusable low-level UI primitives such as buttons, dialogs, drawers, forms, inputs, selects, tabs, tables, tooltips, and toasts.
- `src/components/dashboard` contains reusable dashboard widgets shared across role dashboards.
- `src/components/admin` contains admin-only dashboard components.
- Icons come from `lucide-react`.

Feature libraries:

- `recharts`: charts and analytics visuals, mainly in the teacher reports/dashboard sections.
- `jspdf`: PDF/export support for teacher-generated content.
- `firebase`: Firebase setup and auth integration through `src/lib/firebase.ts`.

Development tooling:

- `eslint`: linting.
- `typescript-eslint`: TypeScript-aware ESLint support.
- `eslint-plugin-react-hooks`: React hooks lint rules.
- `eslint-plugin-react-refresh`: React fast-refresh lint support.

Package scripts:

- `npm run dev`: starts the Vite development server.
- `npm run build`: runs TypeScript build checks and creates the Vite production build.
- `npm run lint`: runs ESLint.
- `npm run preview`: previews the production build locally.

## Entry Points

- `src/main.tsx` mounts the React app.
- `src/App.tsx` defines the main routes:
  - `/` -> `src/pages/LoginPage.tsx`
  - `/admin` -> `src/pages/admin/AdminDashboard.tsx`
  - `/teacher` -> `src/pages/teacher/TeacherDashboard.tsx`
  - `/student` -> `src/pages/student/StudentDashboard.tsx`
  - `/parent` -> `src/pages/parent/ParentDashboard.tsx`
- `src/pages/role-dashboard.css` contains most shared styling for admin, teacher, and student dashboards.
- `src/pages/Dashboard.css` styles the simple placeholder dashboard screens.

## Folder Responsibilities

```text
src/
  pages/
    admin/      Route-level admin dashboard page.
    teacher/    Route-level teacher dashboard page.
    student/    Route-level student dashboard page.
    parent/     Route-level parent placeholder page.
  components/
    admin/      Admin-only profile, user, role, teacher, student, and theme components.
    dashboard/  Shared dashboard widgets used by multiple roles.
    ui/         Reusable low-level UI primitives.
  lib/
    api.ts              Backend API helpers.
    dashboardData.ts    Local/demo dashboard data helpers.
    firebase.ts         Firebase setup.
```

## Route-Level Dashboards

### Admin Dashboard

File: `src/pages/admin/AdminDashboard.tsx`

This is the largest page. It owns admin dashboard state and switches content by the selected top tab.

Main tabs:

- `Home`: overview stats, quick actions, calendar, AI chat, and recent dashboard sections.
- `Teachers`: teacher cards, teacher profile view/edit flow, assignments, and qualifications.
- `Students`: student cards and student profile view/edit flow.
- `Users`: generic user management table and add/edit user modal.
- `Courses`, `Reports`, `Resources`: admin-facing overview sections.
- `Communications`: uses the shared `CommunicationsHub`.
- `System Settings`: school settings, theme preferences, system config placeholders, and role permissions.

Important admin component imports:

- `StudentCard` and `TeacherCard` render list cards.
- `StudentProfilePage` and `TeacherProfile` render full profile screens.
- `AssignTeacherModal` manages teacher subject/class assignments.
- `AddQualificationModal` adds teacher qualification records.
- `RolePermissionsPage`, `RoleListPanel`, `PermissionPanel`, `PermissionCard`, and `PermissionSummary` build the role-permission management screen.
- `ThemeGrid`, `ThemeCard`, `ThemePreview`, `dashboardThemes`, and `useTheme` support dashboard theme selection.

Shared dashboard widgets used here:

- `ProfileDrawer`
- `ProfileSettingsPanel`
- `SchoolSettingsForm`
- `RoleCalendar`
- `CommunicationsHub`
- `AudienceMultiSelect`
- `MessageCenter`
- `AIChat`

Data and persistence:

- Uses `src/lib/api.ts` for users and calendar events.
- Uses `src/lib/dashboardData.ts` for local announcements, inbox messages, and fallback calendar data.
- Stores demo/admin records in `localStorage` keys such as `skaimitra_admin_teachers`, `skaimitra_admin_students`, and `skaimitra_admin_role_permissions`.

### Teacher Dashboard

File: `src/pages/teacher/TeacherDashboard.tsx`

This page owns the teacher experience and uses internal render functions to switch between tab content.

Main tabs:

- `Home`: summary cards, activity, calendar, and AI chat.
- `Course Calendar`: grade selector plus `CourseCalendarAccordion`.
- `Lesson Planning`: lesson/lab planning workspace with manual, external, and AI-generated content flows.
- `Assignments`: assignment creation, listing, editing, previewing, and asset handling.
- `Grades`: student submissions and evaluation UI.
- `Communications`: uses the shared `CommunicationsHub`.
- `Reports`: analytics and charts using `recharts`.
- `Content Library`: upload/library management flows.
- `Resources`: external resource cards.

Shared dashboard widgets used here:

- `ActionIconButton`
- `AIChat`
- `AudienceMultiSelect`
- `BackArrowHeader`
- `CourseCalendarAccordion`
- `MessageCenter`
- `ProfileDrawer`
- `RoleCalendar`
- `SharingSelector`
- `CommunicationsHub`

Data and persistence:

- Uses `src/lib/api.ts` for calendar events and lesson-plan fetching.
- Uses `src/lib/dashboardData.ts` for announcements, inbox messages, audience formatting, and fallback calendar data.
- Uses `localStorage` for teacher profile fields and several demo dashboard records.
- Uses `jspdf` for exporting/printing generated teacher content.
- Uses `recharts` for report charts.

### Student Dashboard

File: `src/pages/student/StudentDashboard.tsx`

This page is smaller and switches content directly from the selected student tab.

Main tabs:

- `Home`: student stats, assignment alert, recent activity, subject performance, calendar, and AI chat.
- `My Subjects`: searchable subject cards with progress.
- `Assignments`: searchable assignment list with pending/submitted/graded summary cards.
- `Resources`: searchable learning resource cards.

Shared dashboard widgets used here:

- `AIChat`
- `RoleCalendar`
- `MessageCenter`
- `ProfileDrawer`
- `ProfileSettingsPanel` types

Data and persistence:

- Uses `src/lib/api.ts` for calendar events.
- Uses `src/lib/dashboardData.ts` for role inbox messages.
- Uses `localStorage` for student profile values.

### Parent Dashboard

File: `src/pages/parent/ParentDashboard.tsx`

The parent dashboard is currently a placeholder screen styled by `src/pages/Dashboard.css`. It has only a welcome card, logout action, and link back to login.

## Shared Dashboard Components

Folder: `src/components/dashboard`

- `ActionIconButton.tsx`: compact icon button used by teacher action rows.
- `AIChat.tsx`: local AI-style chat panel. Accepts a `role` prop for role-specific behavior.
- `AudienceMultiSelect.tsx`: class/section/group picker for announcements and calendar events.
- `BackArrowHeader.tsx`: detail-screen header with back action and optional action controls.
- `CommunicationsHub.tsx`: compose, schedule, filter, and manage dashboard communications.
- `CourseCalendarAccordion.tsx`: month/week accordion used by the teacher course calendar.
- `MessageCenter.tsx`: notification/message drawer.
- `ProfileDrawer.tsx`: profile side drawer with logout and profile editing entry points.
- `ProfileSettingsPanel.tsx`: reusable profile form used inside profile drawer and admin settings.
- `RoleCalendar.tsx`: monthly event calendar used by admin, teacher, and student dashboards.
- `SchoolSettingsForm.tsx`: admin school settings form.
- `SharingSelector.tsx`: class/section sharing controls for teacher planning/content flows.
- `SkaiMitraAssistant.tsx`: older assistant component; current role dashboards mainly use `AIChat`.

## Admin Components

Folder: `src/components/admin`

Student flow:

- `StudentCard.tsx`: list card for student management.
- `StudentProfilePage.tsx`: read-only and editable student profile page.
- `studentTypes.ts`: student profile/form types, normalizers, and helper creators.
- `GuardianSection.tsx`: student guardian/contact section.

Teacher flow:

- `TeacherCard.tsx`: list card for teacher management and assignments.
- `TeacherProfile.tsx`: read-only/create teacher profile screen.
- `TeacherProfileEditor.tsx`: editable teacher profile form layout.
- `TeacherForm.tsx`: teacher form fields.
- `teacherTypes.ts`: teacher profile/form types, normalizers, and helper creators.
- `SubjectAssignmentsSection.tsx`: assignment list for teacher subjects/classes.
- `AssignmentTag.tsx`: compact assignment display chip.
- `AssignTeacherModal.tsx`: assignment modal.
- `AddTeacherModal.tsx`: simple add-teacher modal.
- `AddQualificationModal.tsx`: qualification upload modal.
- `QualificationSection.tsx`: teacher qualification list.

Role permission flow:

- `RolePermissionsPage.tsx`: full role-permissions page.
- `RoleListPanel.tsx`: selectable role list.
- `RoleCard.tsx`: individual role option.
- `PermissionPanel.tsx`: permission module list.
- `PermissionCard.tsx`: module/action toggles.
- `PermissionSummary.tsx`: summary of enabled permissions.
- `rolePermissionsTypes.ts`: permission state/types and defaults.

Theme/settings flow:

- `dashboardThemes.ts`: available admin dashboard themes.
- `ThemeGrid.tsx`: list of theme cards.
- `ThemeCard.tsx`: individual theme option.
- `ThemePreview.tsx`: selected theme preview.
- `ToggleSwitch.tsx`: small toggle control.
- `useTheme.ts`: applies selected theme CSS variables.

Legacy or currently less-used admin pieces:

- `AdminHeader.tsx`, `AdminSidebar.tsx`, `ChartSection.tsx`, `DataTable.tsx`, and `StatCard.tsx` look like earlier dashboard building blocks. The current `AdminDashboard.tsx` mostly renders its own header/tabs and imports the newer role dashboard components directly.
- `AddStudentModal.tsx` exists, but the current admin student flow is mainly handled through `StudentProfilePage`.
- `AccountSection.tsx`, `BasicInfoSection.tsx`, `ContactInfoSection.tsx`, and `PrimaryInfoSection.tsx` are form/profile sub-sections used by admin profile flows.

## UI Components

Folder: `src/components/ui`

These are low-level reusable UI primitives such as buttons, dialogs, drawers, forms, inputs, selects, tabs, tables, tooltips, toasts, and sidebar components. They should stay generic and should not contain role-specific dashboard logic.

## Styling Map

- `src/pages/role-dashboard.css`: shared role dashboard layout, headers, tabs, cards, calendars, modals, admin/student/teacher dashboard classes, and many feature-specific styles.
- `src/pages/Dashboard.css`: simple placeholder dashboard layout.
- `src/App.css` and `src/index.css`: global app and base styling.

Most role dashboard JSX uses class names beginning with `role-`, plus role-specific names like `admin-`, `teacher-`, `student-`, `planner-`, `course-calendar-`, and `content-library-`.

## Data Flow Pattern

- Route pages own most page state with React hooks.
- Shared components receive data and callbacks through props.
- API reads/writes go through `src/lib/api.ts`.
- Demo/local data and cross-dashboard notification helpers live in `src/lib/dashboardData.ts`.
- Many profile and demo records are saved in `localStorage` so the frontend can behave like a working dashboard without requiring every backend path.

## Where To Add New Work

- Add a new dashboard route in `src/App.tsx` and place its page under `src/pages/<role>/`.
- Add role-specific components under `src/components/admin` only if they are admin-only.
- Add reusable dashboard widgets under `src/components/dashboard` when the same component can serve admin, teacher, student, or parent dashboards.
- Add generic UI primitives under `src/components/ui` only when they are not tied to SkaiMitra dashboard business logic.
- Keep route pages responsible for orchestration and state; move repeated UI into components when the same pattern appears in more than one dashboard or tab.
