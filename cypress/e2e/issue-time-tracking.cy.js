Cypress.config('defaultCommandTimeout', 60000);
import IssueModal from "../pages/IssueModal.js";

const estimatedTime = "10";
const editedEstimatedTime = "20";
const timeSpent = "2";
const timeRemaining = "5";

describe('Time estimation and logging functionalities', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

  it('Should add, edit and remove time estimation successfully', () => {
    IssueModal.addEstimation(estimatedTime);
    IssueModal.validateAddedEstimation(estimatedTime);

    IssueModal.editEstimation(editedEstimatedTime);
    IssueModal.validateEditedEstimation(editedEstimatedTime);
  
    IssueModal.removingEstimation();
    IssueModal.validateRemovedEstimation();
  });

  it("Should log time/remove logged time", () => {
    IssueModal.logTime(timeSpent, timeRemaining);
    IssueModal.validateLogTime(timeSpent, timeRemaining);
    IssueModal.removeLoggedTime();
    IssueModal.validateLoggedTimeRemoved(timeSpent, timeRemaining);
  });
});