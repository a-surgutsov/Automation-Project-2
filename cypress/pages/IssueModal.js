class IssueModal {
    constructor() {
        this.submitButton = 'button[type="submit"]';
        this.issueModal = '[data-testid="modal:issue-create"]';
        this.issueDetailModal = '[data-testid="modal:issue-details"]';
        this.title = 'input[name="title"]';
        this.issueType = '[data-testid="select:type"]';
        this.descriptionField = '.ql-editor';
        this.assignee = '[data-testid="select:userIds"]';
        this.backlogList = '[data-testid="board-list:backlog"]';
        this.issuesList = '[data-testid="list-issue"]';
        this.deleteButton = '[data-testid="icon:trash"]';
        this.deleteButtonName = "Delete issue";
        this.cancelDeletionButtonName = "Cancel";
        this.confirmationPopup = '[data-testid="modal:confirm"]';
        this.closeDetailModalButton = '[data-testid="icon:close"]';
        this.issueTask = 'This is an issue of type: Task.';
        
        this.numberPlaceholder = 'input[placeholder="Number"]';
        this.iconClose = '[data-testid="icon:close"]';
        this.trackingModal = '[data-testid="modal:tracking"]';
        this.iconStopwatch = '[data-testid="icon:stopwatch"]';
        this.buttonDone = "Done";
    }

    getIssueModal() {
        return cy.get(this.issueModal);
    }

    getIssueDetailModal() {
        return cy.get(this.issueDetailModal);
    }

    selectIssueType(issueType) {
        cy.get(this.issueType).click('bottomRight');
        cy.get(`[data-testid="select-option:${issueType}"]`)
            .trigger('mouseover')
            .trigger('click');
    }

    selectAssignee(assigneeName) {
        cy.get(this.assignee).click('bottomRight');
        cy.get(`[data-testid="select-option:${assigneeName}"]`).click();
    }

    editTitle(title) {
        cy.get(this.title).debounced('type', title);
    }

    editDescription(description) {
        cy.get(this.descriptionField).type(description);
    }

    createIssue(issueDetails) {
        this.getIssueModal().within(() => {
            this.selectIssueType(issueDetails.type);
            this.editDescription(issueDetails.description);
            this.editTitle(issueDetails.title);
            this.selectAssignee(issueDetails.assignee);
            cy.get(this.submitButton).click();
        });
    }

    ensureIssueIsCreated(expectedAmountIssues, issueDetails) {
        cy.get(this.issueModal).should('not.exist');
        cy.reload();
        cy.contains('Issue has been successfully created.').should('not.exist');

        cy.get(this.backlogList).should('be.visible').and('have.length', '1').within(() => {
            cy.get(this.issuesList)
                .should('have.length', expectedAmountIssues)
                .first()
                .find('p')
                .contains(issueDetails.title);
            cy.get(`[data-testid="avatar:${issueDetails.assignee}"]`).should('be.visible');
        });
    }

    ensureIssueIsVisibleOnBoard(issueTitle) {
        cy.get(this.issueDetailModal).should('not.exist');
        cy.reload();
        cy.contains(issueTitle).should('be.visible');
    }

    ensureIssueIsNotVisibleOnBoard(issueTitle) {
        cy.get(this.issueDetailModal).should('not.exist');
        cy.reload();
        cy.contains(issueTitle).should('not.exist');
    }

    validateIssueVisibilityState(issueTitle, isVisible = true) {
        cy.get(this.issueDetailModal).should('not.exist');
        cy.reload();
        cy.get(this.backlogList).should('be.visible');
        if (isVisible)
            cy.contains(issueTitle).should('be.visible');
        if (!isVisible)
            cy.contains(issueTitle).should('not.exist');
    }

    clickDeleteButton() {
        cy.get(this.deleteButton).click();
        cy.get(this.confirmationPopup).should('be.visible');
    }

    confirmDeletion() {
        cy.get(this.confirmationPopup).within(() => {
            cy.contains(this.deleteButtonName).click();
        });
        cy.get(this.confirmationPopup).should('not.exist');
        cy.get(this.backlogList).should('be.visible');
    }

    cancelDeletion() {
        cy.get(this.confirmationPopup).within(() => {
            cy.contains(this.cancelDeletionButtonName).click();
        });
        cy.get(this.confirmationPopup).should('not.exist');
        cy.get(this.issueDetailModal).should('be.visible');
    }

    closeDetailModal() {
        cy.get(this.issueDetailModal).get(this.closeDetailModalButton).first().click();
        cy.get(this.issueDetailModal).should('not.exist');
    }


// Assignment #2

addEstimation(estimatedTime) {
  cy.get(this.issueDetailModal).within(() => {
    cy.get(this.numberPlaceholder)
      .clear()
      .type(estimatedTime)
      .should("have.value", estimatedTime);
    cy.get(this.iconStopwatch)
        .next()
        .contains(estimatedTime + "h estimated");
  });
}

validateAddedEstimation(estimatedTime) {
  cy.get(this.iconClose).eq(0).click();
  cy.get(this.backlogList).should("be.visible").contains(this.issueTask).click();
  cy.get(this.issueDetailModal).within(() => {
    cy.get(this.numberPlaceholder).should("have.value", estimatedTime);
  });
}

editEstimation(editedEstimatedTime) {
  cy.get(this.numberPlaceholder)
    .clear()
    .type(editedEstimatedTime)
    .should("have.value", editedEstimatedTime);
  cy.get(this.iconStopwatch)
    .next()
    .contains(editedEstimatedTime + "h estimated");
}

validateEditedEstimation(editedEstimatedTime) {
  cy.get(this.iconClose).eq(0).click();
  cy.get(this.backlogList).should("be.visible").contains(this.issueTask).click();
  cy.get(this.issueDetailModal).within(() => {
    cy.get(this.numberPlaceholder).should("have.value", editedEstimatedTime);
  });
}

removingEstimation() {
  cy.get(this.numberPlaceholder)
    .clear()
    .should("be.empty");
  cy.get(this.issueDetailModal).contains("Original Estimate (hours)").click();
}

validateRemovedEstimation() {
  cy.get(this.iconClose).eq(0).click();
  cy.get(this.backlogList).should("be.visible").contains(this.issueTask).click();
  cy.get(this.issueDetailModal).within(() => {
    cy.get(this.numberPlaceholder).should("exist");
  });
}





logTime(timeSpent, timeRemaining) {
  cy.get(this.iconStopwatch).click();
  cy.get(this.trackingModal).within(() => {
    cy.get(this.numberPlaceholder)
      .eq(0)
      .clear()
      .type(timeSpent);
    cy.get(this.numberPlaceholder)
      .eq(1)
      .clear()
      .type(timeRemaining);
    cy.contains("button", this.buttonDone).click();
  });
  cy.get(this.trackingModal).should("not.exist");
}

validateLogTime(timeSpent, timeRemaining) {
  cy.get(this.issueDetailModal).within(() => {
    cy.contains(`${timeSpent}h logged`).should("be.visible");
    cy.contains(`${timeRemaining}h remaining`).should("be.visible");
  });
}

removeLoggedTime() {
  cy.get(this.iconStopwatch).click();
  cy.get(this.trackingModal).within(() => {
    cy.get(this.numberPlaceholder).eq(0).clear();
    cy.get(this.numberPlaceholder).eq(1).clear();
    cy.contains("button", this.buttonDone).click();
  });
  cy.get(this.trackingModal).should("not.exist");
}

validateLoggedTimeRemoved(timeSpent, timeRemaining) {
  cy.get(this.issueDetailModal).within(() => {
    cy.contains(`${timeSpent}h logged`).should("not.exist");
    cy.contains(`${timeRemaining}h remaining`).should("not.exist");
    cy.contains("No time logged").should("be.visible");
  });
}
}

export default new IssueModal();