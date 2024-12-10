import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import QueryClientProvider
import LoadingSpinner from './components/LoadingSpinner';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import { ThemeProvider } from './contexts/ThemeContext';
import AdminRoute from './components/AdminRoute';

// Lazy load components
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Login = React.lazy(() => import('./pages/Login'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Course = React.lazy(() => import('./pages/Course'));
const Task = React.lazy(() => import('./pages/Task'));
const Setting = React.lazy(() => import('./pages/Setting'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Admin = React.lazy(() => import('./pages/Admin'));
const UserManager = React.lazy(() => import('./pages/UserManager'));
const CourseManager = React.lazy(() => import('./pages/CourseManager'));
const TaskManager = React.lazy(() => import('./pages/TaskManager'));
const Device = React.lazy(() => import('./pages/HardDevice'));
// const DeviceManager = React.lazy(() => import('./pages/DeviceManager'));

// Tạo QueryClient
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>

              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/device" element={<Device />} />
                <Route path="/course" element={<Course />} />
                <Route path="/task" element={<Task />} />
                <Route path="/setting" element={<Setting />} />
              </Route>

              {/* Admin Route */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/user-manager" element={<UserManager />} />
                <Route path="/admin/course-manager" element={<CourseManager />} />
                <Route path="/admin/task-manager" element={<TaskManager />} />
              </Route>

              {/* Special Routes */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />      </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider >
    </QueryClientProvider>
  );
};

export default App;