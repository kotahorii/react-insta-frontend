import axios from "axios";
import { useMutation } from "react-query";
import { apiUrl } from "../features/auth/authSlice";

export const useMutateLogin = () => {
  const loginMutation = useMutation(
    (auth: unknown) =>
      axios.post(`${apiUrl}authen/jwt/create/`, auth, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
    {
      onSuccess: (res: any) => {
        localStorage.setItem("localJWT", res.data.access);
      },
    }
  );
  return { loginMutation };
};
