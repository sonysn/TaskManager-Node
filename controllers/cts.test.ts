import { hasPassedDueDate } from "../controllers/cts";

test("due date", () => {
    expect(hasPassedDueDate(new Date())).toBe(true);
})