import { useMemo, useEffect, useState, useCallback } from "react";
import { useTable, usePagination } from "react-table";
import { Link } from "react-router-dom";
import { Pagination } from "flowbite-react";
import { productController } from "services/apiController/product";
import { Button } from "flowbite-react";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const onPageChange = (page: number) => setCurrentPage(page);

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
          <Link to={`/edit-product/${row.original._id}`}>
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
            onClick={() => console.log("delete row", row)}
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

  useEffect(() => {
    fetchData();
    return () => {};
  }, [fetchData]);

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
      <Pagination
        className="flex items-center justify-center mt-4"
        currentPage={currentPage}
        onPageChange={onPageChange}
        totalPages={totalPages}
      />
    </>
  );
};

export default ProductTable;
