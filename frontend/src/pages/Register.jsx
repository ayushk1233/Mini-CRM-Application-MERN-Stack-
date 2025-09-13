import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Register</h2>
        <Formik
          initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
          validationSchema={Yup.object({
            name: Yup.string().required("Name is required"),
            email: Yup.string().required("Email is required"),
            password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref('password'), null], 'Passwords must match')
              .required('Please confirm your password'),
          })}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              const response = await api.post("/auth/register", values);
              const userData = response.data.data;
              
              // Auto-login using register function
              register(userData);
              
              // Show success message
              toast.success('Welcome to ClientSphere! You are now logged in.');
              
              // Redirect to dashboard
              navigate("/dashboard");
            } catch (err) {
              const errorMessage = err.response?.data?.message || "Registration failed";
              setErrors({ email: errorMessage });
              toast.error(errorMessage);
            }
            setSubmitting(false);
          }}
        >
          <Form className="space-y-4">
            <Field name="name" placeholder="Name" className="w-full border p-2" />
            <ErrorMessage name="name" component="div" className="text-red-500" />
            <Field name="email" type="email" placeholder="Email" className="w-full border p-2" />
            <ErrorMessage name="email" component="div" className="text-red-500" />
            <Field name="password" type="password" placeholder="Password" className="w-full border p-2" />
            <ErrorMessage name="password" component="div" className="text-red-500" />
            <Field name="confirmPassword" type="password" placeholder="Confirm Password" className="w-full border p-2" />
            <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />
            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors">
              Register
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Register;
