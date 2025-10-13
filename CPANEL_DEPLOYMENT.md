# Deploying CBT Practice App to cPanel

This guide will help you deploy the CBT Practice App to your cPanel hosting with an addon domain (e.g., cbt.campusgist.com).

## Prerequisites

- cPanel hosting with Node.js support (version 18.x or higher)
- Supabase account with database configured
- Domain or subdomain configured in cPanel

## Step-by-Step Deployment

### 1. Create Addon Domain

1. Log into cPanel
2. Navigate to **Domains** → **Addon Domains**
3. Add your subdomain:
   - **New Domain Name:** `cbt.campusgist.com`
   - **Document Root:** `/public_html/cbt` (or your preferred folder)
4. Click **Add Domain**

### 2. Upload Application Files

**Option A: File Manager**
1. Download the project ZIP from v0
2. In cPanel, go to **File Manager**
3. Navigate to your addon domain folder (e.g., `/public_html/cbt`)
4. Click **Upload** and upload the ZIP file
5. Right-click the ZIP file → **Extract**
6. Delete the ZIP file after extraction

**Option B: FTP/SFTP**
1. Use an FTP client (FileZilla, WinSCP, etc.)
2. Connect to your hosting
3. Upload all files to `/public_html/cbt`

### 3. Setup Node.js Application

1. In cPanel, find and click **Setup Node.js App**
2. Click **Create Application**
3. Configure the application:
   - **Node.js version:** 18.x or higher (select latest available)
   - **Application mode:** Production
   - **Application root:** `cbt` (or full path: `/home/yourusername/public_html/cbt`)
   - **Application URL:** `cbt.campusgist.com`
   - **Application startup file:** `server.js`
   - **Passenger log file:** Leave default or specify custom path
4. Click **Create**

### 4. Configure Environment Variables

In the Node.js App settings, add these environment variables:

\`\`\`bash
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration (from Supabase)
POSTGRES_URL=your_postgres_connection_string
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DATABASE=your_db_name
POSTGRES_HOST=your_db_host

# Supabase Auth
SUPABASE_JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://cbt.campusgist.com

# Node Environment
NODE_ENV=production
\`\`\`

**Where to find these values:**
- Go to your Supabase project dashboard
- Navigate to **Project Settings** → **API**
- Copy the Project URL and anon/service_role keys
- For database credentials, go to **Project Settings** → **Database**

### 5. Install Dependencies

1. In the Node.js App interface, click **Run NPM Install**
2. Wait for installation to complete (this may take a few minutes)

**Alternative (via SSH/Terminal):**
\`\`\`bash
cd /home/yourusername/public_html/cbt
npm install --production
\`\`\`

### 6. Build the Application

**Via SSH/Terminal:**
\`\`\`bash
cd /home/yourusername/public_html/cbt
npm run build
\`\`\`

This will create the optimized production build in the `.next` folder.

### 7. Setup Database Tables

1. Make sure your Supabase database is accessible
2. Run the SQL scripts in order:
   - `scripts/001_create_tables.sql`
   - `scripts/002_seed_data.sql`

**To run scripts:**
- Go to Supabase Dashboard → SQL Editor
- Copy and paste each script
- Click **Run**

### 8. Start the Application

1. In cPanel Node.js App interface, click **Start App** or **Restart**
2. The app should now be running

### 9. Configure SSL (HTTPS)

1. In cPanel, go to **SSL/TLS Status**
2. Find your domain `cbt.campusgist.com`
3. Click **Run AutoSSL** to get a free SSL certificate
4. Wait for SSL to be issued (usually takes a few minutes)

### 10. Test Your Application

Visit `https://cbt.campusgist.com` in your browser. You should see the CBT Practice App landing page.

## Troubleshooting

### App Not Starting
- Check Node.js version (must be 18.x or higher)
- Verify `server.js` exists in the application root
- Check error logs in cPanel Node.js App interface

### Database Connection Issues
- Verify all environment variables are set correctly
- Check if Supabase allows connections from your server IP
- Test database connection from Supabase dashboard

### Build Errors
- Ensure all dependencies are installed
- Check if there's enough disk space
- Review build logs for specific errors

### Port Already in Use
- cPanel automatically assigns ports
- Restart the Node.js app from cPanel interface
- Check if another app is using the same port

### 404 Errors on Routes
- Ensure `.next` folder exists (run `npm run build`)
- Verify `server.js` is configured correctly
- Check Application URL in Node.js App settings

## Creating Your First Admin Account

After deployment, create an admin account:

1. Visit: `https://cbt.campusgist.com/admin-secure-portal/create-admin`
2. Register with your admin email and password
3. Keep this URL private and secure

## Updating the Application

To update your app after making changes:

1. Upload new files via File Manager or FTP
2. In Node.js App interface, click **Stop App**
3. Run `npm install` if dependencies changed
4. Run `npm run build`
5. Click **Start App**

## Performance Tips

- Enable caching in cPanel
- Use a CDN for static assets
- Monitor resource usage in cPanel
- Consider upgrading hosting plan if needed

## Support

For hosting-specific issues, contact your hosting provider (Tela Hosting).
For app-specific issues, refer to the main documentation.

---

**Important URLs to Bookmark:**
- Main App: `https://cbt.campusgist.com`
- Admin Registration: `https://cbt.campusgist.com/admin-secure-portal/create-admin`
- Admin Portal: `https://cbt.campusgist.com/admin-secure-portal/questions`
