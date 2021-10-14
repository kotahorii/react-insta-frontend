import { VFC, useState, MouseEvent } from "react";
import styles from "./Post.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectProfiles } from "../auth/authSlice";
import { PropsPost } from "../types";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import {
  fetchAsyncPatchLiked,
  fetchAsyncPostComment,
  fetchPostEnd,
  fetchPostStart,
  selectComments,
} from "./postSlice";
import { Avatar, AvatarGroup } from "@chakra-ui/avatar";
import { Checkbox } from "@chakra-ui/checkbox";
import { MdFavoriteBorder } from "react-icons/md";
import { Divider, Text } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import Icon from "@chakra-ui/icon";

export const Post: VFC<PropsPost> = ({
  postId,
  loginId,
  userPost,
  title,
  imageUrl,
  liked,
}) => {
  const dispatch = useAppDispatch();
  const profiles = useAppSelector(selectProfiles);
  const comments = useAppSelector(selectComments);
  const [text, setText] = useState("");

  const commentsOnPost = comments.filter((com) => {
    return com.post === postId;
  });

  const prof = profiles.filter((prof) => {
    return prof.userProfile === userPost;
  });

  const postComment = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = { text: text, post: postId };
    dispatch(fetchPostStart());
    await dispatch(fetchAsyncPostComment(packet));
    dispatch(fetchPostEnd());
    setText("");
  };

  const handlerLiked = async () => {
    const packet = {
      id: postId,
      title: title,
      current: liked,
      new: loginId,
    };
    dispatch(fetchPostStart());
    await dispatch(fetchAsyncPatchLiked(packet));
    dispatch(fetchPostEnd());
  };
  if (title) {
    return (
      <div className={styles.post}>
        <div className={styles.pos_header}>
          <Avatar className={styles.post_avatar} src={prof[0]?.img} />
          <h3>{prof[0]?.nickName}</h3>
        </div>
        <img src={imageUrl} className={styles.post_image} alt="" />

        <h4 className={styles.post_text}>
          {/* <Checkbox
            className={styles.post_checkBox}
            icon={<MdFavoriteBorder />}
            checked={liked.some((like) => like === loginId)}
            onChange={handlerLiked}
          /> */}
          <Tooltip label="いいね！" bg="gray.400" fontSize="11px">
            <Text cursor="pointer" onClick={handlerLiked}>
              <Icon
                as={
                  liked.some((like) => like === loginId)
                    ? AiFillHeart
                    : AiOutlineHeart
                }
                mr="2.5"
                fontSize="22px"
                color={liked.some((like) => like === loginId) ? "red.400" : ""}
              />
            </Text>
          </Tooltip>
          <strong>{prof[0]?.nickName}</strong>
          {title}
          <AvatarGroup max={7}>
            {liked.map((like) => (
              <Avatar
                className={styles.post_avatarGroup}
                key={like}
                src={profiles.find((prof) => prof.userProfile === like)?.img}
              />
            ))}
          </AvatarGroup>
        </h4>
        <Divider />
        <div className={styles.post_comments}>
          {commentsOnPost.map((comment) => (
            <div key={comment.id} className={styles.post_comment}>
              <Avatar
                src={
                  profiles.find(
                    (prof) => prof.userProfile === comment.userComment
                  )?.img
                }
                size="xs"
              />
              <p>
                <strong className={styles.post_strong}>
                  {
                    profiles.find(
                      (prof) => prof.userProfile === comment.userComment
                    )?.nickName
                  }
                </strong>
                {comment.text}
              </p>
            </div>
          ))}
        </div>
        <form className={styles.post_commentBox}>
          <input
            type="text"
            className={styles.post_input}
            placeholder="add a comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="submit"
            disabled={!text.length}
            className={styles.post_button}
            onClick={postComment}
          >
            Post
          </button>
        </form>
      </div>
    );
  }
  return null;
};
