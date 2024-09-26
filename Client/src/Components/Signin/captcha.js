const captchaTextBox = document.querySelector('.captcha_box input')
const refreshButton = document.querySelector('.refresh-button')
const captchaInput = document.querySelector('.captcha_input input')
const submitButton = document.querySelector('button')


// let captcha = null


const generateCaptcha = () => {
    const randomString = Math.random().toString(36).substring(2,7)
    console.log(randomString)
    
}

generateCaptcha()