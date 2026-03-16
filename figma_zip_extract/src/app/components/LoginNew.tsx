import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { GraduationCap, ChevronLeft, ChevronRight, BookOpen, Users, BarChart3, Brain, Sparkles, Shield, Presentation, X } from 'lucide-react';
import { DetailedFeatureGuide } from './DetailedFeatureGuide';

interface LoginNewProps {
  onLogin: (role: 'admin' | 'teacher' | 'student') => void;
  onForgotPassword: () => void;
}

export function LoginNew({ onLogin, onForgotPassword }: LoginNewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'teacher' | 'student'>('student');
  const [currentFeature, setCurrentFeature] = useState(0);
  const [showFeatureGuide, setShowFeatureGuide] = useState(false);

  const roleInfo = {
    admin: { email: 'admin@school.edu', name: 'Administrator' },
    teacher: { email: 'teacher@school.edu', name: 'Teacher' },
    student: { email: 'student@school.edu', name: 'Student' }
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'SkaiMitra AI assistant provides personalized guidance, instant answers, and smart recommendations for students and teachers.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: BookOpen,
      title: 'CBSE-Aligned Curriculum',
      description: 'Complete coverage of Classes 6-8 with CK-12 FlexBooks integration, lesson planning tools, and comprehensive learning resources.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Role-Based Dashboards',
      description: 'Customized interfaces for Administrators, Teachers, and Students with relevant tools and insights for each role.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Real-time performance tracking, attendance monitoring, and comprehensive reports to drive data-informed decisions.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Sparkles,
      title: 'Interactive Lab Activities',
      description: 'Engaging lab activity designer with virtual experiments, practical tasks, and hands-on learning experiences.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Shield,
      title: 'Secure & Scalable',
      description: 'Enterprise-grade security with role-based permissions, data protection, and cloud-based infrastructure.',
      color: 'from-cyan-500 to-blue-500'
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [features.length]);

  const handleLogin = () => {
    // Login with selected role
    onLogin(selectedRole);
  };

  const nextFeature = () => {
    setCurrentFeature((prev) => (prev + 1) % features.length);
  };

  const prevFeature = () => {
    setCurrentFeature((prev) => (prev - 1 + features.length) % features.length);
  };

  const FeatureIcon = features[currentFeature].icon;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Feature Showcase Button - Floating */}
      <Button
        onClick={() => setShowFeatureGuide(true)}
        className="fixed bottom-6 right-6 z-50 h-14 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-xl rounded-full flex items-center gap-2 font-semibold"
      >
        <Presentation className="w-5 h-5" />
        Feature Showcase
      </Button>

      {/* Feature Guide Modal */}
      {showFeatureGuide && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setShowFeatureGuide(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[90vh]">
              <DetailedFeatureGuide />
            </div>
          </div>
        </div>
      )}

      <Card className="w-full max-w-5xl overflow-hidden shadow-2xl">
        <div className="grid md:grid-cols-2">
          {/* Left Side - Feature Showcase */}
          <div 
            className={`relative p-8 md:p-12 flex flex-col justify-between text-white bg-gradient-to-br ${features[currentFeature].color}`}
          >
            {/* Decorative Circles */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full"></div>
            
            <div className="relative z-10 flex-1 flex flex-col justify-between">
              {/* Logo and Brand */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h1 className="text-3xl font-bold">SkaiMitra</h1>
              </div>

              {/* Feature Content */}
              <div className="my-8">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                  <FeatureIcon className="w-9 h-9" />
                </div>
                
                <h2 className="text-3xl font-bold leading-tight mb-4">
                  {features[currentFeature].title}
                </h2>
                
                <p className="text-lg text-white/90 leading-relaxed">
                  {features[currentFeature].description}
                </p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFeature(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentFeature 
                          ? 'w-8 bg-white' 
                          : 'w-2 bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Go to feature ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={prevFeature}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                    aria-label="Previous feature"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextFeature}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                    aria-label="Next feature"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 text-sm text-white/80 mt-6">
              Powered by Advaitecs
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white p-8 md:p-12 flex flex-col justify-center">
            <CardContent className="p-0 space-y-6">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Welcome Back</h3>
                <p className="text-sm text-gray-600 mt-1">Sign in to access your dashboard</p>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Login As</Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value) => setSelectedRole(value as 'admin' | 'teacher' | 'student')}
                >
                  <SelectTrigger className="w-full h-12 px-4 border-2 border-gray-200 rounded-md focus:border-blue-500">
                    <SelectValue placeholder="Select role" />
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

              {/* Username */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Username</Label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-md focus:border-blue-500"
                  placeholder={roleInfo[selectedRole].email}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-md focus:border-blue-500"
                  placeholder="Enter password"
                />
              </div>

              {/* Login Button */}
              <Button
                onClick={handleLogin}
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white rounded-full text-base font-medium"
              >
                Login as {roleInfo[selectedRole].name}
              </Button>

              {/* Terms and Forgot Password */}
              <div className="space-y-2 text-center">
                <p className="text-xs text-gray-600">
                  By continuing, you agree to our{' '}
                  <button className="text-blue-600 hover:underline">Terms of Service</button> and{' '}
                  <button className="text-blue-600 hover:underline">Privacy Policy</button>
                </p>
                <button 
                  onClick={onForgotPassword}
                  className="text-sm text-purple-600 hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Demo Info */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                <p className="text-xs font-semibold text-gray-800 mb-2">📌 Demo Access:</p>
                <div className="text-xs text-gray-700 space-y-1">
                  <p>1. Select your role from the dropdown above</p>
                  <p>2. Enter any username and password</p>
                  <p>3. Click "Login" to access the dashboard</p>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}
