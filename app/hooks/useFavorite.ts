import { useMemo, useCallback } from "react";
import { SafeUser } from "../types";
import useLoginModal from "./useLoginModal";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface UseFavorite {
  listingId: string;
  currentUser?: SafeUser | null;
}

const useFavorite = ({ listingId, currentUser }: UseFavorite) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];
    return list.includes(listingId);
  }, [currentUser, listingId]);

  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (!currentUser) {
        return loginModal.onOpen();
      }

      try {
        let request;

        if (hasFavorited) {
          request = () =>
            fetch(`/api/favorites/${listingId}`, { method: "delete" });
        } else {
          request = () =>
            fetch(`/api/favorites/${listingId}`, { method: "post" });
        }

        await request();
        router.refresh();
        toast.success("Success");
      } catch (error) {
        toast.error("Something went wrong.");
      }
    },
    [currentUser, listingId, hasFavorited, router, loginModal]
  );

  return { hasFavorited, toggleFavorite };
};

export default useFavorite;
