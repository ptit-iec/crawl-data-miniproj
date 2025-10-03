# 📰 TechNews - Next.js News Aggregation Platform

A modern, responsive news aggregation platform built with Next.js 15, specifically designed for technology news and articles. The application provides users with a seamless experience to browse, save, and favorite technology articles from various sources.

## 🚀 Quick Start
 Create `.env` file, copy content 

- Config API domain 

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 (or next available port)
```

## ✨ Features

- **🏠 Homepage**: Hero section with search and trending topics
- **📑 News Sections**: Dedicated pages for all news, favorites, and saved articles
- **❤️ Favorites System**: Mark articles as favorites with ratings
- **🔖 Save for Later**: Bookmark articles for future reading
- **📱 Responsive Design**: Mobile-first responsive design
- **🔍 Advanced Filters**: Category, sorting, and time range filters
- **📄 Pagination**: Efficient pagination with smooth navigation
- **🎨 Modern UI**: Dark theme with gradient backgrounds and glass effects

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.4 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.4.3
- **UI Components**: Radix UI + Custom components
- **Icons**: Lucide React
- **Runtime**: React 19.1.0

## 📖 Documentation

- **📋 [Project Documentation](./PROJECT_DOCUMENTATION.md)** - Comprehensive project overview
- **🏗️ [Technical Architecture](./TECHNICAL_ARCHITECTURE.md)** - System architecture and design patterns
- **👨‍💻 [Developer Guide](./DEVELOPER_GUIDE.md)** - Development guidelines and best practices

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── favorites/          # Favorites page
│   ├── news/              # All news page
│   ├── saved/             # Saved articles page
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── ui/               # Base UI components
│   └── All*.tsx          # Full-page list components
├── data/                 # Data layer and transformations
├── lib/                  # Utility functions
└── types/                # TypeScript definitions
```

## 🎨 Pages Overview

### Homepage (`/`)

- Hero section with search functionality
- Featured content and trending topics
- Favorites and saved articles previews

### All News (`/news`)

- Complete list of technology articles
- Advanced filtering and sorting
- Pagination with 10 articles per page
- Green/emerald theme

### Favorites (`/favorites`)

- User's favorite articles with ratings
- Like counts and engagement metrics
- Pink/red theme
- Rating system display

### Saved Articles (`/saved`)

- Bookmarked articles for later reading
- Category badges and save dates
- Blue/purple theme
- Reading time estimates

## 🧩 Key Components

### All\* Components

- **AllArticles**: Paginated news list (green theme)
- **AllFavorites**: Paginated favorites list (pink theme)
- **AllSaved**: Paginated saved articles list (blue theme)

### Layout Components

- **Hero**: Homepage hero with search and trending tags
- **Footer**: Site footer with links
- **MainContent**: Homepage featured content

### UI Components

- **Button**: Reusable button with variants
- **Input**: Form input with proper styling

## 📊 Data Architecture

The application uses a centralized data management system:

- **Base Articles**: 20 technology articles covering various topics
- **Type Transformations**: Convert base data for different contexts
- **Consistent Random**: Deterministic generation for stable rendering
- **Fixed Timestamps**: UTC-based dates to prevent hydration issues

## 🎯 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Debugging
rm -rf .next         # Clear Next.js cache
npm run build 2>&1   # Show build errors
```

## 🔧 Development Guidelines

### Component Development

- Use TypeScript for all components
- Follow mobile-first responsive design
- Implement proper loading and error states
- Use Tailwind CSS utility classes

### Styling Conventions

- **Favorites**: Pink/red color scheme (`pink-500`, `red-500`)
- **Saved**: Blue/purple color scheme (`blue-500`, `purple-500`)
- **News**: Green/emerald color scheme (`green-500`, `emerald-500`)
- **Background**: Dark theme (`slate-900`, `slate-800`)

### Code Organization

- **PascalCase**: Component names
- **camelCase**: Variables and functions
- **kebab-case**: File paths and CSS classes

## 🚀 Performance Features

- **Server-Side Rendering**: Next.js App Router SSR
- **Static Generation**: Optimized build output
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js image optimization
- **Hydration Safety**: Consistent server/client rendering

## 🔍 Troubleshooting

### Common Issues

**Hydration Errors**

- Fixed by using consistent timestamps in data generation
- All date generation uses fixed base dates

**Port Conflicts**

- Development server automatically uses next available port
- Check terminal output for actual port number

**Build Errors**

- Run `npm run lint` to check for code issues
- Run `npx tsc --noEmit` for TypeScript errors

## 🤝 Contributing

1. Follow the coding conventions in [Developer Guide](./DEVELOPER_GUIDE.md)
2. Ensure TypeScript types are properly defined
3. Test responsive design on multiple screen sizes
4. Maintain consistent theming across components

## 📄 License

This project is private and proprietary. All rights reserved.

---

**Version**: 0.1.0  
**Last Updated**: August 9, 2025  
**Next.js Version**: 15.4.4

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
