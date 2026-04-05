import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { SkaiMitraLogo } from './SkaiMitraLogo';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Award, Beaker, Bell, BookOpen, ClipboardList, Clock, FileText, FileUp, Home, LogOut, MessageSquare, Plus, Play, Send, Settings, Trash2, Upload, Users } from 'lucide-react';
import bgImage from '../../assets/7280b9bb2443d06a2dd7ab56b34ecee081080853.png';

interface TeacherDashboardNewProps {
  onLogout: () => void;
}

export function TeacherDashboardNew({ onLogout }: TeacherDashboardNewProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [question, setQuestion] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');

  // Mock data
  const submissionsData = [
    { class: 'Class 6', pending: 45, graded: 65, total: 110 },
    { class: 'Class 7', pending: 30, graded: 80, total: 110 },
    { class: 'Class 8', pending: 25, graded: 90, total: 115 }
  ];

  const performanceData = [
    { week: 'Week 1', score: 75 },
    { week: 'Week 2', score: 78 },
    { week: 'Week 3', score: 82 },
    { week: 'Week 4', score: 85 },
    { week: 'Week 5', score: 88 }
  ];

  const lessonPlans = [
    { id: 1, title: 'Introduction to Algebra', subject: 'Mathematics', class: 'Class 6', date: 'Feb 18, 2026', status: 'published' },
    { id: 2, title: 'Photosynthesis Process', subject: 'Science', class: 'Class 7', date: 'Feb 19, 2026', status: 'draft' },
    { id: 3, title: 'English Grammar Basics', subject: 'English', class: 'Class 6', date: 'Feb 20, 2026', status: 'published' }
  ];

  const labActivities = [
    { id: 1, title: 'Chemistry Lab: Acid-Base Reactions', class: 'Class 8', duration: '45 min', status: 'active' },
    { id: 2, title: 'Physics Lab: Simple Pendulum', class: 'Class 7', duration: '60 min', status: 'scheduled' },
    { id: 3, title: 'Biology Lab: Cell Structure', class: 'Class 6', duration: '50 min', status: 'completed' }
  ];

  const assignments = [
    { id: 1, title: 'Algebra Quiz', class: 'Class 6', dueDate: 'Feb 20, 2026', submissions: 35, total: 40 },
    { id: 2, title: 'Science Project', class: 'Class 7', dueDate: 'Feb 22, 2026', submissions: 28, total: 38 },
    { id: 3, title: 'Essay Writing', class: 'Class 8', dueDate: 'Feb 25, 2026', submissions: 30, total: 42 }
  ];

  const pendingGrading = [
    { assignment: 'Algebra Quiz - Chapter 4', course: 'Mathematics - Class 6', student: 'Aarav Mehta', submitted: '2 hours ago' },
    { assignment: 'Geometry Assignment', course: 'Mathematics - Class 7', student: 'Diya Sharma', submitted: '5 hours ago' }
  ];

  const studentGrades = [
    { id: 1, name: 'Aarav Mehta', class: 'Class 6', math: 95, science: 92, english: 88, overall: 91.7 },
    { id: 2, name: 'Diya Sharma', class: 'Class 7', math: 88, science: 90, english: 92, overall: 90 },
    { id: 3, name: 'Rohan Verma', class: 'Class 8', math: 82, science: 85, english: 80, overall: 82.3 }
  ];

  const recentActivity = [
    { text: 'New submission', detail: 'Aarav Mehta submitted Algebra Quiz', time: '2 hours ago' },
    { text: 'Assignment graded', detail: 'Completed grading for 8 students', time: '4 hours ago' }
  ];

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'lesson', label: 'Lesson Planning', icon: BookOpen },
    { id: 'lab', label: 'Lab Activity Designer', icon: Beaker },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList },
    { id: 'grades', label: 'Grades', icon: Award },
    { id: 'content', label: 'Content Upload', icon: FileUp }
  ];

  const handlePostAnnouncement = () => {
    setAnnouncement('');
    setAnnouncementTitle('');
  };

  // Render content based on active tab
  const renderContent = () => {
    if (activeTab === 'lesson') {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Lesson Planning</h2>
              <p className="text-gray-600">Create and manage AI-powered lesson plans</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Lesson Plan
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            {lessonPlans.map((lesson) => (
              <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{lesson.title}</CardTitle>
                    <Badge variant={lesson.status === 'published' ? 'default' : 'secondary'}>
                      {lesson.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Subject:</span> {lesson.subject}</p>
                    <p><span className="font-medium">Class:</span> {lesson.class}</p>
                    <p><span className="font-medium">Date:</span> {lesson.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                    <Button size="sm" variant="outline" className="flex-1">View</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'lab') {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Lab Activity Designer</h2>
              <p className="text-gray-600">Design engaging laboratory activities</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Lab Activity
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {labActivities.map((lab) => (
              <Card key={lab.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{lab.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{lab.class} • {lab.duration}</p>
                    </div>
                    <Badge variant={
                      lab.status === 'active' ? 'default' :
                      lab.status === 'scheduled' ? 'secondary' : 'outline'
                    }>
                      {lab.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                  <Button size="sm" variant="outline" className="flex-1">Materials</Button>
                  <Button size="sm" className="flex-1">Start Lab</Button>
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Assignments</h2>
              <p className="text-gray-600">Create and manage student assignments</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Active Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{assignment.title}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600">{assignment.class}</span>
                        <span className="text-sm text-gray-500">Due: {assignment.dueDate}</span>
                      </div>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-semibold">{assignment.submissions}/{assignment.total}</p>
                      <p className="text-xs text-gray-600">Submissions</p>
                    </div>
                    <Button size="sm">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeTab === 'grades') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Student Grades</h2>
            <p className="text-gray-600">View and manage student performance</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Grade Book</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Student Name</th>
                      <th className="text-left p-3">Class</th>
                      <th className="text-center p-3">Math</th>
                      <th className="text-center p-3">Science</th>
                      <th className="text-center p-3">English</th>
                      <th className="text-center p-3">Overall</th>
                      <th className="text-center p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentGrades.map((student) => (
                      <tr key={student.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{student.name}</td>
                        <td className="p-3">{student.class}</td>
                        <td className="p-3 text-center">{student.math}%</td>
                        <td className="p-3 text-center">{student.science}%</td>
                        <td className="p-3 text-center">{student.english}%</td>
                        <td className="p-3 text-center">
                          <Badge className="bg-green-500">{student.overall}%</Badge>
                        </td>
                        <td className="p-3 text-center">
                          <Button size="sm" variant="outline">Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeTab === 'content') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Content Upload</h2>
            <p className="text-gray-600">Upload learning materials and resources</p>
          </div>

          <Card>
            <CardContent className="p-12">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Upload Course Content</h3>
                  <p className="text-gray-600 mb-4">Drag and drop files or click to browse</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Select Files
                </Button>
                <p className="text-xs text-gray-500">Supported formats: PDF, DOCX, PPTX, MP4, MP3</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Chapter 4 - Algebra.pdf', size: '2.4 MB', date: 'Feb 15, 2026' },
                  { name: 'Science Presentation.pptx', size: '5.1 MB', date: 'Feb 14, 2026' },
                  { name: 'Lecture Video.mp4', size: '45.3 MB', date: 'Feb 13, 2026' }
                ].map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-gray-600">{file.size} • {file.date}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">View</Button>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-1">4</h3>
                <p className="text-sm text-gray-600">My Courses</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-1">145</h3>
                <p className="text-sm text-gray-600">Total Students</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-1">23</h3>
                <p className="text-sm text-gray-600">Pending Submissions</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-1">82%</h3>
                <p className="text-sm text-gray-600">Avg. Performance</p>
              </CardContent>
            </Card>
          </div>

          {/* Pending Grading */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Pending Grading</h3>
              <p className="text-sm text-gray-600 mb-4">Recent submissions awaiting your review</p>
              <div className="space-y-3">
                {pendingGrading.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.assignment}</p>
                      <p className="text-xs text-gray-600">{item.course}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.student} • {item.submitted}</p>
                    </div>
                    <Button size="sm" className="bg-black hover:bg-gray-800">
                      Grade Now
                    </Button>
                  </div>
                ))}
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

        {/* Right Column - Charts */}
        <div className="space-y-6">
          {/* Assignment Submissions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Assignment Submissions</h3>
              <p className="text-xs text-gray-600 mb-4">Submission status by class</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={submissionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="class" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="pending" stackId="a" fill="#FB923C" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="graded" stackId="a" fill="#10B981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Student Performance Trend */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Student Performance Trend</h3>
              <p className="text-xs text-gray-600 mb-4">Average scores over 5 weeks</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
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
            <SkaiMitraLogo subtitle="Welcome back, Dr. Rajesh Kumar" />

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">New Announcement</span>
                    <span className="sm:hidden">Post</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Announcement</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={announcementTitle}
                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                        placeholder="Enter announcement title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Textarea
                        value={announcement}
                        onChange={(e) => setAnnouncement(e.target.value)}
                        placeholder="Write your announcement here..."
                        rows={4}
                      />
                    </div>
                    <Button onClick={handlePostAnnouncement} className="w-full">
                      Post Announcement
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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