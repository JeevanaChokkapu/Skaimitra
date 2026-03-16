import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const enrollmentData = [
  { month: "Jan", students: 120 },
  { month: "Feb", students: 180 },
  { month: "Mar", students: 250 },
  { month: "Apr", students: 310 },
  { month: "May", students: 280 },
  { month: "Jun", students: 420 },
  { month: "Jul", students: 380 },
  { month: "Aug", students: 460 },
  { month: "Sep", students: 520 },
  { month: "Oct", students: 490 },
  { month: "Nov", students: 580 },
  { month: "Dec", students: 640 },
];

const revenueData = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 5800 },
  { month: "Mar", revenue: 7200 },
  { month: "Apr", revenue: 6800 },
  { month: "May", revenue: 8400 },
  { month: "Jun", revenue: 9600 },
  { month: "Jul", revenue: 8800 },
  { month: "Aug", revenue: 11200 },
  { month: "Sep", revenue: 10400 },
  { month: "Oct", revenue: 12800 },
  { month: "Nov", revenue: 13600 },
  { month: "Dec", revenue: 15200 },
];

const ChartSection = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Enrollment Chart */}
      <div className="rounded-xl border bg-card p-6 shadow-card">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-card-foreground">Student Enrollments</h3>
            <p className="text-sm text-muted-foreground">Monthly enrollment trends</p>
          </div>
          <select className="rounded-lg border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option>This Year</option>
            <option>Last Year</option>
          </select>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={enrollmentData}>
              <defs>
                <linearGradient id="enrollGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(234, 89%, 63%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(234, 89%, 63%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(220, 13%, 91%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07)",
                }}
              />
              <Area
                type="monotone"
                dataKey="students"
                stroke="hsl(234, 89%, 63%)"
                strokeWidth={2}
                fill="url(#enrollGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="rounded-xl border bg-card p-6 shadow-card">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-card-foreground">Revenue Overview</h3>
            <p className="text-sm text-muted-foreground">Monthly revenue breakdown</p>
          </div>
          <select className="rounded-lg border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option>This Year</option>
            <option>Last Year</option>
          </select>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(220, 13%, 91%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07)",
                }}
              />
              <Bar dataKey="revenue" fill="hsl(234, 89%, 63%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
