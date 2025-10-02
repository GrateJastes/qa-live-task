describe('Tasks app - messy tests', () => {
  it('validation shows error if title missing', () => {
    cy.visit('/');
    cy.get('button').contains('Add Task').click();
    cy.get('#titleError').should('be.visible');
  });

  it('add task and check priority badge', () => {
    cy.visit('/');
    cy.get('input').first().type('Write tests');
    cy.get('textarea').type('some desc');
    cy.get('input[type="date"]').type('2025-10-01');
    cy.get('select').select('high');
    cy.get('button').contains('Add Task').click();

    cy.wait(300);

    cy.contains('Write tests');
    cy.get('.badge.high').should('exist');
  });

  it('complete and filter', () => {
    cy.visit('/');
    cy.get('#title').type('A task');
    cy.get('#save').click();
    cy.wait(200);
    cy.get('#title').type('B task');
    cy.get('#save').click();
    cy.wait(200);

    cy.get('input[type="checkbox"]').first().check();
    cy.get('select').eq(1).select('completed');
    cy.contains('A task');
  });

  it('edit flow', () => {
    cy.visit('/');
    cy.get('#title').type('Original');
    cy.get('#save').click();
    cy.wait(200);
    cy.contains('Edit').click();
    cy.get('#title').clear().type('Edited');
    cy.get('#save').click();
    cy.contains('Edited');
  });

  it('delete task', () => {
    cy.visit('/');
    cy.get('#title').type('Will be deleted');
    cy.get('#save').click();
    cy.wait(200);
    cy.contains('Delete').click();
    cy.contains('Will be deleted').should('not.exist');
  });
});
