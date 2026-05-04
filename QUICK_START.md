# Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 3. Switch Between User and Doctor Interfaces

#### To Access User Interface (Default)
- Just open the app - it defaults to user interface
- Or run in browser console:
```javascript
localStorage.removeItem('userRole');
window.location.reload();
```

#### To Access Doctor Interface
- Run in browser console:
```javascript
localStorage.setItem('userRole', 'doctor');
window.location.reload();
```

## 📍 Quick Navigation

### User Interface
- Landing: `http://localhost:5173/`
- Login: `http://localhost:5173/login`
- Dashboard: `http://localhost:5173/dashboard`
- Chat: `http://localhost:5173/chat`

### Doctor Interface
- Dashboard: `http://localhost:5173/doctor/dashboard`

## 🏗️ Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## 🧪 Run Tests

```bash
npm run test
```

## 📝 Project Status

✅ **Merged Successfully**
- User frontend integrated
- Doctor frontend integrated
- Routing configured
- All features preserved
- Ready for development

## ⚠️ Important Notes

1. **No UI changes** - Both interfaces look exactly as they did before
2. **All features work** - No functionality was removed
3. **Clean structure** - Well-organized folders for easy maintenance
4. **Type-safe** - Full TypeScript support maintained
