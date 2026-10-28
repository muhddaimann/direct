# Expo Native AI Development Guidance

## 1. Purpose and Applicability

This file provides reusable guidance for AI-assisted **native-only Expo and React Native development on iOS and Android**. It is intended to be placed directly in an app repository and used on its own by an AI agent; all collaboration and technical guidance needed for this workflow is included here. Web is not a target platform.

Adapt this guidance to the app rather than treating it as a fixed app template. Inspect the project and its instructions before applying any architecture or workflow. Do not assume the app's purpose, routing, design, dependencies, persistence, or source structure.

## 2. How to Interpret This Guidance

Treat guidance as one of three kinds:

- **Safeguards:** protect project integrity, compatibility, privacy, or security. Follow unless higher-priority instructions or the user establish otherwise.
- **Tested defaults:** approaches that have worked well in prior Expo work. Recommend them when relevant, but adapt or omit them when project needs differ.
- **Project decisions:** app-specific choices such as navigation, design, data ownership, persistence, and backend behavior. Get approval when consequential, then record durable decisions in the project's `AGENTS.md`.

### Working modes

- **Advice:** inspect relevant context, assess the request, and recommend scope, decisions, and validation. Make no changes; wait for authorization when implementation is proposed.
- **Draft:** prepare the requested artifact without treating it as approved for implementation.
- **Implementation:** make only the requested or approved changes. Do not add unrelated work. If a material product, platform, privacy, or compatibility decision arises, pause and ask before choosing.
- **Review:** inspect the requested material or changes and report findings without editing.
- **Staged work:** when using an approval workflow, implement only the latest approved scope after `proceed`. Do not add approval gates to straightforward tasks that clearly request direct implementation.

### Workflow contract

Use one active work item at a time. For staged work, record it in the project-local `AGENTS.md`:

```text
Phase: <foundation phase>
Status: Advice | In progress | Awaiting review | Approved
Scope: <one-sentence boundary>
```

After foundation, use a named feature instead:

```text
Feature: <feature name>
Status: Advice | In progress | Awaiting review | Approved
Scope: <one-sentence boundary>
```

- **Advice:** inspect relevant project state, make no edits, propose one bounded scope, and wait for authorization.
- **proceed:** implement only the immediately preceding proposal. If a material product, platform, privacy, persistence, or compatibility decision is unresolved, pause and ask rather than silently choosing.
- **review changes:** inspect and report the active work item without editing.
- **approve changes:** record durable app-specific decisions in the project's `AGENTS.md`; keep this reusable blueprint generic.
- For straightforward implementation requests outside staged work, implement the requested scope without inventing approval gates.

Before acting, identify the goal and scope. Inspect relevant project instructions and current changes. Ask a focused question only when an unknown could materially change the result; otherwise state a reasonable assumption and continue. Preserve existing work and do not perform destructive, external, or privacy-sensitive actions without clear authorization. Follow applicable higher-priority instructions and raise conflicts that materially affect the work.

## 3. Expo-Specific Safeguards

Before changing project setup, inspect the relevant files and current work, including as applicable:

- package manifest, lockfile, scripts, declared dependencies, and version;
- `app.json` or `app.config.*`;
- entry point, routes, source tree, TypeScript configuration, and Git status.

Then:

- Keep this blueprint native-only: configure Expo to target iOS and Android, omit web configuration/scripts/assets, and do not add web-only dependencies. When using Expo Router, disable web async route behavior using the option supported by the installed SDK. Verify the resolved public config lists only native platforms.

- Prefer Expo and React Native capabilities when suitable. Use `npx expo install <package>` for Expo-compatible dependencies.
- Treat dependencies declared by the project manifest as authoritative; do not infer project dependencies from `node_modules` leftovers.
- When changing dependencies, update the manifest and lockfile with the repository's package manager. Do not hand-edit lockfiles unless the package manager cannot complete the change.
- Avoid generated directories and build output, including `node_modules/`, `.expo/`, and generated native folders, unless explicitly required.
- Leave declared scratchpads, private notes, and excluded areas untouched unless asked.
- Check prescribed APIs, configuration keys, and platform behavior against the installed Expo/React Native versions and official documentation. If a required approach conflicts, return to Advice before substituting another approach.
- For an explicit version bump, inspect the project's manifests, Expo config, metadata, and lockfile to identify the approved source of truth and any version fields the project intentionally keeps aligned. Update the approved user-facing metadata and changelog first, then synchronize only those declared fields. Use the package manager for dependency/lockfile updates; do not hand-edit lockfiles or treat every version-like field as an app version. Validate the version fields that the project designates to match. Do not invent version files or change versions beyond the request.

For work involving identity, credentials, sessions, payments, health, or other sensitive data, explain data handling, storage, expiration, logout, error behavior, privacy, and production-backend boundaries during Advice. Never put secrets, raw credentials, OTP values, or unapproved sensitive data in source control or unsecured device storage. Clearly label mock or local sensitive-data flows as non-production; do not imply real delivery, backend, or security guarantees.

## 4. Choose the Work Path

First determine whether the request concerns an existing app, a new app foundation, or a product feature. Use the lightest path that fits.

### Existing app

- Inspect the app's current architecture, conventions, configuration, dependencies, and working tree.
- Extend the existing structure where practical. Do not migrate to a preferred router, state model, design system, or file layout unless the request and approved scope call for it.

### New app foundation

Use the foundation phases in Section 5 when starting from a blank or intentionally minimal template. Tailor or omit phases when the project already has the capability. Work on one approved phase at a time when decisions or setup changes are substantial.

When the user says `start development`, treat that as Advice. Inspect the template and worktree, then ask only for the app name and a short description. Use those answers to propose Phase 1; do not install, configure, or edit until authorized.

### Product feature

For feature advice, propose one bounded slice. Cover the user flow, scope/non-goals, likely routes/files, dependencies/configuration, state ownership and persistence/reset behavior, privacy/backend boundaries, platform/accessibility implications, risks, acceptance criteria, validation, manual checks, and deferred work. Do not assume backend contracts, credentials, analytics, external services, or production behavior. Implement only the requested or approved scope.

## 5. New-App Foundation Phases

The following sequence is a tested foundation workflow. Tailor or omit phases to fit the template; example trees are reference shapes, not required migrations or complete file lists. Confirm project-specific choices in Advice before implementation.

### Phase 1 — App metadata and native foundation

Establish the approved app identity, configuration, entry point, routing approach, and initial screen. A useful tested default is Expo Router with a root layout and landing screen, plus one metadata source for app name, description, version, and changelog. Propose the identity, a starting version (commonly `0.0.0`), branded font, and icon system rather than assuming them.

Native-only configuration is required in Phase 1: target iOS and Android, remove web scripts, Expo web configuration, favicon and other web-only assets, and avoid web-only dependencies. If using Expo Router, disable web-specific async route behavior using the option supported by the installed SDK. Update the package manifest and lockfile through the package manager when removing declared dependencies. Verify the resolved public Expo config lists only iOS and Android.

When starting from a blank app and Expo Router is selected, this is a useful initial structure:

```text
app/
├── _layout.tsx
└── index.tsx          # LandingScreen
src/
└── constants/
    └── about.ts       # app name, description, version, changelog
```

In this structure, `_layout.tsx` owns the root app shell and navigation configuration; `index.tsx` renders the landing screen; and `about.ts` is the source for user-visible app metadata. Configure the package entry for Expo Router. Treat this as a starting example, not a required migration for existing apps or projects using another router.

### Phase 2 — Theme foundation

If the app needs a shared visual system, propose semantic light/dark tokens, a typed theme API, and clear ownership of root background, status bar, and safe areas. Session-only theme selection is a conservative default; persistence requires an explicit product decision. A token specimen/reference screen can help during foundation work, but should not be imposed on a production landing screen.

One tested module layout is:

```text
src/
├── components/
│   └── theme/
│       └── themeToggle.tsx
├── constants/
│   └── theme.ts
├── contexts/
│   └── themeContext.tsx
├── helpers/
│   └── animate.ts
└── hooks/
    └── useTheme.ts
```

Adapt names and boundaries to the app's conventions. The root layout typically owns the theme provider and safe-area integration; routes should not duplicate root safe-area padding by default.

### Phase 3 — Shared overlay capabilities

If the app needs reusable dialogs, sheets, loaders, or toasts, define their typed API, rendering ownership, theme integration, dismissal lifecycle, accessibility, and platform behavior before implementation. Handle callback idempotence and retain content through exit animation. Use native configuration or rebuilt binaries only when required by the approved behavior; identify those verification limits.

A tested separation of overlay API, state, and rendering is:

```text
src/
├── components/
│   └── overlay/
│       └── overlayHost.tsx
├── constants/
│   └── overlay.ts
├── contexts/
│   ├── overlayContext.ts
│   └── overlayProvider.tsx
└── hooks/
    └── useOverlay.ts
```

Keep the context contract separate from provider and host implementation when that helps avoid import cycles. Mount one host at the appropriate root level; exact placement depends on the app's shell and overlay presentation.

### Phase 4 — Primary navigation

Establish the app's actual route hierarchy and navigation behavior. Floating tabs, hidden headers, disabled route animations, placeholder routes, and replacement navigation are tested options from prior work—not defaults to impose on every app. Specify which controls appear on root versus nested routes and how safe areas and repeated selections behave.

For an app choosing Expo Router with Home and Settings tabs, one tested route shape is:

```text
app/
├── _layout.tsx
├── index.tsx                  # LandingScreen
└── (tabs)/
    ├── _layout.tsx
    ├── home/
    │   ├── _layout.tsx
    │   ├── index.tsx
    │   └── demo/
    │       └── index.tsx
    └── settings/
        ├── _layout.tsx
        ├── index.tsx
        └── demo/
            └── index.tsx
src/
└── components/
    └── tabs/
        └── bottomBar.tsx
```

The `demo/` routes are generic placeholders, not product requirements. Keep them only if useful, and use the app's actual navigation approach when it differs.

### Phase 5 — Shared screen and control foundations

Add reusable screen, list, empty-state, picker, or floating-control components only when the app has a demonstrated need. Define focus/scroll ownership, persistence, overlay dismissal behavior, accessibility, content clearance, and platform insets. Avoid abstractions that only rename existing APIs.

A tested module layout for these shared capabilities is:

```text
src/
├── components/
│   └── shared/
│       ├── appScreen.tsx
│       ├── emptyState.tsx
│       ├── longList.tsx
│       └── optionPicker.tsx
├── constants/
│   └── layout.ts
├── contexts/
│   └── barContext.tsx
└── hooks/
    └── useBar.ts
```

Use only the components and state that the app needs; avoid creating placeholder abstractions solely to match this tree.

For each proposed phase, state its goal, scope and non-goals, decisions needing approval, likely files and dependencies, acceptance criteria, validation, and manual checks. Do not advance to later phases merely because they appear in this list.

### Foundation completion and feature work

- Implement and review one phase at a time. After `review changes`, wait for revision instructions plus `proceed`, or `approve changes` before proposing the next phase.
- On `approve changes`, record only durable app-specific decisions in the project's `AGENTS.md` and mark the phase Approved. Keep this reusable blueprint generic.
- After Phase 5 is approved, develop product work as one named, unnumbered feature slice at a time. Use the feature Advice → `proceed` → review → approval loop; do not create more numbered phases unless the project explicitly returns to foundation work.
- For each feature, reuse existing module sources of truth. Add module constants for types, icon/accent, and fictional fixtures when appropriate; add routes, components, Home/Settings entry points, contexts, or hooks only when the feature needs them. Prefer derived hooks for cross-module summaries over duplicate state or dummy records.
- Keep mock workflows visibly non-production. Explain whether data is in-memory or persisted, reset behavior, and whether anything is actually sent or reserved. Use typed `useOverlay()` APIs directly and put work that depends on dismissal in its completion callback.

## 6. Expo Feature and Implementation Considerations

When relevant to the request, account for:

- iOS and Android behavior, including safe areas, system bars, navigation gestures, and platform-specific configuration;
- accessibility, dynamic text sizing, touch target sizes, and keyboard behavior;
- routing and screen lifecycle, including focused ownership of global controls;
- theme tokens and shared components already present in the app;
- data ownership, persistence, migration, privacy, and failure states;
- native rebuild requirements for configuration changes.

Use existing project abstractions before introducing new ones. Avoid adding dependencies, refactors, configuration changes, or cleanup outside the approved scope. If a material product, platform, privacy, or compatibility decision emerges during implementation, pause and return to Advice.

For modules, keep ownership explicit: module constants may hold types, icons, accent tokens, and fictional fixtures; existing contexts remain the source of truth for mutable data. Add a context/provider only when state is shared or has a lifecycle that needs one. Derive cross-module summaries through hooks/selectors rather than copying module data. Add Home or Settings widgets and Quick actions only when they support the approved flow. Reuse `AppScreen`, `OptionPicker`, and `useOverlay()` instead of introducing parallel shared controls.

## 7. Validation and Reporting

Choose checks based on the change. Depending on the project and scope, these may include type checking, linting, tests, Expo configuration inspection, and iOS/Android exports. Use temporary output locations outside the repository where appropriate, and check the final diff for whitespace/errors.

Distinguish automated checks from manual verification. State which commands were run and their results. Identify simulator/device checks, rebuilt-native-app checks, and other tests that were not available as unverified; do not claim they passed. Report changed behavior, dependencies/configuration, limitations, risks, and deferred work concisely.

## 8. Project-Local Decisions and Evolution

Record approved durable app decisions in the project's `AGENTS.md` or the app's relevant metadata, so an agent can find them in the project without making this reusable guidance app-specific. Keep generic tested defaults distinct from app-specific decisions. Refine this guidance when recurring experience demonstrates a better approach; keep one-off and temporary task details out of durable project instructions.

## Approved Project Decisions

### Phase 1 — App metadata and native foundation — Approved

- App name: **Direct**. About: “A CelcomDigi mobile app prototype that brings customer support directly into the app through a native IMR and live chat experience.”
- Expo slug and deep-link scheme: `direct`.
- Initial version: `0.0.0`. Keep the user-visible version in `src/constants/about.ts` aligned with `package.json` and Expo config.
- Native-only targets: iOS and Android. Do not add web scripts, web config, or web-only assets.
- Routing: Expo Router, with `app/_layout.tsx` as the root shell and `app/index.tsx` as the landing screen.
- Typography and icons: Inter (`@expo-google-fonts/inter`) and `@expo/vector-icons`.
- Visual direction: approachable customer support using a blue primary (`#0057B8`) and yellow secondary (`#FFD43B`) palette. These are prototype values, not verified official CelcomDigi brand specifications. Use navy for text on yellow surfaces for contrast.
- Safe-area ownership: root layout owns the top safe area; screens do not add duplicate top-safe-area padding by default.
- Suggested iOS bundle identifier and Android package: `com.celcomdigi.direct`. Confirm namespace ownership and store availability before publishing.
- Foundation validation: TypeScript check, iOS and Android Expo exports, public config check for native-only platforms, and `git diff --check`. Simulator/device behavior must be reported separately as manual verification.
