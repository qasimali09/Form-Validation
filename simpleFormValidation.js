// create a new instance of FormValidation
const FormValidation = function (form) {
    this.form = form;
    this.fields = form.querySelectorAll('[validation]');
    this.init();
}

// Initialize the form validation
FormValidation.prototype.init = function () {
    this.form.addEventListener('submit', this.validate.bind(this));
}

// validate fields
FormValidation.prototype.validate = function (e) {
    const results = [];
    this.fields.forEach(field => {
        if(field.type === 'checkbox' || field.type === 'radio' || field.type === 'select-one') {
            field.addEventListener('change', this.validateField.bind(this, field));
        }else{
            field.addEventListener('keyup', this.validateField.bind(this, field));
        }
    });
    this.fields.forEach(field => {
        const fieldResult = this.validateField.bind(this)(field);
        results.push(fieldResult);
    });
    if(results.includes(false)) {
        e.preventDefault();
    }
}

// field validation function
FormValidation.prototype.validateField = function (field) {
    const validation = field.getAttribute('validation').split(',');
    const value = field.value;
    const type = field.getAttribute('type');
    if(!field.nextElementSibling) {
        field.parentNode.insertBefore(this.createErrorMessage(""), field.nextSibling);
    }

    if (validation.includes('required') && value === '') {
        field.classList.add('invalid');
        const errorMessage = 'This field is required';
        field.nextElementSibling.innerHTML = errorMessage;
        return false;
    }

    if (validation.includes('email') && !this.validateEmail(value)) {
        field.classList.add('invalid');
        const errorMessage = 'Please enter valid email';
        field.nextElementSibling.innerHTML = errorMessage;
        return false;
    }

    if (validation.includes('phone') && !this.validatePhone(value)) {
        field.classList.add('invalid');
        const errorMessage = 'Please enter valid phone number';
        field.nextElementSibling.innerHTML = errorMessage;
        return false;
    }

    if(validation.includes('required')  && type === 'checkbox' && !field.checked) {
        field.classList.add('invalid');
        const errorMessage = 'This field is required';
        field.nextElementSibling.innerHTML = errorMessage;
        return false;
    }

    if(validation.includes('required')  && type === 'radio' && !field.checked) {
        field.classList.add('invalid');
        const errorMessage = 'This field is required';
        field.nextElementSibling.innerHTML = errorMessage;
        return false;
    }

    field.classList.remove('invalid');
    if(field.nextElementSibling.classList.contains('error-message')) {
        field.nextElementSibling.remove();
    }
    return true;
    
}

// create error message element
FormValidation.prototype.createErrorMessage = function (message) {
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    errorMessage.innerHTML = message;
    return errorMessage;
}

// validate email function
FormValidation.prototype.validateEmail = function (email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// validate phone number function
FormValidation.prototype.validatePhone = function (phone) {
    const re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return re.test(String(phone).toLowerCase());
}