# GYM-APP

A GymPass-style application for gym check-ins and user management.

---

## ✅ Functional Requirements (RFs)

- [ ] Users must be able to register.
- [ ] Users must be able to authenticate.
- [ ] Authenticated users must be able to retrieve their profile.
- [ ] Authenticated users must be able to view the number of check-ins they have made.
- [ ] Authenticated users must be able to access their check-in history.
- [ ] Users must be able to search for gyms by name.
- [ ] Users must be able to check in at a gym.
- [ ] Administrators must be able to validate a user's check-in.
- [ ] Administrators must be able to register gyms.

---

## 📌 Business Rules (RNs)

- [ ] Users cannot register with an email that is already in use.
- [ ] Users cannot check in more than once per day.
- [ ] Users can only check in if they are within 100 meters of the gym.
- [ ] Check-ins can only be validated after 20 minutes of being created.
- [ ] Only administrators can validate check-ins.
- [ ] Only administrators can register new gyms.

---

## 🛠️ Non-Functional Requirements (RNFs)

- [ ] User passwords must be stored in encrypted format.
- [ ] Application data must be persisted in a PostgreSQL database.
- [ ] All list endpoints must support pagination with 20 items per page.
- [ ] Users must be identified and authenticated using JWT (JSON Web Tokens).
