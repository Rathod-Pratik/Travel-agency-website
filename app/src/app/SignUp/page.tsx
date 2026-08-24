"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import { apiClient } from "@apiClient";
import { SIGNUP } from "@utils";
import { useAppStore } from "@store";

import { Input } from "@components/Input";
import { Button } from "@components/Button";

const SignUp = () => {
  const { setUserInfo } = useAppStore();
  const router = useRouter();

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(5, "Name must be at least 5 characters long")
      .required("Name is required"),

    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),

    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },

    validationSchema,

    onSubmit: async (values) => {
      try {
        const response = await apiClient.post(
          SIGNUP,
          {
            name: values.name,
            email: values.email,
            password: values.password,
          },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          toast.success("Signup successful!");

          setUserInfo(response.data.user);

          router.push("/");
        }
      } catch (error: any) {
        const data = error?.response?.data;
        const status = error?.response?.status;

        if (data?.AlreadyExist && status === 400) {
          toast.error("User already exists with this email.");
        } else {
          toast.error(
            data?.message ||
              "Some error occurred. Please try again later."
          );

          console.error(
            "Signup failed:",
            data || error.message
          );
        }
      }
    },
  });

  return (
    <div className="min-h-[90vh] flex items-center justify-center">
      <div className="m-auto flex flex-row justify-center gap-8 w-full md:w-[60vw] relative">

        <div className="hidden lg:block">
          <img
            src="/tour-images/register.png"
            className="w-[450px] h-[450px] object-cover max-w-full"
            alt="Register Illustration"
          />
        </div>

        <div className="relative py-6 shadow-md bg-orange-500 rounded-lg w-full max-w-md">

          {/* User Image */}

          <div className="absolute top-[-50px] left-1/2 transform -translate-x-1/2">
            <img
              className="w-[100px] h-[100px] rounded-full border-4 border-white shadow-lg"
              src="/tour-images/user.png"
              alt="User Icon"
            />
          </div>

          {/* Heading */}

          <div className="text-center mt-16">
            <h2 className="text-2xl font-semibold text-gray-800">
              Register
            </h2>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="space-y-4 px-6 mt-4"
          >

            {/* Name */}

            <Input
              type="text"
              name="name"
              placeholder="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isRedBorder={
                !!(formik.touched.name && formik.errors.name)
              }
              error={
                formik.touched.name
                  ? formik.errors.name
                  : undefined
              }
            />

            {/* Email */}

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
              error={
                formik.touched.email
                  ? formik.errors.email
                  : undefined
              }
            />

            {/* Password */}

            <Input
              type="password"
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
              error={
                formik.touched.password
                  ? formik.errors.password
                  : undefined
              }
            />

            {/* Register Button */}

            <Button
              type="submit"
              text={
                formik.isSubmitting
                  ? "Registering..."
                  : "Register"
              }
              isDisabled={formik.isSubmitting}
            />
          </form>

          {/* Login */}

          <p className="text-center mt-4">
            <span className="text-white">
              Already have account?
            </span>{" "}

            <Link
              href="/login"
              className="text-white hover:border-b"
            >
              Login Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;