import { configureStore } from "@reduxjs/toolkit";
import { getDefaultMiddleware } from "@reduxjs/toolkit";

import { global_info } from "./reducers";

export default configureStore({
  reducer: { global_info },
  middleware: getDefaultMiddleware({ serializableCheck: false })
});