/// <reference types="cypress" />

describe('Trucks Page Tests', () => {
    beforeEach(() => {
      cy.visit('https://dev.omni-dispatch.com/login');
      cy.get('input[type="email"]').type('test@gmail.com');
      cy.get('input[type="password"]').type('12345678');
      cy.get('button').contains('Log in').click();
      cy.url({ timeout: 10000 }).should('include', '/chats');
      cy.visit('https://dev.omni-dispatch.com/fleets/trucks');
    });
  
    it('Page loads successfully', () => {
      cy.url().should('include', '/fleets/trucks');
      cy.get('table').should('be.visible');
      cy.get('form').within(() => {
        cy.get('input, select, button').each((el) => {
          cy.wrap(el).should('exist');
        });
      });
    });
  
    it('Table and filters are displayed', () => {
      cy.get('table').should('be.visible');
      cy.get('form').within(() => {
        cy.get('input, select, button').each((el) => {
          cy.wrap(el).should('exist');
        });
      });
    });
  
    it('Backend Data Test - Trucks information is fetched from backend', () => {
        cy.intercept('GET', '/api/v1/trucks?page=1&page_size=10&archived=false').as('getTrucks');
        cy.visit('https://dev.omni-dispatch.com/fleets/trucks');
        cy.wait('@getTrucks').then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
          expect(interception.response.body).to.have.property('total').that.is.greaterThan(0);
          
        });
      });
  
    
      it('Dims & payload validation', () => {
        cy.intercept('GET', '/api/v1/trucks?page=1&page_size=10&archived=false').as('getTrucks');
    
        cy.wait('@getTrucks').then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
    
          cy.log(JSON.stringify(interception.response.body));
        });
      });
  
      it('Filter Functional Test - Test a filter', () => {
             
        
        cy.url().should('include', '/fleets/trucks');
        cy.get('[data-qa="number"]').should('be.visible');
        cy.get('[data-qa="truck-type"]').should('be.visible');
        cy.get('[data-qa="truck-status"]').should('be.visible');
        cy.get('[data-qa="truck-phone"]').should('be.visible');
        cy.get('[class="v-table__wrapper"]').find('table').should('be.visible');
    
        cy.intercept('GET', '/api/v1/trucks?page=1&page_size=10&archived=false').as('getTrucks');
        cy.visit('https://dev.omni-dispatch.com/fleets/trucks');
        cy.wait('@getTrucks').then((interception) => {
            const trucksFromBackend = interception.response.body.items; // Припустимо, що тут зберігаються дані про вантажівки
            
            // Перевіряємо дані в кожному рядку таблиці
            trucksFromBackend.forEach((truck, index) => {
                cy.get('table tbody tr').eq(index).within(() => {
                    // Перевіряємо наявність і вміст внутрішнього div з класом 'text-grey-darken-3' і атрибутом data-qa="truck-trailer-dims"
                    cy.get('td.v-data-table__td.v-data-table-column--align-right > div.text-grey-darken-3[data-qa="truck-trailer-dims"]')
                        .should('contain', '168″ х 90″ x 90″');
                });
            });
        });

      });
  });