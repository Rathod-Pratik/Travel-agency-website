import Link from "next/link";
import {
  FiMap,
  FiCalendar,
  FiUsers,
  FiCreditCard,
  FiTrendingUp,
  FiPlus,
  FiArrowRight,
} from "react-icons/fi";

const stats = [
  {
    title: "Total Tours",
    value: "128",
    change: "+12% from last month",
    icon: FiMap,
  },
  {
    title: "Total Bookings",
    value: "1,420",
    change: "+8% from last month",
    icon: FiCalendar,
  },
  {
    title: "Active Users",
    value: "3,890",
    change: "+24% this month",
    icon: FiUsers,
  },
  {
    title: "Total Revenue",
    value: "$45,280",
    change: "+18% from last month",
    icon: FiCreditCard,
  },
];

const quickActions = [
  { label: "Create Tour", href: "/admin/tours/create", icon: FiPlus },
  { label: "View Bookings", href: "/admin/bookings", icon: FiCalendar },
  { label: "Manage Users", href: "/admin/users", icon: FiUsers },
];

export default function AdminPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Admin <span className="text-orange-500">Dashboard</span>
          </h1>
          <p className="text-sm text-gray-500">
            Welcome back! Here is what is happening with your travel agency today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/tours"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600"
          >
            <FiPlus size={16} />
            <span>Add New Tour</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-orange-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                  <Icon size={20} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="mt-1 flex items-center text-xs font-medium text-orange-600">
                  <FiTrendingUp className="mr-1 inline" size={14} />
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overview Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Actions Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <p className="text-sm text-gray-500">Fast shortcuts to frequent actions</p>

          <div className="mt-4 space-y-3">
            {quickActions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                >
                  <div className="flex items-center gap-3">
                    <ActionIcon className="text-orange-500" size={18} />
                    <span>{action.label}</span>
                  </div>
                  <FiArrowRight size={16} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Overview Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
              <p className="text-sm text-gray-500">Latest travel bookings made across the platform</p>
            </div>
            <Link
              href="/admin/bookings"
              className="text-sm font-medium text-orange-500 hover:text-orange-600 hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <FiCalendar size={24} />
            </div>
            <p className="mt-3 text-sm font-medium text-gray-700">No recent bookings pending</p>
            <p className="mt-1 text-xs text-gray-400">All current bookings have been processed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}