const storeTokenIfPresent = (result: any) => {
  if (result && result?.data && "token" in result?.data) {
    const { token } = result.data;
    localStorage.setItem("token", token);
  }
};

export { storeTokenIfPresent };
