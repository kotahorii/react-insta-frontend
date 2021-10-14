import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import styles from "./Core.module.css";
import { VFC, useState, MouseEventHandler } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  editNickname,
  fetchAsyncUpdateProf,
  fetchCredEnd,
  fetchCredStart,
  resetOpenProfile,
  selectOpenProfile,
  selectProfile,
} from "../auth/authSlice";
import { File } from "../types";
import { Textarea } from "@chakra-ui/textarea";
import { Button, IconButton } from "@chakra-ui/button";
import { MdAddAPhoto } from "react-icons/md";
import { Input } from "@chakra-ui/input";

export const EditProfile = () => {
  const dispatch = useAppDispatch();
  const openProfile = useAppSelector(selectOpenProfile);
  const profile = useAppSelector(selectProfile);
  const [image, setImage] = useState<File | null>(null);

  const updateProfile = async (e: any) => {
    e.preventDefault();
    const packet = { id: profile.id, nickName: profile.nickName, img: image };

    await dispatch(fetchCredStart());
    await dispatch(fetchAsyncUpdateProf(packet));
    await dispatch(fetchCredEnd());
    await dispatch(resetOpenProfile());
  };

  const handlerEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput?.click();
  };

  return (
    <>
      <Modal
        isOpen={openProfile}
        onClose={() => {
          dispatch(resetOpenProfile());
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h1 className={styles.core_title}>SNS clone</h1>
          </ModalHeader>
          <ModalBody>
            <form className={styles.core_signUp}>
              <br />
              <Input
                placeholder="nickname"
                type="text"
                value={profile?.nickName}
                onChange={(e) => dispatch(editNickname(e.target.value))}
              />
              <input
                type="file"
                id="imageInput"
                hidden={true}
                onChange={(e) => setImage(e.target.files![0])}
              />
              <br />
              <IconButton aria-label="photo" onClick={handlerEditPicture}>
                <MdAddAPhoto />
              </IconButton>
              <br />
              <Button
                disabled={!profile.nickName}
                variant="contained"
                color="teal"
                type="submit"
                onClick={updateProfile}
              >
                Update
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
