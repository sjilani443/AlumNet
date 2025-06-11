
# AlumNet - Alumni Network Platform

AlumNet is a comprehensive platform designed to connect students with alumni, facilitating networking, mentorship, job opportunities, and professional growth.

## 🌟 Features

- **Authentication System**
  - Secure login and registration
  - Role-based access (Student/Alumni)
  - Profile management

- **Networking**
  - Connect with alumni
  - Company-based filtering
  - Professional profile viewing
  - Connection management

- **Messaging System**
  - Real-time chat functionality
  - File sharing capabilities
  - Message history
  - Unread message tracking

- **Job Portal**
  - Job listings and referrals
  - Application tracking
  - Company information
  - Job search and filtering

- **Events Management**
  - Event creation and management
  - Calendar view
  - Registration system
  - Event reminders

## 🚀 Tech Stack

### Frontend
- React.js
- Vite
- Context API for state management
- Modern UI components
- Responsive design

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- RESTful API

## 📦 Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/AlumNet.git
cd AlumNet
```

2. Install Frontend Dependencies
```bash
cd Frontend1
npm install
```

3. Install Backend Dependencies
```bash
cd ../backend
npm install
```

4. Set up environment variables
```bash
# In backend directory
cp .env.example .env
# Fill in your environment variables
```

5. Start the development servers
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd Frontend1
npm run dev
```

## 🔧 Configuration

Create a `.env` file in the backend directory with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## 📚 API Documentation

The API documentation is available at `/api-docs` when running the server. Key endpoints include:

- Authentication: `/api/auth/*`
- Users: `/api/users/*`
- Messages: `/api/messages/*`
- Events: `/api/events/*`
- Connections: `/api/connections/*`
- Referrals: `/api/referrals/*`

## 🧪 Testing

```bash
# Frontend tests
cd Frontend1
npm test

# Backend tests
cd backend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by the need for better alumni-student connections
- Built with modern web technologies

## 📞 Support

For support, email support@alumnet.com or open an issue in the repository.
