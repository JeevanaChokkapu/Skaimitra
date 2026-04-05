import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { SkaiMitraLogo } from './SkaiMitraLogo';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, Bell, BookOpen, CheckCircle, ClipboardList, Clock, FileText, Home, LogOut, Play, Send, Settings } from 'lucide-react';
import bgImage from '../../assets/7280b9bb2443d06a2dd7ab56b34ecee081080853.png';

interface StudentDashboardNewProps {
  onLogout: () => void;
}

export function StudentDashboardNew({ onLogout }: StudentDashboardNewProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [question, setQuestion] = useState('');

  // Mock data
  const performanceData = [
    { subject: 'Math', score: 95 },
    { subject: 'Science', score: 92 },
    { subject: 'English', score: 88 },
    { subject: 'History', score: 90 },
    { subject: 'Hindi', score: 94 }
  ];

  const mySubjects = [
    { id: 1, name: 'Mathematics', teacher: 'Dr. Rajesh Kumar', progress: 75, totalLessons: 24, completedLessons: 18, grade: 'A' },
    { id: 2, name: 'Science', teacher: 'Ms. Priya Patel', progress: 82, totalLessons: 20, completedLessons: 16, grade: 'A' },
    { id: 3, name: 'English', teacher: 'Mr. Sharma', progress: 68, totalLessons: 22, completedLessons: 15, grade: 'B+' },
    { id: 4, name: 'History', teacher: 'Ms. Gupta', progress: 90, totalLessons: 18, completedLessons: 16, grade: 'A+' },
    { id: 5, name: 'Hindi', teacher: 'Mr. Verma', progress: 85, totalLessons: 20, completedLessons: 17, grade: 'A' }
  ];

  const assignments = [
    { id: 1, title: 'Algebra Quiz - Chapter 4', subject: 'Mathematics', dueDate: 'Feb 18, 2026', status: 'pending', points: 50 },
    { id: 2, title: 'Science Lab Report', subject: 'Science', dueDate: 'Feb 20, 2026', status: 'pending', points: 100 },
    { id: 3, title: 'Essay on Indian History', subject: 'History', dueDate: 'Feb 15, 2026', status: 'submitted', points: 75, score: 68 },
    { id: 4, title: 'Grammar Exercise', subject: 'English', dueDate: 'Feb 22, 2026', status: 'pending', points: 30 },
    { id: 5, title: 'Geometry Assignment', subject: 'Mathematics', dueDate: 'Feb 12, 2026', status: 'graded', points: 50, score: 48 }
  ];

  const recentActivity = [
    { text: 'New submission', detail: 'Aarav Mehta submitted Algebra Quiz', time: '2 hours ago' },
    { text: 'Assignment graded', detail: 'Completed grading for 8 students', time: '4 hours ago' }
  ];

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'subjects', label: 'My Subjects', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList }
  ];

  // Render content based on active tab
  const renderContent = () => {
    if (activeTab === 'subjects') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">My Subjects</h2>
            <p className="text-gray-600">View all your enrolled subjects and track progress</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {mySubjects.map((subject) => (
              <Card key={subject.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Teacher: {subject.teacher}</p>
                    </div>
                    <Badge className="bg-green-500">{subject.grade}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span className="font-medium">{subject.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                        style={{ width: `${subject.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{subject.completedLessons}/{subject.totalLessons} Lessons Completed</span>
                    <Button size="sm" variant="outline">
                      <Play className="w-4 h-4 mr-1" />
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'assignments') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Assignments</h2>
            <p className="text-gray-600">View and submit your assignments</p>
          </div>

          {/* Assignment Stats */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">3</h3>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">1</h3>
                    <p className="text-sm text-gray-600">Submitted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">1</h3>
                    <p className="text-sm text-gray-600">Graded</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assignments List */}
          <Card>
            <CardHeader>
              <CardTitle>All Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold">{assignment.title}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600">{assignment.subject}</span>
                        <span className="text-sm text-gray-500">Due: {assignment.dueDate}</span>
                        <span className="text-sm text-gray-500">{assignment.points} points</span>
                      </div>
                      {assignment.status === 'graded' && (
                        <p className="text-sm text-green-600 mt-1">Score: {assignment.score}/{assignment.points}</p>
                      )}
                    </div>
                    <Badge 
                      variant={
                        assignment.status === 'graded' ? 'default' :
                        assignment.status === 'submitted' ? 'secondary' : 'destructive'
                      }
                    >
                      {assignment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Default Home tab
    return (
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Stats and Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">5</h3>
                <p className="text-sm text-gray-600">Enrolled Courses</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">18/25</h3>
                <p className="text-sm text-gray-600">Completed Assignments</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">85%</h3>
                <p className="text-sm text-gray-600">Average Score</p>
              </CardContent>
            </Card>
          </div>

          {/* Assignments Due Soon */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-orange-600">Preview</span>
                    <h3 className="font-bold">Assignments Due Soon!</h3>
                  </div>
                  <p className="text-sm text-orange-600">You have 2 assignments due within the next 3 days.</p>
                </div>
                <Button variant="link" className="text-blue-600">View All</Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.text}</p>
                      <p className="text-sm text-gray-600">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Performance and Calendar */}
        <div className="space-y-6">
          {/* Subject Performance */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Subject Performance</h3>
              <p className="text-xs text-gray-600 mb-4">Compare your scores across subjects</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* School Calendar */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">School Calendar</h3>
                <Button variant="link" size="sm" className="text-xs text-blue-600">
                  Set new reminder date
                </Button>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium">February 2026</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">&lt;</Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">&gt;</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                    <div key={`day-${idx}-${day}`} className="font-medium text-gray-600 py-2">{day[0]}</div>
                  ))}
                  {Array.from({ length: 28 }, (_, i) => {
                    const isToday = i + 1 === 16;
                    return (
                      <div
                        key={`date-${i}`}
                        className={`py-2 rounded-lg ${
                          isToday ? 'bg-purple-600 text-white font-bold' : 'hover:bg-gray-100'
                        }`}
                      >
                        {i + 1}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ask a Question */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-2">
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question"
                  className="flex-1"
                />
                <Button className="bg-blue-600 hover:bg-blue-700" size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen bg-gray-50"
      style={{
        backgroundImage: activeTab === 'home' ? `url(${bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Welcome */}
            <SkaiMitraLogo subtitle="Welcome back, Aarav Mehta" />

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="outline" onClick={onLogout} size="sm" className="hidden sm:flex">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-purple-50 border-purple-600 text-purple-700'
                      : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}