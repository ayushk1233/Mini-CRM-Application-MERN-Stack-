import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

const LeadForm = ({ 
  customerId, 
  lead = null,
  onClose,
  onSubmitSuccess,
  initialValues = { 
    title: "", 
    value: 0, 
    status: "New", 
    description: "" 
  }
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // If not admin, show a message and close the form
  if (user?.role !== 'admin') {
    toast.error('Only admins can manage leads');
    onClose?.();
    return null;
  }

  const validationSchema = Yup.object({
    title: Yup.string().min(2).max(200).required("Title is required"),
    value: Yup.number().min(0).default(0).required("Value is required"),
    status: Yup.string().oneOf(["New", "Contacted", "Qualified", "Won", "Lost"], "Invalid status").required("Status is required"),
    description: Yup.string().max(1000),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      // Prepare data according to backend schema
      const leadData = {
        title: values.title,
        value: Number(values.value),
        status: values.status,
        description: values.description || ''
      };
      
      let response;
      if (lead) {
        // Update existing lead
        response = await axios.put(`/customers/${customerId}/leads/${lead._id}`, leadData);
      } else {
        // Create new lead
        response = await axios.post(`/customers/${customerId}/leads`, leadData);
      }

      if (response.data.success) {
        toast.success(lead ? 'Lead updated successfully!' : 'Lead created successfully!');
        resetForm();
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      } else {
        throw new Error(response.data.message || 'Failed to save lead');
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast.error(error.response?.data?.message || 'Failed to save lead. Please try again.');
    } finally {
      setIsSubmitting(false);
      if (onClose) {
        onClose();
      }
    }
  };

  const leadValues = lead 
    ? { 
        title: lead.title,
        value: lead.value || 0,
        status: lead.status,
        description: lead.description || ""
      } 
    : initialValues;

  return (
    <Formik
      initialValues={leadValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Lead Title
          </label>
          <Field
            type="text"
            name="title"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Product Demo"
          />
          <ErrorMessage name="title" component="div" className="mt-1 text-sm text-red-600" />
        </div>

        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700">
            Value ($)
          </label>
          <Field
            type="number"
            name="value"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="0"
          />
          <ErrorMessage name="value" component="div" className="mt-1 text-sm text-red-600" />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <Field
            as="select"
            name="status"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </Field>
          <ErrorMessage name="status" component="div" className="mt-1 text-sm text-red-600" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <Field
            as="textarea"
            name="description"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Add any description about this lead..."
          />
          <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
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
            {isSubmitting ? "Saving..." : lead ? "Update Lead" : "Add Lead"}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default LeadForm;
