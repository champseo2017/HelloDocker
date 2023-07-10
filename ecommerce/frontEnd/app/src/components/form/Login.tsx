import React from "react";
import { useForm } from "react-hook-form";
import { userController } from "services/apiController/user";
import { ILogin } from "services/typeApi";
import { useSuccessToast } from "hooks/toast/useSuccessToast";

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();

  const onSubmit = async (data: ILogin) => {
    const response = await userController().login(data);
    const { message } = response;
    useSuccessToast(message);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 bg-white rounded shadow-md"
      >
        <h2 className="mb-4 text-2xl font-bold text-gray-700">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            {...register("username", { required: true })}
            className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:shadow-outline"
          />
          {errors.username && (
            <span className="text-red-500">Username is required</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            {...register("password", { required: true })}
            className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:shadow-outline"
          />
          {errors.password && (
            <span className="text-red-500">Password is required</span>
          )}
        </div>
        <button
          type="submit"
          className="w-full px-3 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline"
        >
          Login
        </button>
      </form>
    </>
  );
};

export default Login;
