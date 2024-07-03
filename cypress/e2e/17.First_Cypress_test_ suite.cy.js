/// <reference types="cypress" />

describe('The Internet App Tests', () => {

  // Test for Add/Remove Elements
  it('Add/Remove Elements', () => {
    cy.visit('https://the-internet.herokuapp.com/add_remove_elements/');
    cy.get('button[onclick="addElement()"]').click(); // Add element
    cy.get('.added-manually').should('have.length', 1); // Check if element is added
    cy.get('.added-manually').click(); // Remove element
    cy.get('.added-manually').should('have.length', 0); // Check if element is removed
  });

  // Test for Checkboxes
  it('Checkboxes', () => {
    cy.visit('https://the-internet.herokuapp.com/checkboxes');
    cy.get('input[type="checkbox"]').first().check().should('be.checked'); // Check first checkbox
    cy.get('input[type="checkbox"]').last().uncheck().should('not.be.checked'); // Uncheck second checkbox
  });

  // Test for Dropdown
  it('Dropdown', () => {
    cy.visit('https://the-internet.herokuapp.com/dropdown');
    cy.get('#dropdown').select('Option 1').should('have.value', '1'); // Select Option 1
    cy.get('#dropdown').select('Option 2').should('have.value', '2'); // Select Option 2
  });

  // Test for Form Authentication
  it('Form Authentication', () => {
    cy.visit('https://the-internet.herokuapp.com/login');
    cy.get('#username').type('tomsmith'); // Enter username
    cy.get('#password').type('SuperSecretPassword!'); // Enter password
    cy.get('button[type="submit"]').click(); // Click login button
    cy.get('#flash').should('contain', 'You logged into a secure area!'); // Verify login success
  });

  // Test for Horizontal Slider
  it('Horizontal Slider', () => {
    cy.visit('https://the-internet.herokuapp.com/horizontal_slider');
    cy.get('input[type="range"]').invoke('val', 3.5).trigger('change'); // Set slider value
    cy.get('#range').should('have.text', '3.5'); // Verify slider value
  });

  // Test for Hovers
  it('Hovers', () => {
    cy.visit('https://the-internet.herokuapp.com/hovers');
    cy.get('.figure').first().realHover(); // Use real hover
    cy.get('.figure').first().find('.figcaption').should('be.visible'); // Verify caption is visible
  });

  // Test for Inputs
  it('Inputs', () => {
    cy.visit('https://the-internet.herokuapp.com/inputs');
    cy.get('input[type="number"]').type('123').should('have.value', '123'); // Enter a number
  });

});
  