# SplitEase

SplitEase is a modern, user-friendly application designed to simplify expense sharing and bill splitting among friends, roommates, and groups. The application provides an intuitive interface for tracking shared expenses, settling debts, and maintaining financial transparency within groups.

## 🚀 Project Status

The project is currently in active development:

- ✅ Frontend implementation (React, Next.js)
- 🔄 Backend services (in progress)
- 🔄 Advanced features (planned)

## 🔧 Technical Stack

### Frontend
- **Framework**: Next.js 15
- **UI Library**: React 
- **Styling**: Tailwind CSS with ShadCN UI components
- **Authentication**: NextAuth.js
- **State Management**: React Context API and Hooks

### Backend (Planned)
- **Database**: MongoDB
- **API**: RESTful API with Express.js
- **Real-time**: WebSockets for live updates (planned)
- **Notifications**: Email and push notifications (planned)

## ✨ Current Features

### User Management
- [x] User registration and authentication
- [x] User profile management
- [x] Secure password handling

### Dashboard
- [x] Overview of expenses and balances
- [x] Navigation between different sections
- [x] Responsive design for mobile and desktop

### Transaction Management
- [x] Basic expense creation
- [x] Transaction history view
- [ ] Advanced filtering and sorting (coming soon)

### Friend Management
- [x] Add and view friends
- [x] Group creation
- [ ] Group expense splitting (coming soon)

## 🗺️ Roadmap

### Short-term Goals
- Implement backend services for better data management
- Add expense categories and tags
- Enhance transaction history with search and filter options
- Implement email notifications for expense reminders

### Mid-term Goals
- Add support for recurring expenses
- Implement currency conversion for international groups
- Create mobile apps for iOS and Android
- Add image upload for receipts and expense documentation

### Long-term Vision
- Integrate with payment providers for direct settlements
- Add budgeting and financial analytics
- Implement AI-driven insights for spending patterns
- Expand multi-language support

## 🧪 Development Branches

- **main**: Stable releases with comprehensive documentation
- **dev**: Active development with latest features (may contain experimental features)

## 📦 Installation

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn
- MongoDB (for future backend integration)

### Setup Instructions
1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secure_secret_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ by the SplitEase team
