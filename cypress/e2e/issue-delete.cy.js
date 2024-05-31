const issueTask = "This is an issue of type: Task.";
const trashIcon = '[data-testid="icon:trash"]';
const confirmPopup = '[data-testid="modal:confirm"]';
const issueDetails = '[data-testid="modal:issue-details"]';
const listBacklog = '[data-testid="board-list:backlog"]';
const listIssue = '[data-testid="list-issue"]';
const closeIcon = '[data-testid="icon:close"]';

describe('Issue Deletion', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
        cy.visit(url + '/board');
        cy.contains(issueTask).click();
        cy.get(issueDetails).should('be.visible');
    });
  });

  it('Should delete the first issue and validate it successfully', () => {
    cy.get(trashIcon).click();
    cy.get(confirmPopup).should('be.visible');
    cy.get(confirmPopup).within(() => {
        cy.contains('Delete issue').click();
    });
    
    cy.get(confirmPopup).should('not.exist');
    cy.get(issueDetails).should('not.exist');
    cy.get(listBacklog).within(() => {
        cy.contains(issueTask).should('not.exist');
        cy.get(listIssue).should('have.length', '3');
    });
  });

  it('Should cancel issue deletion process', () => {
    cy.get(trashIcon).click();
    cy.get(confirmPopup).should('be.visible');
    cy.get(confirmPopup).within(() => {
        cy.contains('Cancel').click();
    });
    
    cy.get(confirmPopup).should('not.exist');
    cy.get(issueDetails).should('exist');
    cy.get(closeIcon).first().click();

    cy.get(listBacklog).within(() => {
        cy.contains(issueTask).should('exist');
        cy.get(listIssue).should('have.length', '4');
    });
  });
});