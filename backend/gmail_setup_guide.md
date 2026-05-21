# TATAmart Gmail SMTP Configuration Guide

This guide explains how to configure Gmail SMTP for real email delivery in the TATAmart project.

---

### Step 1: Prepare Your Google Account
1. **Create or select a Gmail Account**: Create a dedicated Gmail account (e.g., `tatamart.business@gmail.com`) or use an existing corporate/business Google account.
2. **Enable 2-Step Verification**:
   - Go to the [Google Account Console](https://myaccount.google.com/).
   - Select **Security** from the left navigation panel.
   - Under *How you sign in to Google*, click on **2-Step Verification**.
   - Follow the prompt instructions to enable 2-Step Verification for your account (this is a security prerequisite to generate App Passwords).

---

### Step 2: Generate a Gmail App Password
1. In the **Security** tab of your Google Account page, click on **2-Step Verification** again.
2. Scroll down to the bottom of the page and select **App passwords**.
3. Under *App name*, enter a descriptive name (e.g., `TATAmart Production`).
4. Click **Create**.
5. Google will display a popup containing a **16-character App Password** (e.g., `abcd efgh ijkl mnop`).
6. **Copy** this code immediately. *Note: Google will not show this code again after you close the modal.*

---

### Step 3: Paste Credentials into `.env`
1. Open the `backend/.env` file.
2. Locate the mail configuration variables and update them using this format:
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your_gmail_address@gmail.com
   MAIL_PASSWORD=your_16_digit_app_password
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS=your_gmail_address@gmail.com
   MAIL_FROM_NAME="TATAmart"
   ```
   > [!IMPORTANT]
   > Do NOT include spaces in the password. The 16-character App Password should be written without spaces (e.g., `abcdefghijklmnop`).

---

### Step 4: Reload Configuration inside Docker
To ensure the updated environment variables are picked up by the application inside Docker:

1. **Restart Docker Containers**:
   ```bash
   docker compose down
   docker compose up -d
   ```
2. **Clear Laravel Caches**:
   Execute this command to purge Laravel's cached configurations:
   ```bash
   docker compose exec backend php artisan optimize:clear
   ```

---

### Step 5: Test Email Sending
Open a browser and navigate to the diagnostic endpoint:
- `http://localhost:8000/test-email` (or via API at `http://localhost:8000/api/test-email` if authenticated).
Check if a diagnostic email is successfully dispatched to your inbox.

---

### Step 6: Troubleshooting Common Gmail SMTP Errors

| Error Code/Message | Root Cause | Resolution |
| :--- | :--- | :--- |
| **535 5.7.8 Username and Password not accepted** | Incorrect login credentials. | Double-check that your email is spelled correctly, 2-Step Verification is active, and you are using a **16-digit App Password** instead of your personal Gmail account password. |
| **Connection Timed Out (110)** | Docker/Firewall blocking outbound SMTP ports. | Ensure outbound traffic is allowed on port `587`. If port `587` is blocked, try switching `MAIL_PORT` to `465` and `MAIL_ENCRYPTION` to `ssl`. |
| **530 5.7.0 Must issue a STARTTLS command first** | Mismatch in encryption setting. | Ensure `MAIL_ENCRYPTION=tls` is set in your `.env`. |
