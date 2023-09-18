/// <reference types="@testing-library/cypress" />
/// <reference types="cypress" />

import { baseURL } from "./config"
import '@testing-library/cypress/add-commands'


describe('Homepage OpenChatRooms', () => {

  const homePage = () => { cy.visit(`${baseURL}`) }

  it('Should be able to visit the home page without errors.', () => {
    homePage();
    cy.findByText(/Houston/).should("not.exist");
  })

})