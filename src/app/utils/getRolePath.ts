export const getRolePath = (roleId: number) => {
  let role = 'a';

  switch (roleId) {
    case 0:
      role = 's';
      break;
    case 1:
      role = 'c';
      break;
    case 2:
      role = 't';
      break;
    case 5:
      role = 'a';
      break;
    default:
      throw new Error('user role error');
  }

  return role;
};
