"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cts_1 = require("../controllers/cts");
function add(a, b) {
    return a + b;
}
test('adds 1 + 2 to equal 3', () => {
    expect(add(1, 2)).toBe(3);
});
test("due date", () => {
    expect((0, cts_1.hasPassedDueDate)(new Date())).toBe(true);
});
