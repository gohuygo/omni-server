const models = require('../../../db/models/index');
const User = models.user;
const sequelize = models.sequelize;

describe('user#validations', function () {
  beforeEach(async () => {
    await User.destroy({ where: {}, truncate: true })
  });

  afterAll(() => { sequelize.close() })

  test('it creates a user', async () => {
    const user = await User.create({ email: 'user@email.com', password: 'password', name: 'name1' });
    const user2 = await User.create({ email: 'diff@email.com', password: 'password', name: 'name1' });

    expect(user).not.toBe(null)
    expect(user2).not.toBe(null)
  });

  test('it errors when the email is already used', async () => {
    await User.create({ email: 'user@email.com', password: 'password', name: 'name1' });

    try {
      await User.create({ email: 'user@email.com', password: 'password', name: 'name2' });
    } catch (err) {
      expect(err).not.toBe(null)
      return
    }
    throw new Error('sadf')
  });
});
