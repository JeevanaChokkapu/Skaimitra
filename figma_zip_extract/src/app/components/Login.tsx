import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { GraduationCap, User, Mail, Lock, UserCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'admin' | 'teacher' | 'student') => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'teacher' | 'student'>('student');

  const handleLogin = () => {
    if (selectedRole) {
      onLogin(selectedRole);
    }
  };

  const roleInfo = {
    admin: { email: 'admin@school.edu', color: 'text-purple-600' },
    teacher: { email: 'teacher@school.edu', color: 'text-blue-600' },
    student: { email: 'student@school.edu', color: 'text-green-600' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduPlatform LMS
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 px-4">Modern Learning Management System for CBSE Schools</p>
        </div>

        {/* Single Login Form */}
        <Card className="max-w-md mx-auto shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl sm:text-2xl">Welcome Back</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Role Selection Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm">Login As</Label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
                <Select value={selectedRole} onValueChange={(value: 'admin' | 'teacher' | 'student') => setSelectedRole(value)}>
                  <SelectTrigger className="pl-10 text-sm">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span>Administrator</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="teacher">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span>Teacher</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="student">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Student</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder={roleInfo[selectedRole].email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
            </div>

            {/* Demo Credentials Info */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800">
                <span className="font-semibold">Demo Login:</span> {roleInfo[selectedRole].email}
              </p>
              <p className="text-xs text-blue-600 mt-1">Password: Any password</p>
            </div>

            {/* Sign In Button */}
            <Button className="w-full text-sm sm:text-base" onClick={handleLogin} size="lg">
              Sign In
            </Button>

            {/* Forgot Password Link */}
            <div className="text-center">
              <Button variant="link" size="sm" className="text-xs sm:text-sm">
                Forgot Password?
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-2">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-1 text-sm sm:text-base">CBSE Aligned</h3>
            <p className="text-xs sm:text-sm text-gray-600">Content mapped to CBSE curriculum for Classes 6-8</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-1 text-sm sm:text-base">Role-Based Access</h3>
            <p className="text-xs sm:text-sm text-gray-600">Customized dashboards for admins, teachers, and students</p>
          </div>
          <div className="text-center sm:col-span-2 md:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-1 text-sm sm:text-base">Complete Analytics</h3>
            <p className="text-xs sm:text-sm text-gray-600">Track student progress and performance metrics</p>
          </div>
        </div>
      </div>
    </div>
  );
}