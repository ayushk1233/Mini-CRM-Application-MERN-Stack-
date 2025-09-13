import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useDarkMode } from "../hooks/useDarkMode";
import AnimatedBot from "../components/AnimatedBot";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isDarkMode, setIsDarkMode] = useDarkMode();
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const loginSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
  });

  const registerSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(6, "Must be at least 6 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
  });

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-200
      ${isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900'
        : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100'
      }`}>
      <div className="relative w-full max-w-5xl flex items-center justify-center p-8">
        
        {/* Theme Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm
            dark:bg-gray-800/20 text-gray-800 dark:text-white"
        >
          {isDarkMode ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
              />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
              />
            </svg>
          )}
        </motion.button>

        {/* Animated Bot */}
        <AnimatedBot />

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative"
        >
          <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl p-8">
            {/* Branding */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ClientSphere
              </h1>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Manage your customers, track leads, and gain insights — all in one place.
              </p>
            </div>

            {/* Welcome Text */}
            <div className="mb-8 text-center">
              <h2 className="text-xl text-gray-700 font-medium">
                Welcome to ClientSphere
              </h2>
              <p className="text-gray-500 mt-1">
                Your smart way to manage customers and leads. Log in to get started.
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login" : "register"}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.2 }}
              >
                <Formik
                  initialValues={
                    isLogin
                      ? { email: "", password: "" }
                      : { name: "", email: "", password: "", confirmPassword: "" }
                  }
                  validationSchema={isLogin ? loginSchema : registerSchema}
                  onSubmit={async (values, { setSubmitting, setErrors }) => {
                    try {
                      const endpoint = isLogin ? "/auth/login" : "/auth/register";
                      const res = await api.post(endpoint, values);
                      if (isLogin) {
                        login({ ...res.data.data, token: res.data.data.token });
                        navigate("/dashboard");
                      } else {
                        setIsLogin(true); // Switch to login after successful registration
                      }
                    } catch (err) {
                      setErrors({
                        email: err.response?.data?.message || "An error occurred",
                      });
                    }
                    setSubmitting(false);
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-6">
                      {!isLogin && (
                        <div>
                          <Field
                            name="name"
                            type="text"
                            placeholder="Full Name"
                            className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200
                              focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                              transition-all duration-200"
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="mt-1 text-sm text-red-500"
                          />
                        </div>
                      )}

                      <div>
                        <Field
                          name="email"
                          type="email"
                          placeholder="Email Address"
                          className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200
                            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                            transition-all duration-200"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>

                      <div>
                        <Field
                          name="password"
                          type="password"
                          placeholder="Password"
                          className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200
                            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                            transition-all duration-200"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>

                      {!isLogin && (
                        <div>
                          <Field
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200
                              focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                              transition-all duration-200"
                          />
                          <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="mt-1 text-sm text-red-500"
                          />
                        </div>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-6 rounded-lg font-medium text-white
                          bg-indigo-600 hover:bg-indigo-700 
                          transition-all duration-200 transform hover:scale-[1.02]
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                          ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          isLogin ? "Sign In" : "Create Account"
                        )}
                      </motion.button>
                    </Form>
                  )}
                </Formik>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
