import { useMemo, useEffect, useState, useCallback, MouseEvent } from "react";
import { useTable, usePagination } from "react-table";
import { Link } from "react-router-dom";
import { Pagination } from "flowbite-react";
import { productController } from "services/apiController/product";
import { Button } from "flowbite-react";
import DeleteModal from "components/modal/DeleteModal";
import { useSuccessToast } from "hooks/toast/useSuccessToast";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(
    null
  );

  const onPageChange = (page: number) => setCurrentPage(page);

  const fetchData = useCallback(async () => {
    const response = await productController().get({
      page: currentPage,
      sort: "-createdAt",
      limit: 10,
    });

    const { data } = response;
    setTotalPages(data?.totalPages ?? 0);

    setProducts(response.data.products);
  }, [currentPage]);

  const columns = useMemo(
    () => [
      {
        Header: "No",
        accessor: (row, i) => (currentPage - 1) * 10 + (i + 1),
      },
      {
        Header: "Product Name",
        accessor: "name",
        Cell: ({ row }) => (
          <Link to={`/admin/edit-product/${row.original._id}`}>
            {row.original.name}
          </Link>
        ),
      },
      {
        Header: "Price",
        accessor: "price",
      },
      {
        Header: "In Stock",
        accessor: "quantity",
      },
      {
        Header: "Action",
        accessor: "delete",
        Cell: ({ row }) => (
          <Button
            pill
            size="sm"
            color="failure"
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              const { original } = row;
              const { _id } = original;
              onClickDelete(e, _id);
            }}
          >
            Delete
          </Button>
        ),
      },
    ],
    [currentPage]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable({ columns, data: products }, usePagination) as any;

  useEffect(() => {
    fetchData();
    return () => {};
  }, [fetchData]);

  const onCloseModal = useCallback(() => setDeleteModalOpen(false), []);

  const onDeleteProduct = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (productIdToDelete) {
        const result = await productController().delete(productIdToDelete);
        const { status, message } = result;

        if (status === 200) {
          fetchData();
          useSuccessToast(message);
        }
      }
      onCloseModal();
    },
    [productIdToDelete]
  );

  const onClickDelete = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    setProductIdToDelete(id);
    setDeleteModalOpen(true);
  };

  return (
    <>
      <table {...getTableProps()} className="w-full divide-y divide-gray-200">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-50">
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          {...getTableBodyProps()}
          className="bg-white divide-y divide-gray-200"
        >
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {totalPages > 1 && (
        <Pagination
          className="flex items-center justify-center mt-4"
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={totalPages}
        />
      )}
      {deleteModalOpen && (
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={onCloseModal}
          onDelete={onDeleteProduct}
        />
      )}
    </>
  );
};

export default ProductTable;
