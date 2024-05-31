import { faker } from '@faker-js/faker';
const randomTitle = faker.lorem.word();
const randomDescription = faker.lorem.words({ min: 1, max: 10 });


describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project/board`)
      .then((url) => {
        // System will already open issue creating modal in beforeEach block
        cy.visit(url + '/board?modal-issue-create=true');
      });
  });

  it('Should create an issue and validate it successfully', () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Type value to description input field
      cy.get('.ql-editor').type('My bug description');
      cy.get('.ql-editor').should('have.text', 'My bug description');

      // Type value to title input field
      cy.get('input[name="title"]').type('Bug');
      cy.get('input[name="title"]').should('have.value', 'Bug');

      // Open issue type dropdown and choose Bug
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Bug"]').wait(1000).trigger('mouseover').trigger('click');
      cy.get('[data-testid="icon:bug"]').should('be.visible');

      // Select Pickle Rick from reporter dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();

      // Select Lord Gaben from assignee dropdown
      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();

      // Select Highest from priority dropdown
      cy.get('[data-testid="form-field:priority"]').click();
      cy.get('[data-testid="select-option:Highest"]').click();

      // Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    // Reload the page to be able to see recently created issue
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('Bug')
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
            cy.get('[data-testid="icon:bug"]').should('be.visible');
          });
      });

    cy.get('[data-testid="board-list:backlog"]')
      .contains('Bug')
      .within(() => {
        // Assert that correct avatar and type icon are visible
        cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
        cy.get('[data-testid="icon:bug"]').should('be.visible');
      });
  });

  it('Should create an issue with random data and validate it successfully', () => {
    const randomDescription = faker.lorem.sentence(4);
    const randomTitle = faker.lorem.word();

    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Type random value to Description input field
      cy.get('.ql-editor').type(randomDescription);
      cy.get('.ql-editor').should('have.text', randomDescription);

      // Type random value to Title input field
      cy.get('input[name="title"]').type(randomTitle);
      cy.get('input[name="title"]').should('have.value', randomTitle);

      // Select reporter from dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();

      // Select priority from dropdown
      cy.get('[data-testid="form-field:priority"]').click();
      cy.get('[data-testid="select-option:Low"]').click();

      // Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    // Reload the page to be able to see recently created issue
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains(randomTitle)
          .siblings()
          .within(() => {
            //Assert that correct type icon is visible
            cy.get('[data-testid="icon:task"]').should('be.visible');
          });
      });

    cy.get('[data-testid="board-list:backlog"]')
      .contains(randomTitle)
      .within(() => {
        // Assert that correct type icon is visible
        cy.get('[data-testid="icon:task"]').should('be.visible');
      });
  });

});
