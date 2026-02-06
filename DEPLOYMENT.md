# 🚀 Deployment Guide - HRMS Lite

This guide will help you deploy both the backend and frontend of HRMS Lite to production.

## 📋 Prerequisites

1. **MySQL Database** (hosted):
   - Options: PlanetScale, AWS RDS, Railway MySQL, Render MySQL, or any hosted MySQL service
   - Note down your database connection string

2. **GitHub Account** (for connecting repositories)

3. **Deployment Platform Accounts**:
   - **Backend**: Render.com (FREE tier available) ⭐ RECOMMENDED
   - **Frontend**: Vercel.com or Netlify.com (both free)
   
   **Note**: Railway trial expired? Use Render.com - it has a free tier! See `RENDER_DEPLOY_GUIDE.md` for detailed steps.

---

## 🔧 Step 1: Deploy Backend (FastAPI)

> **⚠️ Railway trial expired?** Use **Render.com** - it has a **FREE tier**! 
> Detailed guide: See `RENDER_DEPLOY_GUIDE.md` for step-by-step instructions.

### Option A: Deploy to Render.com (⭐ RECOMMENDED - FREE TIER)

1. **Sign up/Login** to [Render.com](https://render.com)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository: `HRMS-Lite_Task`
   - Root Directory: `hrms-lite-backend`

3. **Configure Build Settings**:
   - **Name**: `hrms-lite-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Set Environment Variables**:
   - Click "Environment" tab
   - Add variable:
     - **Key**: `DATABASE_URL`
     - **Value**: `mysql+pymysql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME`
     - Example: `mysql+pymysql://user:pass@mysql.example.com:3306/hrms_lite`

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://hrms-lite-backend.onrender.com`)

### Option B: Deploy to Railway.app

1. **Sign up/Login** to [Railway.app](https://railway.app)

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository
   - Set Root Directory to: `hrms-lite-backend`

3. **Add MySQL Database**:
   - Click "+ New" → "Database" → "MySQL"
   - Railway will automatically create a MySQL instance
   - Copy the connection string from the "Connect" tab

4. **Set Environment Variables**:
   - Go to your service → "Variables" tab
   - Add `DATABASE_URL` with the MySQL connection string from step 3

5. **Deploy**:
   - Railway will auto-deploy
   - Get your backend URL from the "Settings" → "Domains" section

---

## 🎨 Step 2: Deploy Frontend (React + Vite)

### Option A: Deploy to Vercel.com

1. **Sign up/Login** to [Vercel.com](https://vercel.com)

2. **Import Project**:
   - Click "Add New" → "Project"
   - Import from GitHub
   - Select your repository
   - **Root Directory**: `hrms-lite-frontend`

3. **Configure Build Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install`

4. **Set Environment Variables**:
   - Go to "Environment Variables"
   - Add:
     - **Key**: `VITE_API_BASE_URL`
     - **Value**: Your backend URL (from Step 1)
     - Example: `https://hrms-lite-backend.onrender.com`

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment
   - Your frontend will be live at: `https://your-project.vercel.app`

### Option B: Deploy to Netlify.com

1. **Sign up/Login** to [Netlify.com](https://netlify.com)

2. **Add New Site**:
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository
   - **Base directory**: `hrms-lite-frontend`

3. **Configure Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

4. **Set Environment Variables**:
   - Go to "Site settings" → "Environment variables"
   - Add:
     - **Key**: `VITE_API_BASE_URL`
     - **Value**: Your backend URL (from Step 1)

5. **Deploy**:
   - Click "Deploy site"
   - Your frontend will be live at: `https://your-project.netlify.app`

---

## 🔗 Step 3: Update CORS Settings (If Needed)

If your frontend and backend are on different domains, ensure CORS is configured:

The backend already has CORS configured to allow all origins. If you want to restrict it:

1. Edit `hrms-lite-backend/app/main.py`
2. Update the `allow_origins` list:
   ```python
   allow_origins=["https://your-frontend.vercel.app", "https://your-frontend.netlify.app"]
   ```
3. Redeploy the backend

---

## ✅ Step 4: Verify Deployment

1. **Test Backend**:
   - Visit: `https://your-backend-url.com/docs`
   - You should see FastAPI Swagger documentation
   - Test the `/employees/` endpoint

2. **Test Frontend**:
   - Visit your frontend URL
   - Try creating an employee
   - Try marking attendance
   - Verify all features work

3. **Check Database Connection**:
   - Backend logs should show successful database connection
   - Test creating an employee to verify database writes

---

## 🐛 Troubleshooting

### Backend Issues:

1. **Database Connection Error**:
   - Verify `DATABASE_URL` is correct
   - Check if MySQL host allows connections from your deployment platform
   - Ensure database exists and credentials are correct

2. **Port Error**:
   - Make sure you're using `$PORT` environment variable in start command
   - Render/Railway provide this automatically

3. **Build Fails**:
   - Check `requirements.txt` is in the root of `hrms-lite-backend`
   - Verify Python version compatibility

### Frontend Issues:

1. **API Calls Fail**:
   - Verify `VITE_API_BASE_URL` is set correctly
   - Check browser console for CORS errors
   - Ensure backend URL includes `https://` (not `http://`)

2. **Build Fails**:
   - Check `package.json` exists
   - Verify Node.js version (18+)

3. **404 on Routes**:
   - Ensure redirect rules are configured (already in `vercel.json` and `netlify.toml`)

---

## 📝 Quick Reference

### Environment Variables Summary:

**Backend:**
- `DATABASE_URL`: MySQL connection string

**Frontend:**
- `VITE_API_BASE_URL`: Backend API URL

### Important URLs to Note:
- Backend API: `https://your-backend-url.com`
- Backend Docs: `https://your-backend-url.com/docs`
- Frontend: `https://your-frontend-url.com`

---

## 🎯 Deployment Checklist

- [ ] MySQL database created and accessible
- [ ] Backend deployed and accessible
- [ ] Backend API docs working (`/docs`)
- [ ] Frontend deployed and accessible
- [ ] Environment variables set correctly
- [ ] Frontend can connect to backend
- [ ] Employee creation works
- [ ] Attendance marking works
- [ ] All routes accessible
- [ ] Error handling works

---

## 🆘 Need Help?

If you encounter issues:
1. Check deployment platform logs
2. Verify environment variables
3. Test backend API directly via `/docs`
4. Check browser console for frontend errors
5. Verify database connection string format

---

**Good luck with your deployment! 🚀**

