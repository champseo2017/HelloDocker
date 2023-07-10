import { useSuccessToast } from "hooks/toast/useSuccessToast";

const notify = () => useSuccessToast("Make me a toast");

const AdminHomePage = () => {
  return (
    <div>
      <button onClick={notify}>Make me a toast</button>
    </div>
  );
};

export default AdminHomePage;
