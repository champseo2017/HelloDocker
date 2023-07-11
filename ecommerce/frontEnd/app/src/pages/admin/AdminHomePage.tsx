import { useSuccessToast } from "hooks/toast/useSuccessToast";

const notify = () => useSuccessToast("Make me a toast");

const AdminHomePage = () => {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-lg capitalize">welcome to admin panel</h1>
    </div>
  );
};

export default AdminHomePage;
