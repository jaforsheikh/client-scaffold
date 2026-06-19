import Swal from "sweetalert2";

export const confirmModal = async ({
  title = "Are you sure?",
  text = "This action cannot be undone.",
  confirmButtonText = "Yes, confirm",
  cancelButtonText = "Cancel",
  icon = "warning",
} = {}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    focusCancel: true,
    buttonsStyling: false,
    customClass: {
      popup: "rounded-[28px] shadow-card",
      title: "text-ink font-extrabold",
      htmlContainer: "text-ink-muted font-semibold",
      actions: "gap-3",
      confirmButton:
        "min-h-12 rounded-button bg-primary px-5 py-3 text-sm font-extrabold text-white transition hover:bg-primary-dark",
      cancelButton:
        "min-h-12 rounded-button border border-surface-border bg-white px-5 py-3 text-sm font-extrabold text-ink transition hover:bg-surface-soft",
    },
  });

  return result.isConfirmed;
};

export default confirmModal;