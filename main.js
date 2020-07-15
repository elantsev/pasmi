// переменная для аккумулирования введенных данных**************************************************************
const data = {

}

//переключение шагов********************************************************************************************
class Step {
    constructor(name, isOpen, isActive = false) {
        this.name = name;
        this.isOpen = isOpen;
        this.isActive = isActive;
        this.isValid = false;

        this.getTab = function () { return document.querySelector(`.tabs li[data-step=${this.name}]`) }
        this.getElement = function () { return document.querySelector(`#${this.name}`) }
        this.getForm = function () { return document.querySelector(`#${this.name} form`) }
    }
    get tab () { return document.querySelector(`.tabs li[data-step=${this.name}]`) }
    get element () { return document.querySelector(`#${this.name}`) }
    get form () { return document.querySelector(`#${this.name} form`) }
}

let steps = [
    new Step('step1', true),
    new Step('step2', true),
    new Step('step3', true),
    new Step('step4', true),
    new Step('step5', true),
]

const setActiveStep = (stepName) => {
    if (steps.find(step => step.name === stepName && !step.isOpen)) {
        return
    }
    steps.forEach(step => {
        if (step.name === stepName) {
            step.getElement().style.display = 'block';
            step.getTab().className = 'active'
            step.isActive = true
        } else {
            step.getElement().style.display = 'none';
            step.getTab().className = ''
            step.isActive = false
        }
    })
}



const setOpenStep = (stepName, isOpen) => {
    steps = steps.map(step => step.name === stepName ? { ...step, isOpen } : { ...step })
}
const setValidStep = (stepName, isValid) => {
    steps = steps.map(step => step.name === stepName ? { ...step, isValid } : { ...step })
}

steps.forEach((step) => {
    step.tab.addEventListener('click', () => setActiveStep(step.tab.dataset.step))
    step.form?.addEventListener('submit', (e) => submitForm(e, step))
})



//Валидация форм******************************************************************************************

const generateError = (text) => {
    let error = document.createElement('div')
    error.className = 'error'
    error.style.color = 'red'
    error.innerHTML = text
    return error
}

const removeValidation = (form) => {
    let errors = form.querySelectorAll('.error')

    for (let i = 0; i < errors.length; i++) {
        errors[i].remove()
    }
}

const checkFieldsPresence = (fields) => {

    if (!fields) {
        return true
    }
    let result = true

    for (let i = 0; i < fields.length; i++) {
        if (!fields[i].value) {
            let error = generateError('Пожалуйста, заполните обязательное поле.')
            fields[i].parentElement.insertBefore(error, fields[i])
            result = false
        }

        if (fields[i].type === "checkbox" && !fields[i].checked) {
            let error = generateError('Чекбокс не отмечен.')
            fields[i].parentElement.insertBefore(error, fields[i])
            result = false
        }
    }
    return result
}

const checkTelFormat = (tel) => {
    if (!tel) {
        return true
    }
    let result = true
    let regExp = /^([+]?[0-9\s-\(\)]{3,25})*$/i
    if (regExp.test(tel.value) === false) {
        let error = generateError('Некорректный номер телефона.')
        tel.parentElement.insertBefore(error, tel)
        result = false
    }
    return result
}
const checkEmailFormat = (email) => {
    if (!email) {
        return true
    }
    let result = true
    let regExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    if (regExp.test(email.value) === false) {
        let error = generateError('Некорректный e-mail.')
        email.parentElement.insertBefore(error, email)
        result = false
    }
    return result
}

const saveResult = (name, fields) => {
    let result = {}
    fields.forEach(field => {
        if (field.type === 'radio' && field.checked || field.type !== 'radio') {
            result[field.name] = result[field.name] ? result[field.name] : field.value
        }
    })
    data[name] = result
    console.log("saveResult -> data", data)
}

const submitForm = (event, step) => {

    const { name, form } = step
    event.preventDefault()
    removeValidation(form)
    const fields = form.querySelectorAll('input')
    const tel = form.querySelector('.tel input')
    const email = form.querySelector('.email input')

    const isFields = checkFieldsPresence(fields);
    const isTelValid = checkTelFormat(tel);
    const isEmailValid = checkEmailFormat(email);

    if (
        // true
        isFields && (!tel || isTelValid) && (!email || isEmailValid)
    ) {
        saveResult(name, fields)
        const currentIndex = steps.findIndex(s => s.name === step.name)
        const nextStep = steps[currentIndex + 1]
        setOpenStep(name, true)
        setValidStep(name, true)
        setOpenStep(nextStep.name, true)
        setActiveStep(nextStep.name)
    } else {
        console.log(name);
        setValidStep(name, false)
    }
}


// маска телефона*******************************************************************************************************

function setCursorPosition (pos, e) {
    if (e.setSelectionRange) e.setSelectionRange(pos, pos);
    else if (e.createTextRange) {
        let range = e.createTextRange();
        range.collapse(true);
        range.moveEnd("character", pos);
        range.moveStart("character", pos);
        range.select()
    }
}

function mask (e) {
    let matrix = this.placeholder, // .defaultValue
        i = 0,
        def = matrix.replace(/\D/g, ""),
        val = this.value.replace(/\D/g, "");
    def.length >= val.length && (val = def);
    matrix = matrix.replace(/[_\d]/g, function (a) {
        return val.charAt(i++) || "_"
    });
    this.value = matrix;
    i = matrix.lastIndexOf(val.substr(-1));
    i < matrix.length && matrix != this.placeholder ? i++ : i = matrix.indexOf("_");
    setCursorPosition(i, this)
}
window.addEventListener("DOMContentLoaded", function () {
    let input = document.querySelector("#online_phone");
    input.addEventListener("input", mask, false);
    setCursorPosition(4, input);
});


// step5 Поддержать редакцию - выбор суммы transferValue*****************************************************************************


let text = document.querySelector('.transferValue.text input[name="transferValue"]')
let checkboxes = document.querySelectorAll('.transferValue.radio input[name="transferValue"]')

checkboxes.forEach(checkbox => checkbox.addEventListener("click", (e) => setTransferValue(e)))
const setTransferValue = (e) => {
    text.value = ""
}

text.addEventListener('keyup', () => clearCheckboxes())
const clearCheckboxes = () => {
    checkboxes[0].checked = true
}



// select*************************************************************************************************************
var x, i, j, l, ll, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    ll = selElmnt.length;
    /* For each element, create a new DIV that will act as the selected item: */
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /* For each element, create a new DIV that will contain the option list: */
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < ll; j++) {
        /* For each option in the original select element,
        create a new DIV that will act as an option item: */
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function (e) {
            /* When an item is clicked, update the original select box,
            and the selected item: */
            var y, i, k, s, h, sl, yl;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            sl = s.length;
            h = this.parentNode.previousSibling;
            for (i = 0; i < sl; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("same-as-selected");
                    yl = y.length;
                    for (k = 0; k < yl; k++) {
                        y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    break;
                }
            }
            h.click();
        });
        b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
        /* When the select box is clicked, close any other select boxes,
        and open/close the current select box: */
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
}

function closeAllSelect (elmnt) {
    /* A function that will close all select boxes in the document,
    except the current select box: */
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);