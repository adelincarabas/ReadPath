export function emailValidator(email) {
    const emailFormat = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!email) return "Email can't be empty.";
    if (!emailFormat.test(email)) return 'Not a valid email address.';
    
    return '';
}