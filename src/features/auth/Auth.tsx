import { VFC } from "react";
import Modal from "react-modal";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./Auth.module.css";
import * as yup from "yup";

import {
  selectOpenSignIn,
  selectOpenSignUp,
  resetOpenSignUp,
  fetchAsyncRegister,
  fetchAsyncLogin,
  fetchAsyncCreateProf,
  selectProfile,
  fetchCredEnd,
} from "./authSlice";
import { Button, TextField } from "@material-ui/core";
import { useQueryMyProfile } from "../../hook/useQueryMyProfile";
import { useQueryProfiles } from "../../hook/useQueryProfiles";
import { useQueryClient } from "react-query";

const customStyles = {
  overlay: {
    backgroundColor: "#777777",
  },
  content: {
    top: "55%",
    left: "50%",

    width: 280,
    height: 350,
    padding: "50px",

    transform: "translate(-50%, -50%)",
  },
};

export const Auth: VFC = () => {
  Modal.setAppElement("#root");
  const openSignIn = useAppSelector(selectOpenSignIn);
  const openSignUp = useAppSelector(selectOpenSignUp);
  const dispatch = useAppDispatch();

  const { data } = useQueryMyProfile();
  const { data: profiles } = useQueryProfiles();

  type IFormInput = {
    email: string;
    password: string;
  };

  const schema = yup.object({
    email: yup.string().required("email is must").email("email is wrong"),
    password: yup.string().required("password is must").min(4),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>({ resolver: yupResolver(schema) });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await dispatch(fetchAsyncLogin(data));
    const resultReg = await dispatch(fetchAsyncRegister(data));

    if (fetchAsyncRegister.fulfilled.match(resultReg)) {
      await dispatch(fetchAsyncLogin(data));
      await dispatch(fetchAsyncCreateProf({ nickName: "anonymous" }));
    }
    await dispatch(fetchCredEnd());
    await dispatch(resetOpenSignUp());
  };

  return (
    <>
      {/* <Modal
        isOpen={openSignUp}
        onRequestClose={() => {
          dispatch(resetOpenSignUp());
        }}
        style={customStyles}
      > */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.auth_signUp}>
          <h1 className={styles.auth_title}>SNS clone</h1>
          <br />
          <div className={styles.auth_progress}></div>
          <br />
          <TextField placeholder="email" type="input" {...register("email")} />
          <p>{errors.email?.message}</p>
          <br />

          <TextField
            placeholder="password"
            type="password"
            {...register("password")}
          />
          <p>{errors.password?.message}</p>
          <br />
        </div>
        <Button type="submit">Register</Button>
      </form>
      {/* </Modal> */}
      {profiles?.map((prof) => (
        <div key={prof.id}>{prof.nickName}</div>
      ))}
      <br />
      {data?.nickName}
    </>
  );
};
