import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "../api/axios";

const CustomerForm = ({ customer, onClose, onSubmitSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phone: Yup.string(),
    company: Yup.string(),
    address: Yup.string(),
    industry: Yup.string()
  });

  const initialValues = {
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    company: customer?.company || "",
    address: customer?.address || "",
    industry: customer?.industry || ""
  };

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const response = await axios.put(`/customers/${customer._id}`, values);
      
      if (response.data.success) {
        toast.success("Customer updated successfully");
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      } else {
        throw new Error(response.data.message || "Failed to update customer");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error(error.response?.data?.message || "Failed to update customer");
    } finally {
      setIsSubmitting(false);
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <Field
            type="text"
            name="name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Field
            type="email"
            name="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <Field
            type="text"
            name="company"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <ErrorMessage name="company" component="div" className="mt-1 text-sm text-red-600" />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {isSubmitting ? "Saving..." : "Save Customer"}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default CustomerForm;
