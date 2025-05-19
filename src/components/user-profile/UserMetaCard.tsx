"use client";
import React from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";
import { useUser } from "@/hooks/useUser";

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { user, isLoading, updateUserInStorage } = useUser();

  const [editName, setEditName] = React.useState("");
  const [editEmail, setEditEmail] = React.useState("");
  const [editPhoneNumber, setEditPhoneNumber] = React.useState("");

  React.useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditEmail(user.email || "");
      setEditPhoneNumber(user.phone_number || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (user) {
        updateUserInStorage({
            name: editName,
            email: editEmail,
            phone_number: editPhoneNumber,
        });
    }
    closeModal();
  };

  if (isLoading) {
    return <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 animate-pulse"><div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div></div>;
  }

  if (!user) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <p className="text-gray-500 dark:text-gray-400">사용자 정보를 표시할 수 없습니다.</p>
      </div>
    );
  }

  // Placeholder for user image if not available
  const userInitials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : "U";

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {/* If user.profile_image_url exists, use Image. Otherwise, show initials or a placeholder icon */}
              {/* For now, showing initials as an example */}
              <span className="text-3xl font-semibold text-gray-600 dark:text-gray-300">{userInitials}</span>
              {/* <Image width={80} height={80} src={user.profile_image_url || "/images/user/default-avatar.png"} alt={user.name || "User"} className="object-cover" /> */}
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-1 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user.name || 'Unknown User'}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'N/A'} {/* e.g., Admin, User */}
                </p>
              </div>
            </div>
            {/* Social media icons removed */}
          </div>
          <div className="flex items-center order-1 gap-2 shrink-0 xl:order-3 xl:justify-end">
            <Button
              variant="outline"
              className="justify-center w-full gap-2 lg:w-auto"
              onClick={openModal} // Edit button
            >
             <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5298 2.52999C10.7798 2.27999 11.0923 2.15574 11.4673 2.15574C11.8423 2.15574 12.1548 2.27999 12.4048 2.52999L14.4698 4.59499C14.7198 4.84499 14.8441 5.15749 14.8441 5.53249C14.8441 5.90749 14.7198 6.21999 14.4698 6.46999L9.40483 11.535C9.15483 11.785 8.84233 11.9092 8.46733 11.9092C8.09233 11.9092 7.77983 11.785 7.52983 11.535L5.46483 9.47C5.21483 9.22 5.09058 8.9075 5.09058 8.5325C5.09058 8.1575 5.21483 7.845 5.46483 7.595L10.5298 2.52999ZM12.4611 4.09499L11.4673 3.10124L6.89983 7.66874L7.89358 8.66249L12.4611 4.09499ZM10.0348 14.0362L4.33483 14.0362C4.00483 14.0362 3.72908 13.915 3.50758 13.6725C3.28608 13.4287 3.17558 13.1425 3.17558 12.8137V7.11374C3.17558 7.05374 3.18108 6.99624 3.19208 6.94124L3.58933 5.06624L4.03858 6.03124C4.10233 6.15624 4.19233 6.27374 4.30858 6.38374L6.05708 8.13249C6.12483 8.19999 6.18358 8.25124 6.23358 8.28499L7.01358 8.78874L3.64058 12.1612C3.61058 12.1912 3.59408 12.2212 3.59058 12.2512L2.79558 12.6012C2.74058 12.6237 2.71308 12.6662 2.71308 12.7287C2.71308 12.7737 2.72708 12.8112 2.75483 12.8425C2.78258 12.8725 2.81783 12.8887 2.86058 12.8887H3.74358L9.56358 12.8887C9.64733 12.8887 9.71633 12.8737 9.77058 12.8437C9.82483 12.8137 9.86733 12.7737 9.89708 12.7237L10.0348 12.4837V14.0362Z" fill="currentColor"></path></svg>
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={closeModal}>
          <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14 mb-6 lg:mb-7">
              <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                Edit Personal Information
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Update your details to keep your profile up-to-date.
              </p>
            </div>
            <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
              <div className="custom-scrollbar h-[auto] overflow-y-auto px-2 pb-3">
                {/* Social Links section removed */}
                <div className="mt-7">
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                    Personal Information
                  </h5>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div className="col-span-2">
                      <Label htmlFor="meta-edit-name">Full Name</Label>
                      <Input id="meta-edit-name" type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <Label htmlFor="meta-edit-email">Email Address</Label>
                      <Input id="meta-edit-email" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <Label htmlFor="meta-edit-phone">Phone</Label>
                      <Input id="meta-edit-phone" type="tel" value={editPhoneNumber} onChange={(e) => setEditPhoneNumber(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button size="sm" variant="outline" onClick={closeModal}>
                  Close
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
}
