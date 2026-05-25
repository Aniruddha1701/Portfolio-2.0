# Portfolio 2.0

Modern, full-stack portfolio built with Next.js, TypeScript, and MongoDB. Includes a secure admin dashboard, AI-powered content modules, and a polished, responsive UI.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-latest-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Aniruddha1701-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/Aniruddha1701)

## Preview

![Portfolio preview](public/preview.png)

## Highlights

- **Modern UI** with dark/light modes, smooth transitions, and responsive layouts.
- **Admin dashboard** with OTP-based auth, JWT sessions, and content management.
- **AI features** powered by Gemini (optional).
- **Performance-focused** with PWA support, optimized images, and SEO-friendly metadata.

## Tech Stack

**Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui

**Backend**: Node.js, Next.js API routes, MongoDB, Mongoose, JWT

**Integrations**: Google Gemini (optional), Nodemailer, Zod

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Gmail SMTP credentials
- Optional: Google AI API key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Aniruddha1701/Portfolio-2.0.git
cd Portfolio-2.0

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local

# 4. Initialize the admin user
node scripts/ensure-admin.js

# 5. Start the dev server
npm run dev
```

App runs at: http://localhost:9002

## Environment Variables

Create `.env.local` at the repository root.

```env
# Database
MONGODB_URI=mongodb://localhost:27017/portfolio

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_TO=recipient@gmail.com

# Security
JWT_SECRET=your-super-secret-jwt-key

# AI Features (Optional)
GOOGLE_API_KEY=your-google-ai-api-key

# Application
NEXT_PUBLIC_URL=http://localhost:9002
```

## Scripts

```bash
npm run dev     # Start dev server
npm run build   # Build for production
npm start       # Start production server
npm run lint    # Run ESLint
```

## Project Structure

```
src/
  app/            # Next.js App Router
  components/     # UI components
  lib/            # Utilities & services
  models/         # Mongoose models
  ai/             # AI flows and configuration
public/           # Static assets
scripts/          # Admin & data scripts
```

## Deployment

**Vercel** is recommended. Add all environment variables and deploy from the GitHub repo.

For Docker usage, see `DEPLOYMENT_FIX.md` or `VERCEL_DEPLOYMENT_GUIDE.md` for more details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-change`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push to your branch and open a Pull Request

## License

MIT License. See [LICENSE](LICENSE).

## Contact

Open an issue for bugs or feature requests:
- https://github.com/Aniruddha1701/Portfolio-2.0/issues

GitHub profile:
- https://github.com/Aniruddha1701
