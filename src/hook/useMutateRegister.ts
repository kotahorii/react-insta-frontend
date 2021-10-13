import { useMutation, useQueryClient } from "react-query";

import { PropsAuthen, PropsNickname } from "../features/types";
import { apiUrl } from "../features/auth/authSlice";
import axios from "axios";
import { useMutateLogin } from "./useMutateLogin";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

type IFormInput = {
  email: string;
  password: string;
};

export const useMutateRegister = () => {
  const queryClient = useQueryClient();
  const { loginMutation } = useMutateLogin();

  const schema = yup.object({
    email: yup.string().required("email is must").email("email is wrong"),
    password: yup.string().required("password is must").min(4),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>({ resolver: yupResolver(schema) });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {};

  const registerMutation = useMutation(
    async (auth: PropsAuthen) =>
      await axios.post(`${apiUrl}api/register/`, auth, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
    {
      onSuccess: () => {
        loginMutation.mutate();
        createProfMutation.mutate({ nickName: "anonymous" });
      },
    }
  );

  const createProfMutation = useMutation(
    (nickName: PropsNickname) =>
      axios.post(`${apiUrl}api/profile/`, nickName, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }),
    {
      onSuccess: (res: any) => {
        console.log("create prof successfully");
        const previousProfile: any = queryClient.getQueryData("myprofile");
        if (previousProfile) {
          queryClient.setQueryData("myprofile", res.data);
        }
      },
    }
  );
};
