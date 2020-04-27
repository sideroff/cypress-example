describe("Input form", () => {
  beforeEach(() => {
    cy.seedAndVisit([]);
  });

  it("focuses input on load", () => {
    cy.focused().should("have.class", "new-todo");
  });

  it("accepts input", () => {
    const inputText = "Buy Milk";

    cy.get(".new-todo").type(inputText).should("have.value", inputText);
  });

  context("Form submission", () => {
    beforeEach(() => {
      cy.server();
    });
    it("Adds a new todo on submit", () => {
      const inputText = "Buy eggs";

      cy.route("POSt", "/api/todos", {
        name: inputText,
        id: 1,
        isComplete: false,
      });
      cy.get(".new-todo")
        .type(inputText)
        .type("{enter}")
        .should("have.value", "");

      cy.get(".todo-list li")
        .should("have.length", 1)
        .and("contain", inputText);
    });

    it("Shows an error message on a failed submission", () => {
      cy.route({
        url: "/api/todos",
        method: "POST",
        status: 500,
        repsonse: {},
      });

      cy.get(".new-todo").type("test{enter}");

      cy.get(".todo-list li").should("not.exist");

      cy.get(".error").should("be.visible");
    });
  });
});
