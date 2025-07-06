
const bcrypt = require('bcryptjs');

function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}
function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

test('hashPassword genera un hash diferente al texto plano', () => {
  const hash = hashPassword('123456');
  expect(hash).not.toBe('123456');
});

test('comparePassword valida correctamente la contraseña', () => {
  const hash = hashPassword('123456');
  expect(comparePassword('123456', hash)).toBe(true);
  expect(comparePassword('wrongpass', hash)).toBe(false);
});