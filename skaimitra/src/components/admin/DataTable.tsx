import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const courses = [
  { name: "React Masterclass", instructor: "Sarah Wilson", students: 1240, revenue: "$24,800", status: "Active", progress: 78 },
  { name: "Python for Data Science", instructor: "Mike Chen", students: 980, revenue: "$19,600", status: "Active", progress: 65 },
  { name: "UI/UX Design Bootcamp", instructor: "Emily Rose", students: 756, revenue: "$15,120", status: "Active", progress: 92 },
  { name: "Node.js Backend Dev", instructor: "James Park", students: 620, revenue: "$12,400", status: "Draft", progress: 34 },
  { name: "Machine Learning A-Z", instructor: "Lisa Wang", students: 1520, revenue: "$30,400", status: "Active", progress: 88 },
  { name: "Cloud Architecture", instructor: "David Kim", students: 430, revenue: "$8,600", status: "Paused", progress: 45 },
];

const statusStyles: Record<string, string> = {
  Active: "bg-success/10 text-success",
  Draft: "bg-warning/10 text-warning",
  Paused: "bg-muted text-muted-foreground",
};

const DataTable = () => {
  return (
    <div className="rounded-xl border bg-card shadow-card">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h3 className="text-base font-semibold text-card-foreground">Popular Courses</h3>
          <p className="text-sm text-muted-foreground">Top performing courses this quarter</p>
        </div>
        <button className="rounded-lg border bg-secondary px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Course</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Instructor</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Students</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Revenue</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Progress</th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {courses.map((course) => (
              <tr key={course.name} className="transition-colors hover:bg-muted/30">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-card-foreground">{course.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{course.instructor}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{course.students.toLocaleString()}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-card-foreground">{course.revenue}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", statusStyles[course.status])}>
                    {course.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{course.progress}%</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <button className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
