# Patient profile schema migration

The application is configured with `spring.jpa.hibernate.ddl-auto=update`. For the local setup, Hibernate creates `patient_profiles` and adds nullable `appointments.patient_profile_id` without removing appointment rows. The first authenticated patient-profile request creates the account's SELF profile and backfills that account's legacy appointments to it.

For an environment that manages schema changes outside Hibernate, run `V2__patient_profiles.sql` once against the existing `medicare_db` before deploying this version. The script retains existing appointment rows and attaches them to each booking account's SELF profile. It is a one-time migration; do not rerun it after the table/column have been created.

New bookings require `patient_profile_id` through the API. The database column remains nullable for compatibility with legacy rows and historical non-patient records.
