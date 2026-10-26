import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("placeholder screen", () => {
  it("renders GHOST centered on the page", () => {
    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain("GHOST");
    expect(markup).toContain("items-center justify-center");
  });
});