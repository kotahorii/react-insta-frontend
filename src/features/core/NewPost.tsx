import { Button, IconButton } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import styles from "./Core.module.css";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { VFC, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchAsyncNewPost,
  fetchPostEnd,
  fetchPostStart,
  resetOpenNewPost,
  selectOpenNewPost,
} from "../post/postSlice";
import { ChangeEvent } from "react";
import { MdAddAPhoto } from "react-icons/md";

export const NewPost: VFC = () => {
  const dispatch = useAppDispatch();
  const openNewPost = useAppSelector(selectOpenNewPost);

  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");

  const handlerEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput?.click();
  };

  const newPost = async (e: any) => {
    e.preventDefault();
    const packet = { title: title, img: image };
    await dispatch(fetchPostStart());
    await dispatch(fetchAsyncNewPost(packet));
    await dispatch(fetchPostEnd());
    setTitle("");
    setImage(null);
    dispatch(resetOpenNewPost());
  };
  return (
    <>
      <Modal
        isOpen={openNewPost}
        onClose={() => {
          dispatch(resetOpenNewPost());
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <h1 className={styles.core_title}>SNS clone</h1>
          </ModalHeader>
          <ModalBody>
            <form className={styles.core_signUp}>
              <Input
                placeholder="nickname"
                type="text"
                value={title}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
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
                disabled={!title || !image}
                variant="contained"
                color="primary"
                onClick={newPost}
              >
                New post
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
