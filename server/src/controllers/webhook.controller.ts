
import type { Request, Response } from "express";
import { Webhook } from "svix";
import prisma from "../utils/db.js";

export async function clerkWebhook(
  req: Request,
  res: Response
) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET");
  }

  const svix_id = req.headers["svix-id"] as string;
  const svix_timestamp = req.headers["svix-timestamp"] as string;
  const svix_signature = req.headers["svix-signature"] as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({
      success: false,
      message: "Missing Svix headers",
    });
  }

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  try {
    evt = wh.verify(req.body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);

    return res.status(400).json({
      success: false,
      message: "Invalid webhook signature",
    });
  }

  console.log("✅ Webhook verified!");
  console.log("Event Type:", evt.type);

  if (evt.type === "user.created") {
    const user = evt.data;

    const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();

    const email = user.email_addresses?.find(
      (email: any) => email.id === user.primary_email_address_id
    )?.email_address;

    await prisma.users.create({
      data: {
        clerk_id: user.id,
        full_name: fullName,
        email,

        role_id: null,
        status: "PENDING",
        is_active: true,
      },
    });

    console.log("✅ User inserted into Neon");
  }

  return res.status(200).json({
    success: true,
  });
}