import React, { useState } from "react";
import { Form, Input, Button, Select, Upload, message, Spin, Alert } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useCreateDocumentMutation } from "../../redux/apiSlices/submittionManagementSlice";
import { useGetAllCategoryQuery } from "../../redux/apiSlices/categorySlice";

const { Option } = Select;
const { TextArea } = Input;

const UploadDocument = () => {
  // API hooks
  const [createDocument, { isLoading: createLoading }] = useCreateDocumentMutation();
  const {
    data: categoriesResponse,
    isLoading: categoriesLoading,
    isError: categoriesError,
    refetch: refetchCategories,
  } = useGetAllCategoryQuery({ page: 1, limit: 50 });

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  // Extract safe categories array
  const categories = categoriesResponse?.data || [];

  // File Change Handler
  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Form Submit Handler
  const handleSubmit = async (values) => {
    try {
      if (categoriesError) {
        message.error("Cannot submit because categories failed to load. Please retry.");
        return;
      }

      if (fileList.length === 0) {
        message.error("Please upload at least one file");
        return;
      }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("sortDescription", values.sortDescription); 
      formData.append("category", values.category); 
      formData.append("detailDescription", values.detailDescription);

      fileList.forEach((file) => {
        formData.append("document", file.originFileObj);
      });

      const res = await createDocument(formData).unwrap();

      if (res?.success) {
        message.success("Document uploaded successfully!");
        form.resetFields();
        setFileList([]);
      } else {
        message.error(res?.message || "Failed to upload document");
      }
    } catch (err) {
      console.error("Upload error:", err);
      message.error(err?.data?.message || "Something went wrong while uploading");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 rounded-md shadow-sm bg-white p-6">
      <Spin spinning={createLoading || categoriesLoading}>
        {/* Show error if categories fail to load */}
        {categoriesError && (
          <Alert
            message="Failed to load categories"
            description="Please check your internet or server and try again."
            type="error"
            showIcon
            action={
              <Button size="small" onClick={refetchCategories}>
                Retry
              </Button>
            }
            className="mb-4"
          />
        )}

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="border-2 border-primary p-6 rounded-lg">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left side */}
              <div className="flex-1 flex flex-col space-y-6">
                <Form.Item
                  label="Title"
                  name="title"
                  rules={[{ required: true, message: "Please enter the document title" }]}
                >
                  <Input placeholder="Enter document title" />
                </Form.Item>

                <Form.Item
                  label="Short Description"
                  name="sortDescription"
                  rules={[{ required: true, message: "Please enter a short description" }]}
                >
                  <Input placeholder="Enter a brief description" />
                </Form.Item>
              </div>

              {/* Right side */}
              <div className="flex-1 flex flex-col space-y-6">
                <Form.Item
                  label="Category"
                  name="category"
                  rules={[{ required: true, message: "Please select a category" }]}
                >
                  <Select
                    placeholder={categoriesLoading ? "Loading categories..." : "Select category"}
                    loading={categoriesLoading}
                    disabled={categoriesError}
                  >
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <Option key={cat._id} value={cat._id}>
                          {cat.title}
                        </Option>
                      ))
                    ) : (
                      <Option disabled>No categories found</Option>
                    )}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="File upload (PDF/images)"
                  name="file"
                  rules={[{ required: true, message: "Please upload a file" }]}
                >
                  <Upload
                    fileList={fileList}
                    onChange={handleFileChange}
                    beforeUpload={() => false}
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg"
                  >
                    <Button icon={<UploadOutlined />}>Choose File</Button>
                  </Upload>
                </Form.Item>
              </div>
            </div>

            {/* Detailed Description */}
            <Form.Item
              label="Detailed Description"
              name="detailDescription"
              rules={[{ required: true, message: "Please enter detailed description" }]}
            >
              <TextArea rows={5} placeholder="Enter detailed description here..." />
            </Form.Item>
          </div>

          {/* Submit Button */}
          <Form.Item>
            <Button
              htmlType="submit"
              loading={createLoading}
              className="w-full mt-4 bg-primary !text-white hover:!text-secondary hover:!bg-white hover:!border-primary px-[50px] py-[20px] rounded-lg text-[16px] font-medium"
            >
              {createLoading ? "Uploading..." : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default UploadDocument;
