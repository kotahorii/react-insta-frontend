import { VFC } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./Auth.module.css";
import * as yup from "yup";

import {
  selectIsLoadingAuth,
  selectOpenSignIn,
  selectOpenSignUp,
  resetOpenSignUp,
  fetchAsyncRegister,
  fetchAsyncLogin,
  fetchAsyncCreateProf,
  fetchCredEnd,
  setOpenSignIn,
  resetOpenSignIn,
} from "./authSlice";

import { useQueryMyProfile } from "../../hook/useQueryMyProfile";
import { useQueryProfiles } from "../../hook/useQueryProfiles";
import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { FormControl, FormErrorMessage } from "@chakra-ui/form-control";
import { useDisclosure } from "@chakra-ui/hooks";
import { Stack, StackDivider, VStack } from "@chakra-ui/layout";
import { CircularProgress } from "@chakra-ui/progress";

export const Auth: VFC = () => {
  const isLoadingAuth = useAppSelector(selectIsLoadingAuth);
  const openSignIn = useAppSelector(selectOpenSignIn);
  const openSignUp = useAppSelector(selectOpenSignUp);
  const dispatch = useAppDispatch();

  const { data } = useQueryMyProfile();
  const { data: profiles } = useQueryProfiles();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      <Modal
        isOpen={openSignUp}
        onClose={() => {
          dispatch(resetOpenSignUp());
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h1 className={styles.auth_title}>SNS clone</h1>
            <br />
            <div className={styles.auth_progress}>
              {isLoadingAuth && (
                <CircularProgress
                  size="30px"
                  isIndeterminate
                  color="green.300"
                />
              )}
            </div>
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
                    isLoading={isLoadingAuth}
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
                  dispatch(setOpenSignIn());
                  dispatch(resetOpenSignUp());
                }}
              >
                you already have a account ?
              </span>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
