import { Clock, LayoutGrid, MessageSquare, Users } from "lucide-react";

const StatsOverview = ({ data }: { data: any }) => {
  // Mapping the data from your Prisma schema
  const stats = [
    {
      label: "Total Posts",
      value: data?.totalPosts || 0,
      icon: <LayoutGrid className="w-6 h-6 text-blue-600" />,
      bgColor: "bg-blue-100",
    },
    {
      label: "Total Users",
      value: data?.totalUsers || 0,
      icon: <Users className="w-6 h-6 text-green-600" />,
      bgColor: "bg-green-100",
    },
    {
      label: "Pending Posts",
      value: data?.pendingPosts || 0,
      icon: <Clock className="w-6 h-6 text-amber-600" />,
      bgColor: "bg-amber-100",
    },
    {
      label: "Total SMS",
      value: data?.totalSms || 0,
      icon: <MessageSquare className="w-6 h-6 text-purple-600" />,
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">
                  {stat.value.toLocaleString()}
                </h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsOverview;
