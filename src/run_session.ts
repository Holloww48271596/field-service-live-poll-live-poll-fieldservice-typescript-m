import { InfraiClient } from "./infrai_client.ts";
import { runSession, type SessionInput } from "./field_service_session.ts";
import { z } from "zod";

const sessionBody = z.object({
  workOrder: z.string().min(1),
  technician: z.string().min(1),
  dispatch: z.enum(["assigned", "en_route", "complete"]),
  acknowledged: z.boolean()
});
const body = sessionBody.parse({ workOrder: process.argv[2] ?? "WO-1042", technician: process.argv[3] ?? "tech-17", dispatch: "en_route", acknowledged: false });
const key = process.env.INFRAI_API_KEY;
if (!key) throw new Error("INFRAI_API_KEY is required");

const input: SessionInput = body as SessionInput;
const summary = await runSession(input, new InfraiClient(key));
console.log(JSON.stringify(summary, null, 2));
