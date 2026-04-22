it('Query Table Users', { tags: '@DB' }, () => {
  cy.task('READFROMDB', {
    dbConfig: Cypress.config('DB'),
    sql: `Select * from Users`,
  });
});
