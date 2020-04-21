import _ from 'lodash';

export default function ValidateForm(form) {
    var errors = {};
    var isValid = true;
    _.forEach(_.keys(form), (key) => {
        if (_.isNumber(form[key])) {
            if (_.isEqual(form[key], '')) {
                isValid = false;
                errors[key] = " ";
            }
        } else if (_.isEmpty(form[key])) {
            isValid = false;
            errors[key] = " ";
        }
    })
    return {
        isValid: isValid,
        formErrors: errors
    }
}

export function ValidateItemExists(formName, list, listProperty, value) {
    var result = _.find(list, (item) => item[listProperty].toLowerCase() === value.toLowerCase());
    if (value && result) {
        return 'There is an active ' + formName + ' with the same name';
    }
    return null;
}

export function checkDate(current, previous) {
    let days = current.diff(previous, 'days')
    if (days > 28) return true
    else return false
}


