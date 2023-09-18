/// <reference types="@testing-library/cypress" />
/// <reference types="cypress" />

import { baseURL } from "./config"
import '@testing-library/cypress/add-commands'


describe('Auth OpenChatRooms', () => {

	const auth = () => { cy.visit(`${baseURL}auth`) }
	beforeEach(() => { auth(); })

	it('Should be able to visit the authentication page.', () => { auth(); })

	it('Should be able to access the subscribe or login page.', () => {
		cy.findByText(/enregistrer/).click();
		cy.findByText(/connecter/).click();
		cy.findByText(/enregistrer/).click();
	})

	it('Should not be able to access the login page with an incorrect email and password.', () => {
		cy.findByLabelText(/E-mail/).type("samplefakemail4x5@gmail.com");
		cy.findByLabelText(/passe/).type("coosdfksqdfksodfoskfoskdf");
		cy.findByText(/Envoyer/).click();
		cy.findByText(/invalide/);
	})

})