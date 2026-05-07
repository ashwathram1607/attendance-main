import { describe, it, expect, beforeEach } from "vitest";
import { useCounterStore } from "../store";

// Reset store state before each test
beforeEach(() => {
  useCounterStore.setState({ count: 0 });
});

describe("useCounterStore", () => {
  it("should have an initial count of 0", () => {
    expect(useCounterStore.getState().count).toBe(0);
  });

  it("should increment the count", () => {
    useCounterStore.getState().increment();
    expect(useCounterStore.getState().count).toBe(1);
  });

  it("should decrement the count", () => {
    useCounterStore.setState({ count: 2 }); // Set initial state for test
    useCounterStore.getState().decrement();
    expect(useCounterStore.getState().count).toBe(1);
  });

  it("should reset the count", () => {
    useCounterStore.setState({ count: 5 }); // Set initial state for test
    useCounterStore.getState().reset();
    expect(useCounterStore.getState().count).toBe(0);
  });
});
