import { Button, Form, Input } from "antd";
import React from "react";
import GradientButton from "../../../components/common/GradiantButton";
import { useChangePasswordMutation } from "../../../redux/apiSlices/authSlice";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [changePassword] = useChangePasswordMutation();
  const [searchParams] = useSearchParams();

  const handleChangePassword = async (values) => {
    const resetToken = searchParams.get("token");
    try {
      const res = await changePassword({ resetToken, ...values }).unwrap();
      console.log("res =====================>", res);
      if (res?.success) {
        toast.success(res?.message || "Password changed successfully");
      } else {
        toast.error(res?.message || "Password changed failed");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Password changed failed");
    }
  };

  return (
    <div className="">
      <div className="flex flex-col justify-start pl-20 pr-20 pt-5 pb-10 shadow-xl">
        <h2 className="text-2xl font-bold mb-5">Update Password</h2>
        <div>
          <Form
            form={form}
            layout="vertical"
            // className="lg:ms-[50px] pe-[30px] mt-[30px]"
            initialValues={{
              remember: true,
            }}
            style={
              {
                // width: "80%",
              }
            }
            onFinish={handleChangePassword}
          >
            <div className="mb-[20px] w-[100%]">
              <Form.Item
                style={{ marginBottom: 0 }}
                name="currentPassword"
                label={<p style={{ display: "block" }}>Current Password</p>}
                rules={[
                  {
                    required: true,
                    message: "Please input your current password!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Enter Password"
                  type="password"
                  style={{
                    // border: "1px solid #E0E4EC",
                    height: "40px",
                    background: "white",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </Form.Item>
            </div>

            <div className="mb-[20px] w-[100%]">
              <Form.Item
                name="newPassword"
                label={<p style={{ display: "block" }}>New Password</p>}
                dependencies={["currentPassword"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        !value ||
                        getFieldValue("currentPassword") === value
                      ) {
                        return Promise.reject(
                          new Error(
                            "The new password and current password do not match!"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                style={{ marginBottom: 0 }}
              >
                <Input.Password
                  type="password"
                  placeholder="Enter password"
                  style={{
                    // border: "1px solid #E0E4EC",
                    height: "40px",
                    background: "white",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </Form.Item>
            </div>

            <div className="mb-[40px] w-[100%]">
              <Form.Item
                name="confirmPassword"
                label={<p style={{ display: "block" }}>Re-Type Password</p>}
                style={{ marginBottom: 0 }}
                dependencies={["newPassword"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The new password that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  type="password"
                  placeholder="Enter password"
                  style={{
                    // border: "1px solid #E0E4EC",
                    height: "40px",
                    background: "white",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </Form.Item>
            </div>

            {/* Center the Button using Flexbox */}
            <div
              className="flex justify-center mb-[20px]"
              style={{
                width: "100%",
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ height: 40 }}
              >
                Update Password
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
