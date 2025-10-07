<div align="center">

# 🚀 Portfolio 2.0

### Modern Full-Stack Portfolio with AI-Powered Features

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Live Demo](https://your-portfolio-url.com) • [Report Bug](https://github.com/Aniruddha1701/Portfolio-2.0/issues) • [Request Feature](https://github.com/Aniruddha1701/Portfolio-2.0/issues)

</div>

---

## 📸 Preview

<div align="center">
  <img src="public/preview.png" alt="Portfolio Preview" width="800px" />
</div>

## ✨ Highlights

<table>
<tr>
<td width="50%">

### 🎨 **Modern Design**
- Stunning dark/light mode
- Smooth animations with Framer Motion
- Interactive particle backgrounds
- Responsive across all devices

</td>
<td width="50%">

### 🤖 **AI-Powered**
- Google Gemini AI integration
- Smart IT news aggregator
- Intelligent content curation
- Real-time updates

</td>
</tr>
<tr>
<td width="50%">

### 🔐 **Secure Admin Panel**
- Email OTP authentication
- JWT-based sessions
- Full CRUD operations
- Image & resume upload

</td>
<td width="50%">

### ⚡ **Performance**
- PWA support
- Optimized images
- Server-side rendering
- SEO optimized

</td>
</tr>
</table>

---

## 🎯 Features

```mermaid
graph LR
    A[Portfolio 2.0] --> B[Frontend]
    A --> C[Backend]
    A --> D[Admin Panel]
    A --> E[AI Features]
    
    B --> B1[Next.js 15]
    B --> B2[Tailwind CSS]
    B --> B3[Framer Motion]
    
    C --> C1[MongoDB]
    C --> C2[API Routes]
    C --> C3[Email Service]
    
    D --> D1[Authentication]
    D --> D2[Content Management]
    D --> D3[File Upload]
    
    E --> E1[Gemini AI]
    E --> E2[News Aggregator]
    E --> E3[Smart Lab]
```

### 🌟 Core Features

- ✅ **Fully Responsive** - Perfect on mobile, tablet, and desktop
- 🌓 **Theme Toggle** - Dark/Light mode with system preference
- 📊 **Dynamic Content** - MongoDB-powered content management
- 📱 **PWA Ready** - Install as a native app
- 🔍 **SEO Optimized** - Dynamic metadata for better rankings
- 📧 **Contact Form** - Email integration with validation
- 🎨 **Animations** - Smooth transitions and effects
- 🔒 **Secure** - JWT authentication & rate limiting

### 📦 Portfolio Sections

| Section | Description |
|---------|-------------|
| 🏠 **Hero** | Animated introduction with personal branding |
| 👤 **About** | Journey timeline with education & experience |
| 💼 **Skills** | Categorized skills with proficiency levels |
| 🚀 **Projects** | Showcase with live demos & GitHub links |
| 🏆 **Certifications** | Professional achievements display |
| 🧪 **Smart Lab** | AI-powered IT news aggregator |
| 📬 **Contact** | Email-based contact system |

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![Shadcn/ui](https://img.shields.io/badge/Shadcn/ui-000000?style=flat-square&logo=shadcnui&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

### AI & Tools
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=flat-square&logo=google&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-0F9DCE?style=flat-square&logo=nodemailer&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white)

</div>

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js >= 18.0
MongoDB (local or Atlas)
Gmail account (for SMTP)
Google AI API key (optional)
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Aniruddha1701/Portfolio-2.0.git
cd Portfolio-2.0

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Initialize database
node scripts/ensure-admin.js

# 5. Run development server
npm run dev
```

🎉 Open [http://localhost:9002](http://localhost:9002) in your browser!

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/portfolio

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Email Recipients
EMAIL_FROM=your-email@gmail.com
EMAIL_TO=recipient@gmail.com

# Security
JWT_SECRET=your-super-secret-jwt-key

# AI Features (Optional)
GOOGLE_API_KEY=your-google-ai-api-key

# Application
NEXT_PUBLIC_URL=http://localhost:9002
```

<details>
<summary>📧 How to get Gmail App Password</summary>

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Scroll to **App passwords**
4. Generate password for "Mail"
5. Use in `EMAIL_PASS`

</details>

---

## 📁 Project Structure

```
Portfolio-2.0/
├── 📂 src/
│   ├── 📂 app/                    # Next.js App Router
│   │   ├── 📂 admin/              # Admin dashboard
│   │   ├── 📂 api/                # API routes
│   │   ├── actions.ts             # Server actions
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Home page
│   ├── 📂 components/             # React components
│   │   ├── 📂 ui/                 # Shadcn components
│   │   ├── hero-enhanced.tsx      # Hero section
│   │   ├── skills.tsx             # Skills display
│   │   ├── portfolio.tsx          # Projects
│   │   └── smart-lab.tsx          # AI news
│   ├── 📂 lib/                    # Utilities
│   │   ├── 📂 db/                 # Database utils
│   │   ├── email.ts               # Email service
│   │   ├── session.ts             # Auth sessions
│   │   └── rate-limit.ts          # Rate limiting
│   ├── 📂 models/                 # Mongoose models
│   │   ├── Admin.ts
│   │   ├── Contact.ts
│   │   └── Portfolio.ts
│   └── 📂 ai/                     # AI integration
│       ├── 📂 flows/              # Genkit flows
│       └── genkit.ts              # AI config
├── 📂 public/                     # Static assets
├── 📂 scripts/                    # Database scripts
├── .env.local                     # Environment vars
├── next.config.ts                 # Next.js config
├── tailwind.config.ts             # Tailwind config
└── package.json                   # Dependencies
```

---

## 🎨 Admin Panel

Access at `/admin/login`

### Features

<table>
<tr>
<td width="33%">

#### 👤 Personal Info
- Name & title
- Bio & location
- Social links
- Profile picture

</td>
<td width="33%">

#### 💼 Content
- Skills management
- Projects CRUD
- Journey timeline
- Certifications

</td>
<td width="33%">

#### 📄 Files
- Image upload
- Resume upload
- File management
- Optimization

</td>
</tr>
</table>

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Email
    
    User->>Frontend: Enter email
    Frontend->>API: Request OTP
    API->>Email: Send OTP
    Email->>User: Receive OTP
    User->>Frontend: Enter OTP
    Frontend->>API: Verify OTP
    API->>Frontend: JWT Token
    Frontend->>User: Access granted
```

---

## 🔌 API Reference

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/send-otp` | POST | Send OTP to email |
| `/api/auth/verify-otp` | POST | Verify OTP & login |
| `/api/auth/logout` | POST | Logout user |

### Portfolio

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/portfolio` | GET | ❌ | Get portfolio data |
| `/api/admin/portfolio` | POST | ✅ | Update portfolio |
| `/api/admin/upload-image` | POST | ✅ | Upload image |
| `/api/admin/upload-resume` | POST | ✅ | Upload resume |

### Contact

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/contact` | POST | Submit contact form |

---

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Aniruddha1701/Portfolio-2.0)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy 🚀

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t portfolio .
docker run -p 3000:3000 portfolio
```

---

## 📊 Performance

<div align="center">

| Metric | Score |
|--------|-------|
| ⚡ Performance | 95+ |
| ♿ Accessibility | 100 |
| 🎯 Best Practices | 100 |
| 🔍 SEO | 100 |

</div>

---

## 🔒 Security

- ✅ JWT authentication
- ✅ Email OTP verification
- ✅ Rate limiting
- ✅ Input validation (Zod)
- ✅ CORS configuration
- ✅ Secure headers
- ✅ Environment variables
- ✅ XSS protection

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 Scripts Reference

```bash
# Development
npm run dev              # Start dev server (port 9002)
npm run build           # Build for production
npm start              # Start production server
npm run lint           # Run ESLint

# Database
node scripts/ensure-admin.js                    # Create admin
node scripts/reset-admin.js                     # Reset password
node scripts/add-user-data.js                   # Add sample data
node scripts/add-education-data.js              # Add education
node scripts/add-certifications.js              # Add certs
node scripts/update-education-experience.js     # Update journey
```

---

## 🎨 Customization

### Theme Colors

Edit `src/app/globals.css`:

```css
:root {
  --primary: 182 100% 74%;    /* Electric Blue */
  --accent: 120 75% 55%;      /* Lime Green */
  --background: 0 0% 100%;    /* White */
  --foreground: 0 0% 3.9%;    /* Dark */
}

.dark {
  --background: 0 0% 3.9%;    /* Dark */
  --foreground: 0 0% 98%;     /* Light */
}
```

### Animations

Customize in `src/components/`:
- `particles-background.tsx` - Particle effects
- `floating-orbs.tsx` - Floating animations
- `cursor-follower.tsx` - Custom cursor
- `spotlight.tsx` - Spotlight effect

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

<div align="center">

Built with amazing technologies:

[Next.js](https://nextjs.org/) • [MongoDB](https://www.mongodb.com/) • [Tailwind CSS](https://tailwindcss.com/) • [Shadcn/ui](https://ui.shadcn.com/) • [Framer Motion](https://www.framer.com/motion/) • [Google Gemini](https://ai.google.dev/)

</div>

---

## 📞 Contact & Support

<div align="center">

**Questions? Issues? Suggestions?**

[Open an Issue](https://github.com/Aniruddha1701/Portfolio-2.0/issues) • [Email Support](mailto:your-email@gmail.com)

---

### ⭐ Star this repo if you find it helpful!

**Made with ❤️ by [Aniruddha](https://github.com/Aniruddha1701)**

</div>
