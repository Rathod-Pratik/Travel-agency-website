import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { apiClient } from "../../lib/api-Client";
import { GET_ALL_STATE } from "../../Utils/Constant";

const Admin = () => {
  const [stats, SetStat] = useState(null);

  const FetchData = async () => {
    try {
      const response = await apiClient.get(GET_ALL_STATE);

      if (response.status === 200) {
        SetStat(response.data);
        console.log(response.data);
      } else {
        toast.error("Failed to Fetch Data");
      }
    } catch (error) {
      toast.error("Some error occurred");
      console.log(error);
    }
  };

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📊 Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <p className="text-gray-500 mb-2">Total Payment</p>
          <h2 className="text-2xl font-bold text-green-600">₹ {stats?.totalRevenue}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <p className="text-gray-500 mb-2">Total Users</p>
          <h2 className="text-2xl font-bold text-blue-600">{stats?.totalUsers}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <p className="text-gray-500 mb-2">Total Bookings</p>
          <h2 className="text-2xl font-bold text-purple-600">{stats?.totalBookings}</h2>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="overflow-x-auto">
  <table className="w-full text-left border">
    <thead className="bg-gray-100">
      <tr>
        <th className="p-3 border">#</th>
        <th className="p-3 border">Transaction ID</th>
        <th className="p-3 border">Amount (₹)</th>
        <th className="p-3 border">Status</th>
        <th className="p-3 border">Currency</th>
        <th className="p-3 border">Method</th>
        <th className="p-3 border">Refund Status</th>
        <th className="p-3 border">Contact No</th>
        <th className="p-3 border">Tax (₹)</th>
        <th className="p-3 border">Payment Time</th>
      </tr>
    </thead>
    <tbody>
      {stats?.payments?.length > 0 ? (
        stats.payments.map((payment, index) => (
          <tr key={payment.id} className="hover:bg-gray-50">
            <td className="p-3 border">{index + 1}</td>
            <td className="p-3 border">{payment.id}</td>
            <td className="p-3 border">{payment.amount / 100}</td>
            <td className={`p-3 border ${payment.status === "captured" ? "text-green-600" : "text-red-600"}`}>
              {payment.status}
            </td>
            <td className="p-3 border">{payment.currency}</td>
            <td className="p-3 border capitalize">{payment.method || "N/A"}</td>
            <td className="p-3 border">{payment.refund_status || "No Refund"}</td>
            <td className="p-3 border">{payment.contact || "N/A"}</td>
            <td className="p-3 border">{(payment.tax || 0)}</td>
            <td className="p-3 border">{new Date(payment.created_at * 1000).toLocaleString()}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="10" className="p-3 border text-center text-gray-400">
            No Transactions Found
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default Admin;
