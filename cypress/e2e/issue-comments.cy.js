Cypress.config('defaultCommandTimeout', 60000);

const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
const commentSection = () => cy.contains("Add a comment...");
const commentTextarea = () => cy.get('textarea[placeholder="Add a comment..."]');
const issueComment = () => cy.get('[data-testid="issue-comment"]');
const deletedIssueComment = '[data-testid="issue-comment"]';
const deleteModalConfirm = () => cy.get('[data-testid="modal:confirm"]')

const saveButton = () => cy.contains('button', 'Save').click().should('not.exist');
const editButton = () => issueComment().first().contains('Edit').click().should('not.exist');
const deleteButton = () => cy.contains('button', 'Delete');

const comment = 'TEST_COMMENT';
const editedComment = 'TEST_COMMENT_EDITED';

function createComment() {
    getIssueDetailsModal().within(() => {
        commentSection().click();
        commentTextarea().type(comment);
        saveButton();
        commentSection().should('exist');
    });
}

function editComment () {
    getIssueDetailsModal().within(() => {
        editButton();

        commentTextarea().should('contain', comment).clear().type(editedComment);

        saveButton();
        });
}

function deleteComment () {
    getIssueDetailsModal()
            .find(deletedIssueComment)
            .contains('Delete')
            .click();

            deleteModalConfirm()
            .contains('button', 'Delete comment')
            .click()
            .should('not.exist');
}

describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    it('Should create, edit and delete a comment successfully', () => {
        createComment(comment);
        issueComment().should('contain', comment);

        editComment(comment, editedComment);
        issueComment().should('contain', 'Edit').and('contain', editedComment);

        deleteComment(editedComment);
        getIssueDetailsModal().find(issueComment).should('not.exist');
    });
});