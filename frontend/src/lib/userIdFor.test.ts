import { userIdFor } from './userIdFor';

describe('userIdFor', () => {
  // Reference values from Python uuid5(NAMESPACE_URL, iss#sub) and the
  // C++ userIdFor() in platform-core.
  it('derives the same UUIDv5 as the backend', () => {
    expect(userIdFor('iss', 'alice')).toBe(
      '8007ee87-a672-5daf-a0cf-aee0be50cfa9',
    );
    expect(
      userIdFor('https://metabuilder.wardcrew.com/api/dbal', 'alice@x.io'),
    ).toBe('ec39c519-90bf-5fed-81f8-8ac7ede6fe41');
  });

  it('keeps subjects that are already UUIDs', () => {
    const id = '123e4567-e89b-12d3-a456-426614174000';
    expect(userIdFor('iss', id)).toBe(id);
  });
});
