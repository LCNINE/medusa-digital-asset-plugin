import { Button, Text } from "@medusajs/ui";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) => {
  return (
    <>
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="secondary"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        >
          이전
        </Button>

        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, startPage + 4);
            const adjustedStartPage = Math.max(1, endPage - 4);

            const pageNumber = adjustedStartPage + i;
            if (pageNumber <= totalPages) {
              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === currentPage ? "primary" : "secondary"}
                  size="small"
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            }
            return null;
          })}
        </div>

        <Button
          variant="secondary"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          다음
        </Button>
      </div>

      <Text className="text-center mt-2">
        총 {totalItems}개 항목 중 {(currentPage - 1) * pageSize + 1} -{" "}
        {Math.min(currentPage * pageSize, totalItems)}개 표시 중
      </Text>
    </>
  );
};
