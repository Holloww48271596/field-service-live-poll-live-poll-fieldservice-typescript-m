import assert from "node:assert/strict";
import { summarizeSession } from "./field_service_session.ts";

const result = summarizeSession({ workOrder: "WO-1042", technician: "tech-17", dispatch: "en_route", acknowledged: false }, 2);
assert.equal(result.needsFollowUp, true);
assert.equal(result.published, 3);
assert.equal(result.presence, 2);
console.log("field-service decision test passed");
