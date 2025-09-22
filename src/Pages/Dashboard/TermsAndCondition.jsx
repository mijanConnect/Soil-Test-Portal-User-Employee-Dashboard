import { Button, message, Modal } from "antd";
import JoditEditor from "jodit-react";
import { useRef, useState, useEffect } from "react";
import { useGetTermsAndConditionsQuery } from "../../redux/apiSlices/termsAndConditionSlice";
import { useProfileQuery } from "../../redux/apiSlices/authSlice";

const TermsAndCondition = () => {
  const editor = useRef(null);
  const { data: profileData } = useProfileQuery();
  const userRole = profileData?.data?.role;
  console.log(userRole)

  // API call
  const { data, isLoading } = useGetTermsAndConditionsQuery();

  // State for editor content
  const [termsContent, setTermsContent] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Set content when API data loads
  useEffect(() => {
    if (data?.data?.length > 0) {
      setTermsContent(data.data[0].content);
    }
  }, [data]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    // You can send `termsContent` to your API here if needed
    setIsModalOpen(false);
    message.success("Terms & Conditions updated successfully!");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
      {/* Header with Update button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Terms & Conditions</h2>
        {userRole ==="ADMIN" && <Button
          onClick={showModal}
          className="bg-primary !text-white hover:!text-secondary hover:!bg-white hover:!border-primary px-[50px] py-[20px] rounded-lg text-[16px] font-medium"
        >
          Update Terms & Conditions
        </Button>}
      </div>

      {/* Saved content */}
      <div className="saved-content mt-6 border p-6 rounded-lg bg-white">
        <div
          dangerouslySetInnerHTML={{ __html: termsContent }}
          className="prose max-w-none"
        />
      </div>

      {/* Modal */}
      <Modal
        title="Update Terms & Conditions"
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
            {userRole ==="ADMIN" && "Update Terms & Conditions"}
          </Button>,
        ]}
      >
        {isModalOpen && (
          <div className="mb-6">
            <JoditEditor
              ref={editor}
              value={termsContent}
              onChange={(newContent) => setTermsContent(newContent)}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TermsAndCondition;
