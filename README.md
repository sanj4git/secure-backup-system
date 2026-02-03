# 🔐 Secure Backup & Restore System (Cyber Security Lab)

A secure file backup and restore backend system built using **MERN stack principles**, implementing core cybersecurity concepts such as:

- Authentication (NIST SP 800-63-2 compliant)
- Authorization using Access Control Matrix (ACL)
- Hybrid Encryption (AES + RSA Key Exchange)
- Hashing with Salt (bcrypt)
- Digital Signatures for Integrity Verification
- Secure File Upload & Restore
- Audit Logging

---

## 📌 Project Objective

This project is developed as part of **23CSE313 - Foundations of Cyber Security Lab Evaluation**.

The system allows users to securely upload files for backup, store them in encrypted form, and restore them only if authorized.

---

## ✅ Security Features Implemented

### 1. Authentication (NIST SP 800-63-2 Model)

- **Single Factor Authentication:** Email + Password  
- **Multi Factor Authentication:** Password + OTP Verification  
- **JWT Token** issued only after OTP verification

This follows the NIST e-authentication architecture model:

- Subscriber (User)
- Credential Service Provider (OTP + JWT)
- Relying Party (Backup Service)

---

### 2. Authorization (Access Control Matrix)

Role-based access control is implemented using middleware.

| Role ↓ / Resource → | Upload Backup | Restore File | View Logs |
|---------------------|---------------|--------------|-----------|
| USER                | Yes (own)     | Yes (own)    | No        |
| ADMIN               | Yes (all)     | Yes (all)    | Yes       |
| AUDITOR             | No            | No           | Yes       |

Authorization is enforced programmatically through ACL rules.

---

### 3. Encryption & Key Exchange (Hybrid Encryption)

- Files are encrypted using **AES-256-CBC**
- A unique AES key is generated per file
- AES key is wrapped securely using **RSA Public Key Encryption**

This demonstrates a secure key exchange mechanism:

- AES → Fast file encryption  
- RSA → Secure key transport  

---

### 4. Hashing + Digital Signature

- Passwords are stored securely using **bcrypt hashing + salt**
- File integrity is ensured using:
  - **SHA-256 Hash**
  - **RSA Digital Signature**

Signature verification is performed before restoring any file.

---

### 5. Encoding

- Encrypted file data is stored safely using **Base64 Encoding**
- Prevents corruption during database storage and transfer

---

### 6. Secure File Restore Workflow

Files are decrypted and restored only after:

- ACL permission check
- SHA-256 hash integrity verification
- RSA signature validation

If signature verification fails, restore is blocked.

---

### 7. Audit Logging

All critical actions are logged:

- Upload events
- Restore events
- Unauthorized access attempts

Auditors can view logs but cannot access file contents.

---

## 🏗️ Backend Tech Stack

- Node.js + Express.js
- MongoDB Atlas
- JWT Authentication
- bcrypt Password Hashing
- Multer File Upload Middleware
- Crypto Module (AES + RSA)
- SHA-256 + Digital Signatures

---

## 🚀 API Endpoints

### Authentication Routes

| Endpoint | Description |
|----------|-------------|
| POST `/api/auth/register` | Register new user |
| POST `/api/auth/login` | Login → OTP generated |
| POST `/api/auth/verify-otp` | OTP verification → JWT issued |

---

### File Backup Routes

| Endpoint | Description |
|----------|-------------|
| POST `/api/files/upload` | Upload encrypted backup file |
| GET `/api/files/restore/:id` | Restore file (download original) |

---

### Logs Route

| Endpoint | Description |
|----------|-------------|
| GET `/api/logs` | View audit logs (Admin/Auditor only) |

---

## ⚙️ Setup Instructions

### 1. Clone Repository
```bash
git clone <repo-url>
cd backend
```

---

### 2. Install Dependencies
```bash
npm install
```

---

### 3. Create `.env` File
```env
MONGO_URI=<your_mongodb_atlas_uri>
JWT_SECRET=your_secret_key
```

---

### 4. Generate RSA Key Pair (One-Time)
```bash
mkdir keys
openssl genrsa -out keys/private.pem 2048
openssl rsa -in keys/private.pem -pubout -out keys/public.pem
```

⚠️ Do NOT upload `private.pem` to GitHub.

Add to `.gitignore`:
```gitignore
keys/private.pem
.env
node_modules
```

---

### 5. Run the Server
```bash
npm run dev
```

Server will start at:
```
http://localhost:5000
```

---

## 🎯 Lab Evaluation Mapping

This project satisfies all required lab components:

- ✅ Authentication (Single + Multi Factor)
- ✅ NIST SP 800-63-2 compliant login flow
- ✅ Access Control Matrix + Enforcement
- ✅ AES Encryption + RSA Key Exchange
- ✅ Hashing with Salt (bcrypt)
- ✅ Digital Signature Verification
- ✅ Encoding (Base64)
- ✅ Audit Logging + Security Awareness

---

## 👨‍💻 Author

Developed by **Sanjay**  
23CSE313 - Cyber Security Lab Project

---

## 📌 GitHub Repo Description (Short)

Secure Backup & Restore System implementing MFA, ACL authorization, AES+RSA hybrid encryption, hashing, and digital signatures.
