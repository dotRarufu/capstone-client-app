export const getCategoryName = (id: number) => {
  switch (id) {
    case 0:
      return 'Information Systems Development'
    case 1:
      return 'Web Application Development'
    case 2:
      return 'Mobile Computing Systems'
    case 3:
      return 'Game Development'
    case 4:
      return 'E-Learning Systems'
    case 5:
      return 'Interactive Experience Systems'
    case 6:
      return 'Information Kiosks'


    default:
      return ''
      break;
  }
}
