"use client";

import { useState } from "react";
import {
  FiCreditCard,
  FiSearch,
  FiFilter,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
  FiArrowUpRight,
  FiDownload,
  FiAlertCircle,
} from "react-icons/fi";

interface PaymentItem {
  id: string;
  transactionId: string;
  customerName: string;
  tourTitle: string;
  amount: number;
  currency: string;
  method: "Razorpay" | "Credit Card" | "UPI" | "Net Banking";
  status: "Completed" | "Pending" | "Refunded" | "Failed";
  date: string;
}

const initialPayments: PaymentItem[] = [
  {
    id: "pay-1",
    transactionId: "pay_Rzp8921829",
    customerName: "Alexander Wright",
    tourTitle: "Bali Tropical Paradise & Islands Escape",
    amount: 1798,
    currency: "USD",
    method: "Razorpay",
    status: "Completed",
    date: "2026-08-20 14:32",
  },
  {
    id: "pay-2",
    transactionId: "pay_Rzp8921830",
    customerName: "Sophia Chen",
    tourTitle: "Swiss Alps Adventure & Glacier Express",
    amount: 1450,
    currency: "USD",
    method: "Credit Card",
    status: "Completed",
    date: "2026-08-22 09:15",
  },
  {
    id: "pay-3",
    transactionId: "pay_Rzp8921831",
    customerName: "Liam Johnson",
    tourTitle: "Kyoto Heritage & Historic Temples",
    amount: 3360,
    currency: "USD",
    method: "UPI",
    status: "Pending",
    date: "2026-08-24 18:45",
  },
  {
    id: "pay-4",
    transactionId: "pay_Rzp8921832",
    customerName: "Olivia Davis",
    tourTitle: "Paris Romance & Loire Valley Castles",
    amount: 1500,
    currency: "USD",
    method: "Credit Card",
    status: "Refunded",
    date: "2026-08-10 11:20",
  },
  {
    id: "pay-5",
    transactionId: "pay_Rzp8921833",
    customerName: "Daniel Martinez",
    tourTitle: "Dubai Desert Safari & Luxury Skylines",
    amount: 3960,
    currency: "USD",
    method: "Razorpay",
    status: "Completed",
    date: "2026-08-25 16:02",
  },
];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      p.tourTitle.toLowerCase().includes(search.toLowerCase()) ||
      p.method.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRefund = (id: string) => {
    if (confirm("Are you sure you want to issue a refund for this transaction?")) {
      setPayments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "Refunded" } : p))
      );
    }
  };

  const totalCompleted = payments
    .filter((p) => p.status === "Completed")
    .reduce((acc, p) => acc + p.amount, 0);

  const totalRefunded = payments
    .filter((p) => p.status === "Refunded")
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payment & <span className="text-orange-500">Transactions</span>
          </h1>
          <p className="text-sm text-gray-500">
            Audit gateway logs, settled charges, refunds, and order payment history.
          </p>
        </div>

        <button
          onClick={() => alert("Exporting transaction report CSV...")}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
        >
          <FiDownload size={16} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Settled Volume</span>
            <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <FiDollarSign size={18} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">${totalCompleted.toLocaleString()}</p>
          <p className="mt-1 text-xs text-emerald-600 font-medium">Successfully processed</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Completed Orders</span>
            <span className="rounded-lg bg-orange-50 p-2 text-orange-500">
              <FiCheckCircle size={18} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {payments.filter((p) => p.status === "Completed").length}
          </p>
          <p className="mt-1 text-xs text-gray-500">Paid customer orders</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Pending Orders</span>
            <span className="rounded-lg bg-amber-50 p-2 text-amber-500">
              <FiClock size={18} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {payments.filter((p) => p.status === "Pending").length}
          </p>
          <p className="mt-1 text-xs text-amber-600 font-medium">Awaiting settlement</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Refunded</span>
            <span className="rounded-lg bg-red-50 p-2 text-red-500">
              <FiRefreshCw size={18} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">${totalRefunded.toLocaleString()}</p>
          <p className="mt-1 text-xs text-red-500 font-medium">Cancelled bookings</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by transaction ID, customer, tour, or gateway..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FiFilter className="text-orange-500" size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="border-b border-gray-200 bg-gray-50/75 text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Tour Item</th>
                <th className="px-6 py-4">Gateway / Method</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((pay) => (
                  <tr key={pay.id} className="transition hover:bg-orange-50/40">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-orange-600">
                      {pay.transactionId}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {pay.customerName}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {pay.tourTitle}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
                        <FiCreditCard className="text-orange-500" />
                        {pay.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      ${pay.amount.toLocaleString()} <span className="text-xs font-normal text-gray-500">{pay.currency}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{pay.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          pay.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : pay.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : pay.status === "Refunded"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {pay.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {pay.status === "Completed" ? (
                        <button
                          onClick={() => handleRefund(pay.id)}
                          title="Issue refund"
                          className="rounded px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Refund
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    No transactions found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
          <p className="text-xs text-gray-500">
            Showing <span className="font-medium">{filteredPayments.length}</span> of{" "}
            <span className="font-medium">{payments.length}</span> transactions
          </p>
          <div className="flex gap-1">
            <button className="rounded px-2.5 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-50">
              Prev
            </button>
            <button className="rounded bg-orange-500 px-2.5 py-1 text-xs font-semibold text-white">
              1
            </button>
            <button className="rounded px-2.5 py-1 text-xs text-gray-500 hover:bg-gray-100">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
