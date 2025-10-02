describe('Tasks app - messy tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#taskForm').should('exist');
  });
  it('validation shows error if title missing', () => {
    cy.get('#save').click();
    cy.get('#titleError').should('be.visible');
  });

  it('add task and check priority badge', () => {
    cy.get('#title').first().type('Write tests');
    cy.get('#description').type('some desc');
    cy.get('input[type="date"]').type('2025-10-01');
    cy.get('#priority').select('high');
    cy.get('#save').click();
    cy.wait(300);

    cy.contains('#taskList li','Write tests').should('exist');
    cy.contains('#taskList li', 'Write tests').find('.badge.high').should('exist');


  });

  it('complete and filter', () => {
    cy.get('#title').type('A task');
    cy.get('#save').click();
    cy.get('#title').type('B task');
    cy.get('#save').click();

    cy.contains('#taskList li', 'A task')
      .find('input[type="checkbox"]')
      .check();

    cy.get('#filterStatus').select('completed');
    cy.contains('#taskList li', 'A task').should('exist');
    cy.contains('#taskList li', 'B task').should('not.exist');
  });

  it('edit flow', () => {
    cy.get('#title').type('Original');
    cy.get('#save').click();

    cy.contains('#taskList li', 'Original')
      .find('button')
      .contains('Edit')
      .click();

    cy.get('#title').clear().type('Edited');
    cy.get('#save').click();

    cy.contains('#taskList li', 'Edited').should('exist');
  });

  it('delete task', () => {
    cy.get('#title').type('Will be deleted');
    cy.get('#save').click();

    cy.contains('#taskList li', 'Will be deleted')
      .find('button')
      .contains('Delete')
      .click();

    cy.contains('#taskList li', 'Will be deleted').should('not.exist');
  });

  it('checks resetForm functionality', () => {
    // Fill the form fields
    cy.get('#title').type('Test reset');
    cy.get('#description').type('Reset description');
    cy.get('input[type="date"]').type('2025-10-01');
    cy.get('#priority').select('medium');

    // Click the reset button
    cy.get('#reset').click();

    // Verify that fields are cleared
    cy.get('#title').should('have.value', '');
    cy.get('#description').should('have.value', '');
    cy.get('input[type="date"]').should('have.value', '');
    cy.get('#priority').should('have.value', 'medium'); // default selected
  });
});
