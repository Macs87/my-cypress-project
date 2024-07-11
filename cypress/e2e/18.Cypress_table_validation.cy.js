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
      cy.wait('@getTrucks').its('response.statusCode').should('eq', 200);
      cy.get('@getTrucks').then(interception => {
        const response = interception.response.body;
        const items = response.items;
  
        cy.get('div[class=v-table__wrapper] tbody tr').each(($row, index) => {
          const item = items[index];
          if (item.trailer) {
            const trailer = item.trailer;
            cy.wrap($row).within(() => {
              // cy.get('[data-qa=truck-trailer-dims]').should('contain.text', trailer.length.toString() + '″ х ' + trailer.min_height.toString() + '″ x ' + trailer.min_width.toString() +'″ ');
              cy.get('[data-qa=truck-trailer-dims]').should('contain.text', trailer.length.toString());
              cy.get('[data-qa=truck-trailer-dims]').should('contain.text', trailer.min_height.toString());
              cy.get('[data-qa=truck-trailer-dims]').should('contain.text', trailer.min_width.toString());
              cy.get('[data-qa=truck-trailer-dims]').siblings().should('contain.text', trailer.payload.toString() + ' lbs');
            });
          } else {
            cy.log(`Property trailer in item with index ${index} is null.`);
          }
        });
      });
    });
  
  
    it('Filter Functional Test - Test a filter', () => {
      let searchWord = 'Truck3';

      cy.intercept('GET', '/api/v1/trucks?number=Truck3&page=1&page_size=10&archived=false').as('getTrucks');
      cy.get('form').find('.v-row').children().contains('Main information');
      cy.get('[data-qa=number]').find('label').contains('Number').parent().type(searchWord);
      cy.get('[id=search--apply-btn]').click();
      cy.wait('@getTrucks').its('response.statusCode').should('eq', 200);
      cy.get('a[data-qa=truck-number]').each(($el) => {
        cy.wrap($el).should('contain.text', searchWord);
        })
      })

    it('should have "number" filter that works correctly with NOTvalid search word', () => {
      let searchWord = 'Truck6';

      cy.intercept('GET', '/api/v1/trucks?number=Truck6&page=1&page_size=10&archived=false').as('getTrucks');
      cy.get('[data-qa=number]').find('label').contains('Number').parent().type(searchWord);
      cy.get('[id=search--apply-btn]').click();
      cy.wait('@getTrucks').its('response.statusCode').should('eq', 200);
      cy.get('td[colspan=6]').contains('No data available')
    })
  });