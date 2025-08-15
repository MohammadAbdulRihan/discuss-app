# SpeakSpace

A modern community discussion platform built with Next.js where users can create topics, share posts, and engage in meaningful conversations.

## 🚀 Features

- **Community Topics**: Create and explore discussion topics
- **Interactive Posts**: Share ideas and thoughts within topics  
- **Real-time Comments**: Engage with other community members
- **User Authentication**: Secure sign-in with GitHub and Google
- **Ownership Controls**: Only creators can delete their own content
- **Modern UI**: Clean, responsive design with Tailwind CSS

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **NextAuth.js v5** - Authentication with OAuth providers
- **Prisma** - Database ORM with SQLite
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components

## 🏃‍♂️ Getting Started

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd discuss-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see SpeakSpace in action!

## 📱 Usage

1. **Sign In**: Use GitHub or Google to authenticate
2. **Create Topics**: Start new discussion topics
3. **Share Posts**: Add posts to existing topics
4. **Comment**: Engage with community posts
5. **Manage Content**: Delete your own topics and posts

## 🔧 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── actions/            # Server actions for data mutations
├── lib/                # Utilities and database queries
└── auth.ts             # Authentication configuration
```

## 🚀 Deployment

SpeakSpace can be deployed on [Vercel](https://vercel.com) with zero configuration:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Make sure to add your environment variables in the Vercel dashboard.

---

Built with ❤️ using Next.js and modern web technologies.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
