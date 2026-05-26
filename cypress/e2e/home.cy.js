describe('Home Page', () => {
  it('should display the correct visible text using data-testid', () => {
    cy.visit('/')
    cy.get('[data-testid="home-title"]').should('be.visible')
  });
})