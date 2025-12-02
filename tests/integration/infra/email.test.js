import email from "infra/email.js";

describe("infra/email.js", () => {
  test("send()", async () => {
    await email.send({
      from: "TabNews <matheus@tabnews.com.br>",
      to: "contato@curso.dev",
      subject: "Teste de assunto",
      text: "Teste de corpo",
    });
  });
});
