import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { apiUrl } from "../features/auth/authSlice";
import { PropsProfile } from "../features/types";

export const useMutateUpdateProf = () => {
  const queryClient = useQueryClient();
  const formInputData = (profile: PropsProfile) => {
    const uploadData = new FormData();
    uploadData.append("nickName", profile.nickName);
    profile.img && uploadData.append("img", profile.img, profile.img.name);
    return uploadData;
  };

  const updateProfileMutation = useMutation(
    (profile: PropsProfile) =>
      axios.put(`${apiUrl}api/profile/${profile.id}/`, formInputData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }),
    {
      onSuccess: (res: any) => {
        const previousProfile: any = queryClient.getQueryData("myprofile");
        if (previousProfile) {
          queryClient.setQueryData("myprofile", res.data);
        }
      },
    }
  );
  return {
    formInputData,
    updateProfileMutation,
  };
};
