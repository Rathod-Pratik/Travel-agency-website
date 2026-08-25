"use client";

import { useMemo, useState } from "react";
import {
  FiCalendar,
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiEye,
  FiDollarSign,
  FiUsers,
  FiCheck,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import apiClient from "@apiClient";
import {
  ACCEPT_BOOKING_URL,
  CANCEL_BOOKING_URL,
  GET_BOOKING_URL,
} from "@/utils/index";
import { useAppStore } from "@/store";
import Loading from "@/app/(public)/loading";

interface Traveller {
  name: string;
  age: number;
  documentType: string;
}

interface BookingItem {
  id: string;
  code: string;
  name: string;
  email: string;
  title: string;
  date: string;
  noOfSeats: number;
  totalAmount: number;
  status: "Booked" | "Pending" | "Cancelled";
  paymentStatus: "Paid" | "Pending" | "Refunded";
  createdAt: string;
  travellers: Traveller[];
}

export default function AdminBookingsPage() {
  const { userInfo } = useAppStore();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] =
    useState<BookingItem | null>(null);

  const page = 1;
  const limit = 10;

  const FetchBooking = async (): Promise<BookingItem[]> => {
    const response = await apiClient.get(
      GET_BOOKING_URL(page, limit)
    );

    return response.data?.data ?? [];
  };

  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["bookings", page, limit],
    queryFn: FetchBooking,
  });

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        booking.code?.toLowerCase().includes(searchValue) ||
        booking.name?.toLowerCase().includes(searchValue) ||
        booking.email?.toLowerCase().includes(searchValue) ||
        booking.title?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const updateBookingCache = (
    id: string,
    newStatus: "Booked" | "Pending" | "Cancelled"
  ) => {
    queryClient.setQueryData<BookingItem[]>(
      ["bookings", page, limit],
      (oldData = []) =>
        oldData.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                status: newStatus,
                paymentStatus:
                  newStatus === "Cancelled"
                    ? "Refunded"
                    : newStatus === "Booked"
                    ? "Paid"
                    : "Pending",
              }
            : booking
        )
    );

    setSelectedBooking((previous) =>
      previous?.id === id
        ? {
            ...previous,
            status: newStatus,
            paymentStatus:
              newStatus === "Cancelled"
                ? "Refunded"
                : newStatus === "Booked"
                ? "Paid"
                : "Pending",
          }
        : previous
    );
  };

  const DeclineBooking = async (
    id: string,
    all: boolean
  ) => {
    try {
      const response = await apiClient.post(
        CANCEL_BOOKING_URL(id, all)
      );

      if (response.status === 200) {
        updateBookingCache(id, "Cancelled");

        toast.success(
          "Booking declined successfully."
        );
      } else {
        toast.error("Failed to decline booking.");
      }
    } catch (error) {
      console.error(
        "Error declining booking:",
        error
      );

      toast.error(
        "Failed to decline booking."
      );
    }
  };

  const AcceptBooking = async (id: string) => {
    if (!userInfo?._id) {
      toast.error(
        "User information is not available."
      );
      return;
    }

    try {
      const response = await apiClient.post(
        ACCEPT_BOOKING_URL,
        {
          tourId: id,
          userId: userInfo._id,
        }
      );

      if (response.status === 200) {
        updateBookingCache(id, "Booked");

        toast.success(
          "Booking accepted successfully."
        );
      } else {
        toast.error(
          "Failed to accept booking."
        );
      }
    } catch (error) {
      console.error(
        "Error accepting booking:",
        error
      );

      toast.error(
        "Failed to accept booking."
      );
    }
  };

  if (isError) {
    console.error(
      "Booking fetch error:",
      error
    );

    return (
      <Loading/>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Booking{" "}
            <span className="text-orange-500">
              Management
            </span>
          </h1>

          <p className="text-sm text-gray-500">
            Track, confirm, and manage customer tour
            reservations and traveller details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Bookings
            </span>

            <span className="rounded-lg bg-orange-50 p-2 text-orange-500">
              <FiCalendar size={18} />
            </span>
          </div>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {bookings.length}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            This season
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Confirmed
            </span>

            <span className="rounded-lg bg-emerald-50 p-2 text-emerald-500">
              <FiCheckCircle size={18} />
            </span>
          </div>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {
              bookings.filter(
                (booking) =>
                  booking.status === "Booked"
              ).length
            }
          </p>

          <p className="mt-1 text-xs font-medium text-emerald-600">
            Fully paid & verified
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Pending
            </span>

            <span className="rounded-lg bg-amber-50 p-2 text-amber-500">
              <FiClock size={18} />
            </span>
          </div>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {
              bookings.filter(
                (booking) =>
                  booking.status === "Pending"
              ).length
            }
          </p>

          <p className="mt-1 text-xs font-medium text-amber-600">
            Awaiting payment verification
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Booked Value
            </span>

            <span className="rounded-lg bg-orange-50 p-2 text-orange-500">
              <FiDollarSign size={18} />
            </span>
          </div>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            ₹
            {bookings
              .filter(
                (booking) =>
                  booking.status === "Booked"
              )
              .reduce(
                (total, booking) =>
                  total + booking.totalAmount,
                0
              )
              .toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Confirmed revenue
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <FiSearch
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search by code, customer name, email, or tour..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <FiFilter
            className="text-orange-500"
            size={16}
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-orange-500 focus:outline-none"
          >
            <option value="All">
              All Statuses
            </option>

            <option value="Booked">
              Confirmed (Booked)
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="border-b border-gray-200 bg-gray-50/75 text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">
                  Booking Code
                </th>

                <th className="px-6 py-4">
                  Customer
                </th>

                <th className="px-6 py-4">
                  Tour Package
                </th>

                <th className="px-6 py-4">
                  Travel Date
                </th>

                <th className="px-6 py-4">
                  Seats
                </th>

                <th className="px-6 py-4">
                  Amount
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-gray-500"
                  >
                    Loading bookings...
                  </td>
                </tr>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map(
                  (booking) => (
                    <tr
                      key={booking.id}
                      className="transition hover:bg-orange-50/40"
                    >
                      <td className="px-6 py-4 font-mono text-xs font-bold text-orange-600">
                        {booking.code}
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {booking.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {booking.email}
                        </p>
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-800">
                        {booking.title}
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-600">
                        {booking.date}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                          <FiUsers size={12} />
                          {booking.noOfSeats}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-semibold text-gray-900">
                        ₹
                        {booking.totalAmount.toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            booking.status === "Booked"
                              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                              : booking.status ===
                                "Pending"
                              ? "border border-amber-200 bg-amber-50 text-amber-700"
                              : "border border-red-200 bg-red-50 text-red-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              setSelectedBooking(
                                booking
                              )
                            }
                            title="View Details"
                            className="rounded p-1.5 text-gray-500 transition hover:bg-orange-50 hover:text-orange-600"
                          >
                            <FiEye size={16} />
                          </button>

                          {booking.status ===
                            "Pending" && (
                            <button
                              onClick={() =>
                                AcceptBooking(
                                  booking.id
                                )
                              }
                              title="Confirm Booking"
                              className="rounded p-1.5 text-emerald-600 transition hover:bg-emerald-50"
                            >
                              <FiCheck size={16} />
                            </button>
                          )}

                          {booking.status !==
                            "Cancelled" && (
                            <button
                              onClick={() =>
                                DeclineBooking(
                                  booking.id,
                                  false
                                )
                              }
                              title="Cancel Booking"
                              className="rounded p-1.5 text-red-500 transition hover:bg-red-50"
                            >
                              <FiXCircle
                                size={16}
                              />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-gray-500"
                  >
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-medium">
              {filteredBookings.length}
            </span>{" "}
            of{" "}
            <span className="font-medium">
              {bookings.length}
            </span>{" "}
            bookings
          </p>

          <div className="flex gap-1">
            <button
              disabled
              className="rounded px-2.5 py-1 text-xs text-gray-500 disabled:opacity-50"
            >
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