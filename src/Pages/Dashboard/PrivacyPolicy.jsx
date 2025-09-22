import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";
import GradientButton from "../../components/common/GradiantButton";
import { Button, message, Modal, Spin } from "antd";
import {
  useGetPrivacyPolicyQuery,
  useCreatePrivacyPolicyMutation,
} from "../../redux/apiSlices/privacyPolicySlice";
import toast from "react-hot-toast";
import { useProfileQuery } from "../../redux/apiSlices/authSlice";

const PrivacyPolicy = () => {
  const editor = useRef(null);
  const { data, isLoading, isError } = useGetPrivacyPolicyQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatePrivacyPolicy] = useCreatePrivacyPolicyMutation();
  const { data: profileData, isLoading: profileLoading } = useProfileQuery();
  if (profileLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin />
      </div>
    );
  }

  const userRole = profileData?.data?.role;



  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const res = await updatePrivacyPolicy({
        id: data?.data?.id,
        content: data?.data?.[0]?.content,
        type: "privacy",
      });
      if (res?.data?.success) {
        toast.success("Privacy Policy updated successfully!");
      } else {
        toast.error("Failed to update Privacy Policy!");
      }
      // When saving, just set the content to the saved state
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to update Privacy Policy!");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Privacy Policy</h2>
        {userRole === "ADMIN" ||
          (userRole === "SUPER_ADMIN") ?
          (
            <Button
              onClick={showModal}
              className="bg-primary !text-white hover:!text-secondary hover:!bg-white hover:!border-primary px-[50px] py-[20px] rounded-lg text-[16px] font-medium"
            >
              Update Privacy Policy
            </Button>
          ) : null}
      </div>

      <div className="saved-content mt-6 border p-6 rounded-lg bg-white">
        <div
          dangerouslySetInnerHTML={{ __html: data?.data?.[0]?.content }}
          className="prose max-w-none"
        />
      </div>

      <Modal
        title="Update Privacy Policy"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width="65%"
        footer={[
          <Button
            key="cancel"
            onClick={handleCancel}
            className="bg-red-500 text-white border-red-500 hover:text-red-500"
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            onClick={handleOk}
            className="bg-primary text-white"
          >
            Update Privacy Policy
          </Button>,
        ]}
      >
        {isModalOpen && (
          <div className="mb-6">
            <JoditEditor
              ref={editor}
              value={data?.data?.[0]?.content}
              onChange={(newContent) => {
                setTermsContent(newContent);
              }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PrivacyPolicy;
