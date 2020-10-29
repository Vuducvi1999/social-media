const Auth = () => {
  if (localStorage.getItem("jwt"))
    return JSON.parse(localStorage.getItem("jwt"));
  else return false;
};
