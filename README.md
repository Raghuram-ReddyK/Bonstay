# Bonstay - Hotel Booking Application

Bonstay is a full-featured hotel booking application built with React and Material-UI, featuring both user and admin interfaces. The application includes features like hotel booking management, user management, admin dashboard, and more.

## Features

- 🏨 Hotel browsing and booking
- 👤 User authentication and profile management
- 📊 Admin dashboard with analytics
- 📅 Booking management system
- 🔔 Real-time notifications
- 🌙 Dark/Light theme support
- 📱 Responsive design for all devices
- 🔒 Role-based access control
- 📈 System monitoring and activity logs

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Raghuram-ReddyK/Bonstay/tree/Admin-Changes-Data-Fetching <-or-> https://github.com/Raghuram-ReddyK/Bonstay.git
   cd Bonstay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the JSON Server (Mock Backend)**
   ```bash
   npm run server
   ```
   This will start the mock backend server on port 3002

4. **In a new terminal, start the React Application**
   ```bash
   npm start
   ```
   This will start the React application on port 3000

5. **Alternatively, run both frontend and backend concurrently**
   ```bash
   npm run dev
   ```

## Application Structure

- `/src` - Contains all React components and application logic
  - `/AdminDashboardComponents` - Admin dashboard related components
  - `/BonstayAfterLogin` - Components for authenticated users
  - `/CommonComponents` - Shared/reusable components
  - `/Navigation` - Navigation related components
  - `/hooks` - Custom React hooks
  - `/services` - API and other services
  - `/Slices` - Redux slices for state management
  - `/config` - Configuration files
  - `/Routes` - Application routing logic

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Tech Stack

- **Frontend Framework:** React.js
- **UI Library:** Material-UI (MUI)
- **State Management:** Redux Toolkit
- **Data Fetching:** SWR, Axios
- **Backend:** JSON Server
- **Routing:** React Router
- **Charts:** React Chart.js 2
- **Styling:** Emotion, Styled Components
- **Form Handling:** Material-UI Forms
- **Date Handling:** date-fns
- **Grid System:** AG Grid

## Authentication

- The application uses session-based authentication
- Admin and regular user roles are supported
- Protected routes ensure authorized access

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting Common Issues

1. **Port 3000 already in use**
   ```bash
   # Kill the process using port 3000
   npx kill-port 3000
   ```

2. **Port 3002 already in use**
   ```bash
   # Kill the process using port 3002
   npx kill-port 3002
   ```

3. **Module not found errors**
   ```bash
   # Clear npm cache and reinstall dependencies
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

## Support

For support or questions, please open an issue in the GitHub repository.
