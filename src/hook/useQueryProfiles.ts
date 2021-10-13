import axios from "axios";
import { useQuery } from "react-query";
import { apiUrl } from "../features/auth/authSlice";
import { ReturnedProfile } from "../features/types";

export const useQueryProfiles = () => {
  const getProfiles = async () => {
    const { data } = await axios.get<ReturnedProfile[]>(
      `${apiUrl}api/profile/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return data;
  };
  return useQuery<ReturnedProfile[], Error>({
    queryKey: "profiles",
    queryFn: getProfiles,
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });
};
