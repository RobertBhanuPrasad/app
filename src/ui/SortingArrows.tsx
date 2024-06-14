import { CaretSortIcon } from "@radix-ui/react-icons";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface ISortingArrows {
  sortingState: "desc" | "asc";
  onSortChange: () => void;
}

/**
 * This is a small component to display sorting arrows
 * @param sortingState is a current state of a column in a table
 * @param onSortChange is a function to call back when the arrow is clicked
 */
export const SortingArrows = ({
  sortingState,
  onSortChange,
}: ISortingArrows) => {
  return (
    <div className="cursor-pointer" onClick={onSortChange}>
      {sortingState === "desc" ? (
        <ArrowDownIcon className="size-5" aria-hidden="true" />
      ) : sortingState === "asc" ? (
        <ArrowUpIcon className="size-5" aria-hidden="true" />
      ) : (
        <CaretSortIcon className="size-5" aria-hidden="true" />
      )}
    </div>
  );
};