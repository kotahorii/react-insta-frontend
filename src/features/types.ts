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
