import * as dotenv from "dotenv";
dotenv.config();

import midtransClient from "midtrans-client";

export const coreApi = new midtransClient.CoreApi({
  isProduction: false, // Sandbox mode
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});