export default class Service {
  isEmail = email => {
    return email.match(/^(?:\w+@\w+\.\w+)$/g);
  };
  isPhoneNumber = number => {
    return number.match(/^(\d+)$/g);
  };
}
