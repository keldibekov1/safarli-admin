import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { deleteUser, getUsers } from "@/api/users";

type UsersQueryParams = {
  page?: number;
  limit?: number;
};

export const usersQueryKeys = {
  all: ["users"] as const,
  list: ({ page, limit }: Required<UsersQueryParams>) =>
    [...usersQueryKeys.all, { page, limit }] as const,
};

export function useUsersQuery({ page = 1, limit = 10 }: UsersQueryParams = {}) {
  return useQuery({
    queryKey: usersQueryKeys.list({ page, limit }),
    queryFn: () => getUsers({ page, limit }),
  });
}

export function useDeleteUserMutation(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: usersQueryKeys.all });
      await options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
    onSettled: (...args) => {
      options?.onSettled?.(...args);
    },
  });
}
