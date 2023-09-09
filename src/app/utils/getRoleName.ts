const getRoleName = (roleId: number) => {
  switch (roleId) {
    case 0:
      return 'Student';

    case 1:
      return 'Capstone Adviser';
    case 2:
      return 'Technical Adviser';

    default:
      return 'Unknown Role';
  }
};

export default getRoleName;
