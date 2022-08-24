import { toast as toastCall } from "react-toastify";

const toast = {
  errorMessage: (message) => toastCall.error(message),
  successMessage: (message) => toastCall.success(message),
  infoMessage: (message) => toastCall.info(message)
};

export { toast };