import { memo } from "react";
import UserSignIn from "components/client/UserSignIn";

const ContainerUseSignIn = () => {
  return (
    <>
      <UserSignIn />
    </>
  );
};

export default memo(ContainerUseSignIn);
