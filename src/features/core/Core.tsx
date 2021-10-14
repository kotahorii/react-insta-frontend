import { VFC, useEffect } from "react";
import styles from "./Core.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Auth } from "../auth/Auth";
import {
  editNickname,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
  resetOpenProfile,
  resetOpenSignIn,
  resetOpenSignUp,
  selectIsLoadingAuth,
  selectProfile,
  setOpenProfile,
  setOpenSignIn,
  setOpenSignUp,
} from "../auth/authSlice";
import {
  fetchAsyncGetComments,
  fetchAsyncGetPosts,
  resetOpenNewPost,
  selectIsLoadingPost,
  selectPosts,
  setOpenNewPost,
} from "../post/postSlice";
import { EditProfile } from "./EditProfile";
import { NewPost } from "./NewPost";
import { MdAddAPhoto } from "react-icons/md";
import { CircularProgress } from "@chakra-ui/progress";
import { Button } from "@chakra-ui/button";
import { Avatar, AvatarBadge } from "@chakra-ui/avatar";
import { Grid, HStack, Wrap, WrapItem } from "@chakra-ui/layout";
import { Post } from "../post/Post";

export const Core: VFC = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const posts = useAppSelector(selectPosts);
  const isLoadingPost = useAppSelector(selectIsLoadingPost);
  const isLoadingAuth = useAppSelector(selectIsLoadingAuth);

  useEffect(() => {
    const fetchBootLoader = async () => {
      if (localStorage.localJWT) {
        dispatch(resetOpenSignIn());
        const result = await dispatch(fetchAsyncGetMyProf());
        if (fetchAsyncGetMyProf.rejected.match(result)) {
          dispatch(setOpenSignIn());
          return null;
        }
        await dispatch(fetchAsyncGetPosts());
        await dispatch(fetchAsyncGetProfs());
        await dispatch(fetchAsyncGetComments());
      }
    };
    fetchBootLoader();
  }, [dispatch]);

  return (
    <div>
      <Auth />
      <EditProfile />
      <NewPost />
      <div className={styles.core_header}>
        <h1 className={styles.core_title}>SNS clone</h1>
        {profile?.nickName ? (
          <>
            <button
              className={styles.core_btnModal}
              onClick={() => {
                dispatch(setOpenNewPost());
                dispatch(resetOpenProfile());
              }}
            >
              <MdAddAPhoto />
            </button>
            <div className={styles.core_logout}>
              <HStack spacing="24px">
                {isLoadingPost || (isLoadingAuth && <CircularProgress />)}
                <Button
                  colorScheme="teal"
                  variant="link"
                  size="sm"
                  _focus={{ boxShadow: "none" }}
                  onClick={() => {
                    localStorage.removeItem("localJWT");
                    dispatch(editNickname(""));
                    dispatch(resetOpenProfile());
                    dispatch(resetOpenNewPost());
                    dispatch(setOpenSignIn());
                  }}
                >
                  Logout
                </Button>
                <button
                  className={styles.core_btnModal}
                  onClick={() => {
                    dispatch(setOpenProfile());
                    dispatch(resetOpenNewPost());
                  }}
                >
                  <Avatar src={profile.img}>
                    <AvatarBadge boxSize="1.25em" bg="green.500" />
                  </Avatar>
                </button>
              </HStack>
            </div>
          </>
        ) : (
          <div>
            <HStack spacing="24px">
              <Button
                colorScheme="teal"
                variant="link"
                size="sm"
                _focus={{ boxShadow: "none" }}
                onClick={() => {
                  dispatch(setOpenSignIn());
                  dispatch(resetOpenSignUp());
                }}
              >
                LogIn
              </Button>
              <Button
                colorScheme="teal"
                variant="link"
                size="sm"
                _focus={{ boxShadow: "none" }}
                onClick={() => {
                  dispatch(setOpenSignUp());
                  dispatch(resetOpenSignIn());
                }}
              >
                SignUp
              </Button>
            </HStack>
          </div>
        )}
      </div>
      {profile?.nickName && (
        <>
          <div className={styles.core_posts}>
            <Wrap spacing="20px">
              {posts
                .slice(0)
                .reverse()
                .map((post) => (
                  <WrapItem key={post.id}>
                    <Post
                      postId={post.id}
                      title={post.title}
                      loginId={profile.userProfile}
                      userPost={post.userPost}
                      imageUrl={post.img}
                      liked={post.liked}
                    />
                  </WrapItem>
                ))}
            </Wrap>
          </div>
        </>
      )}
    </div>
  );
};
