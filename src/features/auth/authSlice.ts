import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import { PropsAuthen, PropsNickname, ReturnedProfile, Token } from "../types";

export const apiUrl = process.env.REACT_APP_DEV_API_URL;

const initialState = {
  myprofile: {
    id: 0,
    nickName: "",
    userProfile: 0,
    created_on: "",
    img: "",
  },
};

export const fetchAsyncLogin = createAsyncThunk(
  "auth/post",
  async (authen: unknown) => {
    const res = await axios.post(`${apiUrl}authen/jwt/create`, authen, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data as Token;
  }
);

export const fetchAsyncRegister = createAsyncThunk(
  "auth/register",
  async (auth: PropsAuthen) => {
    const res = await axios.post(`${apiUrl}api/register/`, auth, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }
);

export const fetchAsyncCreateProf = createAsyncThunk(
  "profile/post",
  async (nickName: PropsNickname) => {
    const res = await axios.post(`${apiUrl}api/profile/`, nickName, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    editNickName(state, action) {
      state.myprofile.nickName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
      localStorage.setItem("localJWT", action.payload.access);
    });
    builder.addCase(fetchAsyncCreateProf.fulfilled, (state, action) => {
      state.myprofile = action.payload as ReturnedProfile;
    });
  },
});

export const selectProfile = (state: RootState) => state.auth.myprofile;

export default authSlice.reducer;
