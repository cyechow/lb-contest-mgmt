'use client'

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { saveEntry } from '@/app/actions';

export default function Home() {
  // Router
  const router = useRouter();

  // Formik - to handle all form-related things like validation and submission
  const formik = useFormik({
    initialValues: {
      name: '',
      ighandle: '',
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'Name must be at least 2 characters long')
        .required('Name is required'),
      ighandle: Yup.string().matches("^[a-zA-Z0-9.]+$", "Valid Instagram handle required.").max(30, "Valid Instagram handles are 30 characters or less.")
        .required('Instagram handle is required.')
    }),

    onSubmit: (values) => {
      console.log(values)
      saveEntry(values)
      router.push('/success')
    }
  });

  return (
    <div>
      <main className="h-screen flex items-center justify-center">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white flex rounded-lg w-1/2 font-sans">
          <div className="flex-1 text-gray-700 p-16">
            <h1 className="text-3xl font-bold pb-6">LimitBreaker Giveaway Contest</h1>
            <p className="pb-4">Enter our giveaway contest for a chance to win limited LimitBreaker items!</p>
            <p className="pb-4">To enter the draw, please follow LimitBreaker on Instagram <a href="https://www.instagram.com/lb.limitbreaker/">@lb.limitbreaker</a>
              {' '}and submit your name and IG handle.</p>
            <p className="pb-4">The winners will be announce on <i className="text-red-500">some date</i>.</p>
            <div className="mt-6">
              {/* Input: Name */}
              <div className="pb-4">
                <label
                  htmlFor="name"
                  className={`block font-bold text-sm pb-2 ${
                    formik.touched.name && formik.errors.name
                    ? "text-red-400"
                    : ""
                  }`}>
                  {formik.touched.name && formik.errors.name ? "Name (" + formik.errors.name + ")" : "Name"}
                </label>
                <input
                  className="border-2 border-gray-500 p-2 rounded-md focus:border-red-500 focus:ring-red-500"
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {/* Input: IG Handle */}
              <div className="pb-4">
                <label
                  htmlFor="ighandle"
                  className={`block font-bold text-sm pb-2 ${
                    formik.touched.ighandle && formik.errors.ighandle
                    ? "text-red-400"
                    : ""
                  }`}>
                  {formik.touched.ighandle && formik.errors.ighandle ? "Instagram Handle (" + formik.errors.ighandle + ")" : "Instagram Handle"}
                </label>
                <input
                  className="border-2 border-gray-500 p-2 rounded-md focus:border-red-500 focus:ring-red-500"
                  type="text"
                  name="ighandle"
                  placeholder="Enter your Instagram handle"
                  value={formik.values.ighandle}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
          <button type="submit" className="bg-gray-500 font-bold text-sm text-white py-3 mt-6 rounded-lg w-full">Submit</button>
          </div>
        </form>
      </main>
    </div>
  );
}
