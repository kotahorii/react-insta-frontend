import { VFC, useState } from "react";

import { useAppDispatch } from "../../app/hooks";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./Auth.module.css";
import * as yup from "yup";

import {
  fetchAsyncRegister,
  fetchAsyncLogin,
  fetchAsyncCreateProf,
} from "./authSlice";

import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { FormControl } from "@chakra-ui/form-control";
import { VStack } from "@chakra-ui/layout";
import { IFormInput } from "../types";

export const Auth: VFC = () => {
  const dispatch = useAppDispatch();
  const [isSignUpMode, setIsSignUpMode] = useState(true);
  const [isSignInMode, setIsSignInMode] = useState(false);

  const schema = yup.object({
    email: yup.string().required("email is must").email("email is wrong"),
    password: yup.string().required("password is must").min(4),
  });

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<IFormInput>({ resolver: yupResolver(schema) });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const resultReg = await dispatch(fetchAsyncRegister(data));

    if (fetchAsyncRegister.fulfilled.match(resultReg)) {
      await dispatch(fetchAsyncLogin(data));
      await dispatch(fetchAsyncCreateProf({ nickName: "anonymous" }));
    }
    setIsSignUpMode(false);
  };

  const onSubmitLogin: SubmitHandler<IFormInput> = async (data) => {
    await dispatch(fetchAsyncLogin(data));
    setIsSignInMode(false);
  };

  return (
    <>
      <Modal
        isOpen={isSignUpMode}
        onClose={() => {
          setIsSignUpMode(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h1 className={styles.auth_title}>SNS clone</h1>
            <br />
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.auth_signUp}>
                <VStack spacing={3} align="stretch">
                  <FormControl>
                    <Input
                      placeholder="email"
                      type="input"
                      {...register("email")}
                    />

                    <div className={styles.auth_error}>
                      {errors.email?.message}
                    </div>
                  </FormControl>
                  <FormControl>
                    <Input
                      placeholder="password"
                      type="password"
                      {...register("password")}
                    />
                    <div className={styles.auth_error}>
                      {errors.password?.message}
                    </div>
                  </FormControl>
                  <Button
                    type="submit"
                    colorScheme="teal"
                    isLoading={isSubmitting}
                    variant="solid"
                  >
                    Register
                  </Button>
                </VStack>
              </div>
            </form>
            <ModalFooter>
              <span
                className={styles.auth_text}
                onClick={async () => {
                  setIsSignInMode(true);
                  setIsSignUpMode(false);
                }}
              >
                you already have a account ?
              </span>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isSignInMode}
        onClose={() => {
          setIsSignInMode(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h1 className={styles.auth_title}>SNS clone</h1>
            <br />
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmitLogin)}>
              <div className={styles.auth_signUp}>
                <VStack spacing={3} align="stretch">
                  <FormControl>
                    <Input
                      placeholder="email"
                      type="input"
                      {...register("email")}
                    />
                    <div className={styles.auth_error}>
                      {errors.email?.message}
                    </div>
                  </FormControl>
                  <FormControl>
                    <Input
                      placeholder="password"
                      type="password"
                      {...register("password")}
                    />
                    <div className={styles.auth_error}>
                      {errors.password?.message}
                    </div>
                  </FormControl>
                  <Button
                    type="submit"
                    colorScheme="teal"
                    isLoading={isSubmitting}
                    variant="solid"
                  >
                    Login
                  </Button>
                </VStack>
              </div>
            </form>
            <ModalFooter>
              <span
                className={styles.auth_text}
                onClick={async () => {
                  setIsSignInMode(false);
                  setIsSignUpMode(true);
                }}
              >
                you don't have a account ?
              </span>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
