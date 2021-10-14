export type PropsAuthen = {
  email: string;
  password: string;
};

export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}

export type PropsProfile = {
  id: number;
  nickName: string;
  img: File | null;
};

export type ReturnedProfile = {
  id: number;
  nickName: string;
  userProfile: number;
  created_on: string;
  img: string;
};

export type PropsNickname = {
  nickName: string;
};

export type Token = {
  reflesh: string;
  access: string;
};

export type IFormInput = {
  email: string;
  password: string;
};

export type PropsNewPost = {
  title: string;
  img: File | null;
};

export type PropsLiked = {
  id: number;
  title: string;
  current: number[];
  new: number;
};

export type PropsComment = {
  text: string;
  post: number;
};

export type PropsPost = {
  postId: number;
  loginId: number;
  userPost: number;
  title: string;
  imageUrl: string;
  liked: number[];
};

export type ReturnedPost = {
  id: number;
  title: string;
  userPost: number;
  created_on: string;
  img: string;
  liked: number[];
};

export type ReturnedComment = {
  id: number;
  text: string;
  userComment: number;
  post: number;
};
