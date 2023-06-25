export function passwordValidator(password) {
    if (!password) {
        return "Password can't be empty.";
    }
    if (password.length < 5) {
        return 'Password must be at least 5 characters long.';
    }
    if (!/\d/.test(password)) {
        return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return 'Password must contain at least one special character';
    }
    
    return '';
}