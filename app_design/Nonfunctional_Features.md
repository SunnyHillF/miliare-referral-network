# Nonfunctional Features & Implementation Strategy

This document compiles the features described in the design specs and OpenAPI documentation that are not fully implemented in the current codebase. It also notes whether they should be tackled now with the Amplify Gen&nbsp;2 setup or deferred until the CDK backend migration.

## 1. DocuSign Integration & Bonus Pools (Removed)

This functionality is no longer part of the roadmap. The OpenAPI definitions and placeholder Lambdas remain for reference but will not be implemented. Any residual code can be safely deleted in future cleanups.

## 2. Partner Seeding & Dynamic Dashboards

- Dashboard pages rely on static data from `partnersData.tsx` instead of fetching from an API or database.【F:packages/frontend/src/data/partnersData.tsx†L30-L60】
- The design docs mention seeding seven strategic partners, but no database seeding scripts exist.

**Recommendation**: Temporary seeding in Amplify Gen&nbsp;2 is possible for demos, but the full dynamic solution should be implemented once the CDK backend is in place.

## 3. Automated Document Workflow After Registration (Removed)

The prototype originally called for redirecting users to DocuSign forms after sign up. Since DocuSign integration has been dropped, this workflow is no longer necessary and can be ignored.

## 4. Backend Infrastructure & Deployments

- The backend directory is explicitly marked as a placeholder awaiting a more complete implementation.【F:packages/backend/README.md†L5-L10】
- Environment configuration and automated deployment pipelines are not set up.

**Recommendation**: Complete the infrastructure work during the CDK migration when deployment automation will be formalized.

## Summary Table

| Feature | Amplify Gen&nbsp;2 Feasible? | Recommended Phase |
| --- | --- | --- |
| DocuSign integration & bonus pool APIs | ❌ Removed from roadmap | N/A |
| Partner seeding & dynamic dashboards | ⚠️ Possible now, but better with CDK | Begin after CDK migration (temporary demo seeding OK) |
| Automated DocuSign workflow | ❌ Removed | N/A |
| Infrastructure & deployments | ⚠️ Basic Amplify setup exists | Finalize with CDK migration |

This list can guide planning for the upcoming phases and prioritize work during the backend transition.
