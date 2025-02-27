import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationWrapperProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

const PaginationWrapper: React.FC<PaginationWrapperProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  disabled = false,
}) => {
  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };
  return (
    <Pagination>
      <PaginationContent>
        <PaginationPrevious
          className={'cursor-pointer select-none'}
          onClick={() => {
            if (!disabled && currentPage > 1) onPageChange(currentPage - 1);
          }}
        />
        {getPages().map((page) =>
          Math.abs(page - currentPage) < 2 ||
          page === 1 ||
          page === totalPages ? (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ) : (
            page === currentPage + 2 && <PaginationEllipsis key={page} />
          )
        )}
        <PaginationNext
          className={'cursor-pointer select-none'}
          onClick={() => {
            if (!disabled && currentPage < totalPages)
              onPageChange(currentPage + 1);
          }}
        />
      </PaginationContent>
    </Pagination>
  );
};
export default PaginationWrapper;
