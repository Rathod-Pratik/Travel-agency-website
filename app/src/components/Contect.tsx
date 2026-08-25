"use client";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { CREATE_CONTACT_URL } from "@utils";
import { apiClient } from "@apiClient";
import { toast } from "react-toastify";
import { useAppStore } from "@store";
import { useRouter } from "next/navigation";

const ContactSchema = Yup.object({
  name: Yup.string()
    .min(5, "Name must be at least 5 characters")
    .required("Please enter your full name"),

  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),

  mobile_no: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
    .required("Please enter your mobile number"),

  message: Yup.string()
    .min(20, "Message must be at least 20 characters")
    .required("Please enter your message"),
});

interface ContactFormValues {
  name: string;
  email: string;
  mobile_no: string;
  message: string;
}

export const Contect = () => {
  const router = useRouter();
  const { userInfo } = useAppStore();

  const initialValues: ContactFormValues = {
    name: "",
    email: "",
    mobile_no: "",
    message: "",
  };

  const SendContect = async (
    values: ContactFormValues,
    {
      resetForm,
      setSubmitting,
    }: {
      resetForm: () => void;
      setSubmitting: (isSubmitting: boolean) => void;
    }
  ) => {
    if (!userInfo) {
      toast.error("Please Login now");
      router.push("/login");
      return;
    }

    try {
      const response = await apiClient.post(CREATE_CONTACT_URL, {
        name: values.name,
        email: values.email,
        mobile_no: values.mobile_no,
        message: values.message,
        userData: userInfo,
      });

      if (response.status === 200) {
        toast.success("Contact saved successfully");
        toast.success("We will contact you soon");

        resetForm();
      } else {
        toast.error("Failed to add contact");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "An unexpected error occurred"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="w-full md:w-[40%] mx-auto pb-6"
      data-aos="zoom-out"
    >
      {/* Title */}
      <p className="text-2xl bg-[orange] px-4 py-2 text-white inline-block hero-title rounded-[50px] shadow-md mb-6 mx-auto text-center">
        Contact Us
      </p>

      {/* Contact Information */}
      <div className="border border-gray-300 p-4 rounded-lg font-semibold mb-4 text-base shadow-sm">
        <p className="mb-2">
          📞 Contact No:{" "}
          <span className="text-gray-700">+91 7202001502</span>
        </p>

        <p>
          ✉️ Email:{" "}
          <span className="text-gray-700">
            rathodpratik1928@gmail.com
          </span>
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={ContactSchema}
        onSubmit={SendContect}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <Field
                name="name"
                type="text"
                placeholder="Name"
                className="w-full border-b border-gray-300 outline-none focus:border-[orange] transition-all py-2 px-1 text-gray-800 rounded-[5px]"
              />

              <ErrorMessage
                name="name"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Email */}
            <div>
              <Field
                name="email"
                type="email"
                placeholder="Email"
                className="w-full border-b border-gray-300 outline-none focus:border-[orange] transition-all py-2 px-1 text-gray-800 rounded-[5px]"
              />

              <ErrorMessage
                name="email"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Mobile */}
            <div>
              <Field
                name="mobile_no"
                type="tel"
                placeholder="Phone"
                maxLength={10}
                className="w-full border-b border-gray-300 outline-none focus:border-[orange] transition-all py-2 px-1 text-gray-800 rounded-[5px]"
                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                  const target = e.currentTarget;

                  target.value = target.value.replace(/\D/g, "");
                }}
              />

              <ErrorMessage
                name="mobile_no"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Message */}
            <div>
              <Field
                as="textarea"
                name="message"
                placeholder="Message"
                className="w-full border-b border-gray-300 outline-none focus:border-[orange] transition-all py-2 px-1 text-gray-800 rounded-[5px] resize-none h-[100px]"
              />

              <ErrorMessage
                name="message"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 px-4 bg-[orange] text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};