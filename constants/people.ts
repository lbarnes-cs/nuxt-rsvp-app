export interface Person {
  firstName: string;
  lastName: string;
  fullName: string;
}

function createPerson(firstName: string, lastName: string): Person {
  return {
    firstName,
    lastName,
    get fullName() {
      return `${firstName} ${lastName}`;
    },
  };
}

export const personA = createPerson("Alex", "Example");
export const personB = createPerson("Jamie", "Sample");
