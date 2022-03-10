import { handler } from "../../lib/functions/hello-world";

test("hello world example lambda", async () => {
  const response = handler();
  await expect(response).resolves.toEqual({
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" })
  });
});
