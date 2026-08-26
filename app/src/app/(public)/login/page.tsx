"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { LOGIN_URL } from "@utils";
import { apiClient } from "@apiClient";
import { useAppStore } from "@store";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

const Login = () => {
  const { setUserInfo } = useAppStore();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),

    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema,

    onSubmit: async (values) => {
      try {
        const response = await apiClient.post(
          LOGIN_URL,
          {
            email: values.email,
            password: values.password,
          },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          const user = response.data.user;
          const role = user.role;

          setUserInfo(user);

          toast.success("Login successful!");

          if (role === "admin") {
            router.push("/admin");
          } else {
            router.push("/");
          }
        }
      } catch (error: any) {
        const data = error?.response?.data;
        const status = error?.response?.status;

        if (data?.NotFound && status === 400) {
          toast.error("Your account was not found.");
        } else if (data?.WrongPass && status === 401) {
          toast.error("Please enter the correct password.");
        } else {
          toast.error(
            data?.message || "Login failed. Please try again."
          );
        }
      }
    },
  });

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">
      <div className="m-auto flex flex-row items-center justify-center gap-8 w-full md:w-[70vw] relative ">

        {/* Login Image */}
        <div className="hidden md:block">
          <div className="rounded-2xl  bg-white p-3 shadow-xl">
            <img
              src="/tour-images/login.png"
              className="w-[450px] h-[450px] rounded-xl object-cover"
              alt="Login Illustration"
            />
          </div>
        </div>

        {/* Login Form Card */}
        <div className="relative py-6 border border-orange-300 shadow-2xl bg-[orange] rounded-2xl w-full max-w-md">

          {/* User Image */}
          <div className="absolute top-[-50px] left-1/2 -translate-x-1/2">
            <div className="rounded-full border-4 border-white bg-white shadow-xl">
              <img
                className="w-[100px] h-[100px] rounded-full object-cover"
                src="/tour-images/user.png"
                alt="User Icon"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mt-16">
            <h2 className="text-2xl font-semibold text-gray-800">
              Login
            </h2>
          </div>

          {/* Form */}
          <form
            onSubmit={formik.handleSubmit}
            className="space-y-4 px-6 mt-8"
          >

            {/* Email */}
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isRedBorder={
                  !!(formik.touched.email && formik.errors.email)
                }
              />

              {formik.touched.email && formik.errors.email && (
                <p className="text-red-700 text-sm mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isRedBorder={
                    !!(
                      formik.touched.password &&
                      formik.errors.password
                    )
                  }
                />

                {/* Eye Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>

              {formik.touched.password && formik.errors.password && (
                <p className="text-red-700 text-sm mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              text={
                formik.isSubmitting
                  ? "Logging in..."
                  : "Login"
              }
              isDisabled={formik.isSubmitting}
            />
          </form>

          {/* Register */}
          <p className="text-center mt-4">
            <span className="text-white">
              Don't have an account?
            </span>{" "}

            <Link
              href="/signup"
              className="text-white hover:border-b"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;