import React, { useState, useMemo, useEffect } from "react";
import { Table, Button, Modal, Input, Tooltip, Switch, Spin } from "antd";
import { FaTrash } from "react-icons/fa";
import { EyeOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { Document, Page, pdfjs } from "react-pdf";
import { getImageUrl } from "../common/imageUrl";
import {
  useGetSingleDocumentQuery,
  useCreateDocumentMutation,
  useUpdateDocumentStatusMutation,
  useDeleteDocumentMutation,
  useGetAllDocumentsQuery,
} from "../../redux/apiSlices/submittionManagementSlice";
import { useProfileQuery } from "../../redux/apiSlices/authSlice";

// PDF.js worker setup
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// PDF Viewer Component
const PDFViewer = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState(0);
  return (
    <Document
      file={fileUrl}
      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
    >
      {Array.from({ length: numPages }, (_, index) => (
        <Page key={index} pageNumber={index + 1} width={800} />
      ))}
    </Document>
  );
};

// Reusable Confirm Action Dialog
const confirmAction = async (title, text, action) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  });
  if (result.isConfirmed) {
    action();
  }
};

const SubmissionManagement = () => {
  const [activeTab, setActiveTab] = useState("myDocuments");
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // Track the page size
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const { data, isLoading, isFetching, refetch } = useGetAllDocumentsQuery({
    page,
    limit,
    search: searchText,
  });
  const {
    data: profileData,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useProfileQuery();
  const [
    updateSubmission,
    { isLoading: updateLoading, refetch: refetchUpdate, isError: updateError },
  ] = useUpdateDocumentStatusMutation();
  const [
    deleteSubmission,
    { isLoading: deleteLoading, refetch: refetchDelete, isError: deleteError },
  ] = useDeleteDocumentMutation();
  const [
    createSubmission,
    { isLoading: createLoading, refetch: refetchCreate },
  ] = useCreateDocumentMutation();
  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchText]);
  const {
    data: singleDocument,
    isLoading: singleDocumentLoading,
    isError,
  } = useGetSingleDocumentQuery(selectedRecord?._id);

  // Filtering and pagination logic in useMemo
  const currentData = useMemo(() => {
    const filtered = data?.data.filter(
      (doc) =>
        doc.title.toLowerCase().includes(searchText.toLowerCase()) ||
        doc.user?.name.toLowerCase().includes(searchText.toLowerCase()) ||
        doc.category?.title.toLowerCase().includes(searchText.toLowerCase())
    );
    const start = (pagination.current - 1) * pagination.pageSize;
    return filtered?.slice(start, start + pagination.pageSize);
  }, [data?.data, searchText, pagination]);

  if (isLoading || profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" tip="Loading documents..." />
      </div>
    );
  }

  const documents = data?.data || [];

  const showViewModal = (record) => {
    setSelectedRecord(record);
    setIsViewModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedRecord(null);
  };

  const handleDelete = async (record) => {
    const id = record?._id;
    confirmAction(
      "Are you sure?",
      "You won't be able to revert this!",
      async () => {
        try {
          const res = await deleteSubmission(id);
          console.log("Delete Response:", res);

          if (res?.data?.success) {
            Swal.fire({
              title: "Deleted!",
              text: "Document has been deleted.",
              icon: "success",
              confirmButtonText: "OK",
            });
            refetch();
          } else {
            Swal.fire({
              title: "Error!",
              text: "Document has not been deleted.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Document has not been deleted.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    );
  };

  const handleUpdateDocumentStatus = async (record, checked) => {
    try {
      const res = await updateSubmission({
        id: record._id,
        isActive: checked,
      }).unwrap();
      if (res?.success) {
        Swal.fire({
          title: "Updated!",
          text: "Document status has been updated.",
          icon: "success",
          confirmButtonText: "OK",
        });
        refetch();
      } else {
        Swal.fire({
          title: "Error!",
          text: "Document status has not been updated.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: "Failed to update document status",
        icon: "error",
      });
    }
  };
  const paginationData = data?.pagination || { total: 0 };

  const handlePageChange = (page, pageSize) => {
    setPage(page); // Update page state when page changes
    setLimit(pageSize); // Update page size when pageSize changes
  };

  const columns = [
    {
      title: "SL",
      key: "index",
      align: "center",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    { title: "Title", dataIndex: "title", key: "title", align: "center" },
    {
      title: "User",
      key: "user",
      align: "center",
      render: (record) => record.user?.name || "-",
    },
    {
      title: "Category",
      key: "category",
      align: "center",
      render: (record) => record.category?.title || "-",
    },
    {
      title: "Short Description",
      dataIndex: "sortDescription",
      key: "sortDescription",
      align: "center",
    },
    {
      title: "Detail Description",
      dataIndex: "detailDescription",
      key: "detailDescription",
      align: "center",
    },
    {
      title: "Documents",
      key: "document",
      align: "center",
      render: (record) => (
        <div className="flex flex-col gap-2">
          {record.document?.map((doc, idx) => (
            <a
              key={idx}
              href={doc}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {doc.endsWith(".pdf")
                ? `PDF File ${idx + 1}`
                : `Image ${idx + 1}`}
            </a>
          ))}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      align: "center",
      render: (isActive) => (isActive ? "Active" : "Inactive"),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 150,
      render: (record) => (
        <div className="flex gap-4 justify-center items-center">
          <Tooltip title="View Document">
            <button
              onClick={() => showViewModal(record)}
              className="text-primary hover:text-green-700 text-xl"
            >
              <EyeOutlined />
            </button>
          </Tooltip>

          <Tooltip title="Delete">
            <button
              onClick={() => handleDelete(record)}
              className="text-red-500 hover:text-red-700 text-md"
            >
              <FaTrash />
            </button>
          </Tooltip>

          <Switch
            size="small"
            checked={record.isActive}
            onChange={(checked) => handleUpdateDocumentStatus(record, checked)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <div className="!w-[400px]">
          <Input.Search
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            enterButton
          />
        </div>
      </div>

      {/* Table */}
      <Table
        dataSource={data?.data || []}
        columns={columns}
        pagination={{
          current: page, // Keep pagination state in sync
          pageSize: limit, // Set page size
          total: paginationData.total, // Total count from API response
          onChange: handlePageChange, // Sync page changes
        }}
        rowKey={(record) => record._id}
        size="small"
        loading={isFetching}
        scroll={{ x: "max-content", y: 500 }}
        sticky
        className="custom-table"
      />

      {/* View Modal */}
      <Modal
        open={isViewModalVisible}
        onCancel={handleCloseViewModal}
        width={900}
        footer={null}
        centered
        destroyOnClose
        closeIcon={<span className="text-white text-2xl font-bold">×</span>}
      >
        {selectedRecord && (
          <div className="flex flex-col">
            <div className="bg-primary text-white flex justify-between items-center px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedRecord.title}
                </h2>
                <p className="text-sm mt-1">
                  <strong>User:</strong> {selectedRecord.user?.name} |{" "}
                  <strong>Category:</strong> {selectedRecord.category?.title}
                </p>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-b border-gray-200">
              {selectedRecord.sortDescription && (
                <p className="text-gray-700 mb-2">
                  <strong>Short Description:</strong>{" "}
                  {selectedRecord.sortDescription}
                </p>
              )}
              {selectedRecord.detailDescription && (
                <p className="text-gray-800">
                  <strong>Detail Description:</strong>{" "}
                  {selectedRecord.detailDescription}
                </p>
              )}
            </div>

            <div className="p-6 flex flex-col gap-6 max-h-[70vh] overflow-y-auto bg-white">
              {selectedRecord.document?.map((fileUrl, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg p-4 flex flex-col gap-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium truncate">
                      File {idx + 1}: {fileUrl.split("/").pop()}
                    </h3>
                    <a
                      href={fileUrl}
                      download
                      className="py-1 px-4 rounded border border-primary bg-primary text-white hover:bg-white hover:text-primary transition"
                    >
                      Download
                    </a>
                  </div>

                  {fileUrl.endsWith(".pdf") ? (
                    <div
                      className="border rounded-lg overflow-auto"
                      style={{ height: "400px" }}
                    >
                      <Document
                        file={fileUrl}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                      >
                        {Array.from(new Array(numPages), (_, index) => (
                          <Page
                            key={index}
                            pageNumber={index + 1}
                            width={800}
                          />
                        ))}
                      </Document>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center">
                      <img
                        src={getImageUrl(fileUrl)}
                        alt={selectedRecord.title}
                        className="max-h-[400px] rounded-lg object-contain shadow-md"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubmissionManagement;
