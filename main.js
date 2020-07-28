// переменная для аккумулирования введенных данных**************************************************************
let data = {

}

const saveResult = (stepName, fields, fieldName) => {
    let result = {}
    if (fieldName) {

        data = {
            ...data,
            [stepName]: {
                ...data[stepName], [fieldName]: fields
            }
        }
        return
    }
    fields.forEach(field => {
        if (field.type === 'file') {
            return
        }
        if (field.type === 'radio' && field.checked || field.type !== 'radio') {
            result[field.name] = result[field.name] ? result[field.name] : field.value
        }
    })

    data = {
        ...data,
        [stepName]: {
            ...data[stepName], ...result
        }
    }
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

        if (fields[i]?.dataset.link === "https://quilljs.com") {
            continue
        } else if (fields[i].tagName === "DIV") {
            if (fields[i].querySelector('.ql-blank')) {
                let error = generateError('Пожалуйста, заполните обязательное поле.')
                fields[i].parentElement.insertBefore(error, fields[i])
                result = false
            }
        } else if (!fields[i].value) {
            let error = generateError('Пожалуйста, заполните обязательное поле.')
            fields[i].parentElement.insertBefore(error, fields[i])
            result = false
        } else if (fields[i].type === "checkbox" && !fields[i].checked) {
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
        let errorText = tel.value === "+7 (___) ___ __ __" ? 'Введите номер телефона.' : 'Некорректный номер телефона.'
        let error = generateError(errorText)
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
const checkDateFormat = (date) => {
    if (!date) {
        return true
    }
    let result = true
    let regExp = /\d{2}\.\d{2}\.\d{4}/
    if (regExp.test(date.value) === false) {
        let errorText = date.value === "__.__.____" ? 'Введите дату.' : 'Некорректная дата.'
        let error = generateError(errorText)
        date.parentElement.insertBefore(error, date)
        result = false
    }
    return result
}

const submitForm = (event, step) => {

    const { name, form } = step
    event.preventDefault()
    removeValidation(form)
    const textareas = form.querySelectorAll('textarea')
    const inputs = form.querySelectorAll('input')
    const editor = form.querySelectorAll('#editor')
    const fields = [...inputs, ...textareas, ...editor]
    const tel = form.querySelector('.tel input')
    const email = form.querySelector('.email input')
    const date = form.querySelector('.step2 .appeal input[name="appealDate"]')

    const isFields = checkFieldsPresence(fields);
    const isTelValid = checkTelFormat(tel);
    const isEmailValid = checkEmailFormat(email);
    const isDateValid = checkDateFormat(date);

    if (
        true
        // isFields && (!tel || isTelValid) && (!email || isEmailValid)&& (!date || isDateValid)
    ) {
        saveResult(name, fields)
        setOpenStep(name, true)
        setValidStep(name, true)
        console.log("submitForm -> data", data)
        if (name !== "step5") {
            const currentIndex = steps.findIndex(s => s.name === step.name)
            const nextStep = steps[currentIndex + 1]
            setOpenStep(nextStep.name, true)
            // setActiveStep(nextStep.name)
        }
        if (name === "step4") {
            // sendDataToServer(data)
        }
        if (name === "step5") {
            // sendDataToServer(data.step5)
        }
    } else {
        setValidStep(name, false)
    }
}


// маска даты*******************************************************************************************************

let dateMask = IMask(
    document.querySelector('.step2 .appeal input[name="appealDate"]'),
    {
        mask: Date,
        lazy: false,
        overwrite: true,
        autofix: true,
        blocks: {
            d: { mask: IMask.MaskedRange, placeholderChar: '_', from: 1, to: 31, maxLength: 2 },
            m: { mask: IMask.MaskedRange, placeholderChar: '_', from: 1, to: 12, maxLength: 2 },
            Y: { mask: IMask.MaskedRange, placeholderChar: '_', from: 1900, to: 2100, maxLength: 4 }
        }
    }



);


// маска телефона*******************************************************************************************************

let phoneMask = IMask(
    document.querySelector('.step1 .tel input[name="tel"]'), {
    mask: '+{7} (000) 000 00 00',
    lazy: false
});



// step5 Поддержать редакцию - выбор суммы transferValue*****************************************************************************


let text = document.querySelector('.transferValue .input-wrapper input[type="text"]')
let checkboxes = document.querySelectorAll('.transferValue.radio input[type="radio"]')

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
    a.setAttribute("class", "select-selected qqq");
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

// editor**************************************************************************************

var options = {
    // debug: 'info', 
    placeholder: 'введите',
    theme: 'snow'
};

var quill = new Quill('#editor', options);

const editorContaiter = document.querySelector(".step3 .editor-contaiter")

document.addEventListener("click", (e) => {
    editorContaiter.style.background = "#ffffff"
})

editorContaiter.addEventListener('click', (e) => {
    e.stopPropagation()
    editorContaiter.style.background = "rgba(205, 214, 241, 0.5)"
    const editor = editorContaiter.querySelector(".ql-editor.ql-blank")
    editor.focus()
})


// PreviewImage******************************************************************************************************

let uploadImage = document.getElementById("uploadImage")
let uploadPreview = document.getElementById("uploadPreview")
let deleteImageBtn = document.getElementById("deleteImage")
let uploadImageLabel = document.getElementById("uploadImageLabel")
deleteImageBtn.onclick = deleteImage
function deleteImage (e) {
    e.preventDefault()
    uploadPreview.style.display = "none"
    uploadImage.value = null
    deleteImageBtn.style.display = "none"
    uploadImageLabel.style.display = 'block'
    saveResult('step3', null, uploadImage.name)
}
function previewImage () {

    let oFReader = new FileReader();
    oFReader.readAsDataURL(uploadImage.files[0]);
    uploadImageLabel.style.display = 'none'
    uploadPreview.style.display = 'block'
    deleteImageBtn.style.display = 'block'
    oFReader.onload = function (oFREvent) {
        document.getElementById("uploadPreview").src = oFREvent.target.result;
    };
    saveResult('step3', uploadImage.files[0], uploadImage.name)
};


// PreviewFiles******************************************************************************************************

previewFiles('.evidence .file', 'step2')
previewFiles('.appeal .file', 'step2')

function previewFiles (selector, step) {
    const input = document.querySelector(`${selector}  input`);
    const preview = document.querySelector(`${selector} .input-wrapper__fileList`);

    input.style.opacity = 0;

    input.addEventListener('change', () => {
        updateImageDisplay()
        saveResult(step, [...input.files], input.name)
    });

    function updateImageDisplay (e, curFiles) {
        while (preview.firstChild) {
            preview.removeChild(preview.firstChild);
        }

        if (!curFiles) {
            curFiles = [...input.files]
        }

        if (curFiles.length === 0) {
            const para = document.createElement('p');
            para.style.color = 'red'
            para.textContent = 'выберите файлы для загрузки';
            preview.appendChild(para);
        } else {
            const list = document.createElement('ol');
            preview.appendChild(list);

            for (const file of curFiles) {
                const listItem = document.createElement('li');
                if (isImage(file)) {
                    const image = document.createElement('img');
                    image.src = URL.createObjectURL(file);

                    listItem.appendChild(image);
                } else {
                    const para = document.createElement('p');
                    para.textContent = `${file.name}, ${returnFileSize(file.size)}.`;
                    para.className = "input-wrapper__file-name";
                    listItem.appendChild(para);
                }
                const deleteButton = document.createElement('span');
                deleteButton.className = "input-wrapper__delete-button"
                deleteButton.textContent = '+';
                const hint = document.createElement('span');
                hint.className = "input-wrapper__hint"
                hint.textContent = 'Удалить';
                deleteButton.onclick = (e) => {
                    e.preventDefault()
                    curFiles = curFiles.filter(f => f.name !== file.name)
                    updateImageDisplay(null, curFiles)
                    saveResult(step, curFiles, input.name)
                    if (!curFiles.length) {
                        input.value = null
                    }
                }
                listItem.appendChild(deleteButton)
                listItem.appendChild(hint)
                list.appendChild(listItem);
            }
        }
    }

    const fileTypes = [
        "image/apng",
        "image/bmp",
        "image/gif",
        "image/jpeg",
        "image/pjpeg",
        "image/png",
        "image/svg+xml",
        "image/tiff",
        "image/webp",
        "image/x-icon"
    ];

    function isImage (file) {
        return fileTypes.includes(file.type);
    }

    function returnFileSize (number) {
        if (number < 1024) {
            return number + 'bytes';
        } else if (number >= 1024 && number < 1048576) {
            return (number / 1024).toFixed(1) + 'KB';
        } else if (number >= 1048576) {
            return (number / 1048576).toFixed(1) + 'MB';
        }
    }
}