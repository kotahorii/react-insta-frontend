import axios from "axios";
import { useQuery } from "react-query";
import { apiUrl } from "../features/auth/authSlice";
import { ReturnedProfile } from "../features/types";

export const useQueryMyProfile = () => {
  const getMyProfileQuery = async () => {
    const { data } = await axios.get<ReturnedProfile[]>(
      `${apiUrl}api/myprofile/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return data[0];
  };
  return useQuery<ReturnedProfile, Error>({
    queryKey: "myprofile",
    queryFn: getMyProfileQuery,
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });
};
