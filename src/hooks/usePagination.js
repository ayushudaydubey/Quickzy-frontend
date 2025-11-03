import { useMemo, useState } from 'react';

// Simple reusable client-side pagination hook
// items: array of items to paginate
// pageSize: number of items per page (default 10)
export default function usePagination(items = [], pageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((items?.length || 0) / pageSize));
  }, [items, pageSize]);

  // ensure current page is clamped when items change
  useMemo(() => {
    if (currentPage > totalPages) setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  const paginatedData = useMemo(() => {
    if (!items || items.length === 0) return [];
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const gotoPage = (page) => {
    const p = Number(page) || 1;
    if (p < 1) setCurrentPage(1);
    else if (p > totalPages) setCurrentPage(totalPages);
    else setCurrentPage(p);
  };

  const next = () => gotoPage(currentPage + 1);
  const prev = () => gotoPage(currentPage - 1);

  return {
    paginatedData,
    currentPage,
    totalPages,
    gotoPage,
    next,
    prev,
    setCurrentPage,
  };
}
