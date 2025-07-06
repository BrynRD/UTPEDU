describe('Flujo de login', () => {
  it('valida campos obligatorios', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('button[type="submit"]').click();
    cy.contains('El código institucional es requerido').should('be.visible');
    cy.contains('La contraseña es requerida').should('be.visible');
  });

  it('muestra error con credenciales inválidas', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="codigoInstitucional"]').type('usuarioFake', { delay: 100 });
    cy.get('input[name="password"]').type('contraseñaIncorrecta', { delay: 100 });
    cy.wait(500);
    cy.get('button[type="submit"]').click();
    cy.contains('Credenciales inválidas').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('permite mostrar y ocultar la contraseña', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="password"]').type('contra1234', { delay: 100 });
    cy.wait(300);
    cy.get('input[name="password"]').parent().find('button').click();
    cy.get('input[name="password"]').should('have.attr', 'type', 'text');
    cy.wait(300);
    cy.get('input[name="password"]').parent().find('button').click();
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
  });

  it('permite iniciar sesión con credenciales válidas', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="codigoInstitucional"]').type('C31585', { delay: 100 });
    cy.get('input[name="password"]').type('contra1234', { delay: 100 });
    cy.wait(500);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});