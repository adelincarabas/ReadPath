export function nameValidator(name) {
    if (!name) return "Username cannot be empty.";
    if (name.length < 5) {
      return 'Username must be at least 5 characters long.';
    }
    return '';
  }