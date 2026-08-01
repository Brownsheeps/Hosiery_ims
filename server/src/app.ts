import express from "express";
import cors from "cors";
import dashboardRouter from "./routes/dashboard.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import inventoryRouter from "./routes/inventory.js";
import stockRouter from "./routes/stock.js";
import userRouter from "./routes/user.js";
import reportRouter from "./routes/reports.js";
import productRouter from "./routes/products.js";
import webhookRoutes from "./routes/webhook.routes.js";

const app = express();

app.use(cors());


app.use(
    "/api/webhooks/clerk",
    express.raw({ type: "application/json" })
);
//This is important this raw webhoook for clerk because clerk 
//clerk uses webhook so it sends a http request so in that along with the data it also sends a digital signature 
// to verify that the request is comming from clerk and not from any other source 
// so for that digital signature clerk creates it using raw body that is why we need raw body 

app.use("/api/users", userRouter);
app.use(express.json());
app.use("/api/webhooks", webhookRoutes);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/stock", stockRouter);
app.use("/api/reports", reportRouter);
app.use("/api/products", productRouter);

app.use(errorHandler);

export default app;