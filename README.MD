# GYM-APP

A GymPass-style application for gym check-ins and user management.

---

## ✅ Functional Requirements (RFs)

- [x] Users must be able to register.
- [x] Users must be able to authenticate.
- [x] Authenticated users must be able to retrieve their profile.
- [x] Authenticated users must be able to view the number of check-ins they have made.
- [x] Authenticated users must be able to access their check-in history.
- [x] Users must be able to search for gyms by name.
- [x] Users must be able to check in at a gym.
- [x] Administrators must be able to validate a user's check-in.
- [x] Administrators must be able to register gyms.

---

## 📌 Business Rules (RNs)

- [x] Users cannot register with an email that is already in use.
- [x] Users cannot check in more than once per day.
- [x] Users can only check in if they are within (100m) of the gym.
- [x] Check-ins can only be validated after 20 minutes of being created.
- [ ] Only administrators can validate check-ins.
- [ ] Only administrators can register new gyms.

---

## 🛠️ Non-Functional Requirements (RNFs)

- [x] User passwords must be stored in encrypted format.
- [x] Application data must be persisted in a PostgreSQL database.
- [x] All list endpoints must support pagination with 20 items per page.
- [ ] Users must be identified and authenticated using JWT (JSON Web Tokens).
