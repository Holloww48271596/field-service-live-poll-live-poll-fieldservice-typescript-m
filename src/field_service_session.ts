import { InfraiClient } from "./infrai_client.ts";

export type SessionInput = { workOrder: string; technician: string; dispatch: "assigned" | "en_route" | "complete"; acknowledged: boolean };
export type SessionSummary = { channel: string; published: number; presence: number; needsFollowUp: boolean };

export function summarizeSession(input: SessionInput, presence: number): SessionSummary {
  return { channel: `field-service-${input.workOrder}`, published: 3, presence, needsFollowUp: input.dispatch === "en_route" && !input.acknowledged };
}

export async function runSession(input: SessionInput, client: InfraiClient): Promise<SessionSummary> {
  const channel = `field-service-${input.workOrder}`;
  await client.createChannel(channel);
  await client.publish(channel, "work_order.photo", { work_order: input.workOrder, technician: input.technician, photo: "received" }, input.workOrder);
  await client.publish(channel, "dispatch.status", { work_order: input.workOrder, technician: input.technician, dispatch: input.dispatch }, input.workOrder);
  await client.publish(channel, "technician.follow_up", { work_order: input.workOrder, technician: input.technician, acknowledged: input.acknowledged }, input.workOrder);
  const currentPresence = await client.presence(channel);
  return summarizeSession(input, Array.isArray(currentPresence.members) ? currentPresence.members.length : 0);
}
