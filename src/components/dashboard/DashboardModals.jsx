import React from "react";
import ConfirmModal from "../canvas/ConfirmModal";
import ToastNotification from "../common/ToastNotification";
import OversizedFileModal from "../canvas/OversizedFileModal";

const DashboardModals = ({
  notification,
  onCloseNotification,
  oversizedModalData,
  onCloseOversizedModal,
  onProceedEligibleUpload,
  showDeleteAccountModal,
  onCloseDeleteAccountModal,
  onConfirmDeleteAccount,
}) => {
  return (
    <>
      {/* INTERACTIVE TOAST POPUP NOTIFICATION */}
      <ToastNotification
        notification={notification}
        onClose={onCloseNotification}
      />

      {/* OVERSIZED FILE WARNING MODAL */}
      <OversizedFileModal
        isOpen={!!oversizedModalData}
        onClose={onCloseOversizedModal}
        oversizedFiles={oversizedModalData?.oversizedFiles || []}
        validSizeFiles={oversizedModalData?.validSizeFiles || []}
        maxSizeMb={50}
        onProceedEligible={onProceedEligibleUpload}
      />

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={showDeleteAccountModal}
        onClose={onCloseDeleteAccountModal}
        onConfirm={onConfirmDeleteAccount}
        title="Delete User Account?"
        confirmText="Delete Account"
        isDanger={true}
      >
        Are you sure you want to permanently delete your account? All notes, canvas documents, and cloud storage files will be erased forever. This action cannot be undone.
      </ConfirmModal>
    </>
  );
};

export default React.memo(DashboardModals);
