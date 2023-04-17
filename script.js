const hour = document.getElementById('hour')
const minute = document.getElementById('minute')
const second = document.getElementById('second')

const start = document.getElementById('start')
const reset = document.getElementById('reset')

const statusMsg = document.getElementById('status')
const error = document.getElementById('error')
const time = document.getElementById('time')

var flasher = null;
var interval = null;
var timer_duration = '';
var total_seconds = 0;

// TWILIO IDS - authToken accountSid
const accountSid ="AC93f6dbd5a10a779e73558c9fb277db54";
const authToken = 'a45a3b2af783f27719f368cb0da103d7';

const phone = document.getElementById('phonenumber');

phone.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        value = '(' + value;
    }
    if (value.length > 4) {
        value = value.slice(0, 4) + ') ' + value.slice(4);
    }
    if (value.length > 9) {
        value = value.slice(0, 9) + '-' + value.slice(9);
    }
    e.target.value = value;
});

// Usage: phonenumber() gives the user's phone number as a number.
// Number.MAX_SAFE_INTEGER = 9007199254740991 (larger than any phone number)
const phonenumber = () => +phone.value.replace(/\D/g, '')

const padZero = (number) => {
    return number.toString().padStart(2, '0');
}

const totalValue = () => {
    total_seconds = (+hour.value) * 3600 + (+minute.value) * 60 + (+second.value);
}

const validateTime = () => {
    if (hour.value === '' && minute.value === '' && second.value === '') {
        time.classList.add('error');
        error.ariaHidden = false;
        return;
    }
    let validHour = +hour.value >= +hour.min && +hour.value <= +hour.max;
    let validMinute = +minute.value >= +minute.min && +minute.value <= +minute.max;
    let validSecond = +second.value >= +second.min && +second.value <= +second.max;
    if (!validHour || !validMinute || !validSecond) {
        time.classList.add('error');
        error.ariaHidden = false;
        return;
    }
    time.classList.remove('error');
    error.ariaHidden = true;
}

const Timer = () => {
    totalValue();
    total_seconds--;

    if (total_seconds >= 0) {
        var hr = padZero(Math.floor(total_seconds / 3600));
        var mt = padZero(Math.floor((total_seconds % 3600) / 60));
        var sc = padZero(Math.floor((total_seconds % 3600) % 60));

        hour.value = hr;
        minute.value = mt;
        second.value = sc;
    }
    if (total_seconds === 0) {
        statusMsg.innerText = "Time Over!"
        clearInterval(flasher);
        flasher = setInterval(() => {
            document.body.classList.toggle('flash');
        }, 1000 /* ms */);
        
        console.log("Your", timer_duration, "timer just finished.");
        var pnumber = "+1" + phonenumber().toString();
        console.log("Phone number", pnumber);

        // TODO: Send a text message to the user's phone number using Twilio.
        if(pnumber.length == 12){
            $.ajax({
                type: "POST",
                username: 'AC93f6dbd5a10a779e73558c9fb277db54',
                password: 'a45a3b2af783f27719f368cb0da103d7',
                url: "https://api.twilio.com/2010-04-01/Accounts/AC93f6dbd5a10a779e73558c9fb277db54/Messages.json",
                data: {
                  "To" : pnumber,
                  "From" : "+18556080922",
                  "Body" : "AllTime - Time Over!"
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader ("Authorization", "Basic " + btoa('AC93f6dbd5a10a779e73558c9fb277db54' + ':' + 'a45a3b2af783f27719f368cb0da103d7'));
                },
                success: function(data) {
                  console.log(data);
                },
                error: function(data) {
                  console.log(data);
                }
            });

        }
        
    }
}

start.addEventListener('click', (e) => {
    e.preventDefault();
    clearInterval(interval);
    interval = setInterval(Timer, 1000 /*ms*/);

    hour.value = padZero(hour.value);
    minute.value = padZero(minute.value);
    second.value = padZero(second.value);

    timer_duration = hour.value + 'hr ' + minute.value + 'min ' + second.value + 'sec';

    statusMsg.innerText = "Timer Started";
    var pnumber = "+1" + phonenumber().toString();
    console.log("Phone number", pnumber);

});

reset.addEventListener('click', (e) => {
    e.preventDefault();
    clearInterval(interval);
    hour.value = '';
    minute.value = '';
    second.value = '';

    clearInterval(flasher);
    document.body.classList.remove('flash');
    statusMsg.innerText = "Timer";
    hour.focus();
});

hour.addEventListener('input', (e) => {
    if (e.target.value.length >= 2) {
        minute.focus();
    }
});

hour.addEventListener('focusout', (e) => {
    validateTime();
    if (e.target.value.length > 0) {
        e.target.classList.add('nonempty');
        e.target.value = padZero(e.target.value);
    } else {
        e.target.classList.remove('nonempty');
    }
});

minute.addEventListener('input', (e) => {
    if (e.target.value.length >= 2) {
        second.focus();
    }
});

minute.addEventListener('focusout', (e) => {
    validateTime();
    if (e.target.value.length > 0) {
        e.target.classList.add('nonempty');
        e.target.value = padZero(e.target.value);
    } else {
        e.target.classList.remove('nonempty');
    }
});

second.addEventListener('input', (e) => {
    if (e.target.value.length >= 2) {
        start.focus();
    }
});

second.addEventListener('focusout', (e) => {
    validateTime();
    if (e.target.value.length > 0) {
        e.target.classList.add('nonempty');
        e.target.value = padZero(e.target.value);
    } else {
        e.target.classList.remove('nonempty');
    }
});

minute.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && e.target.value.length === 0) {
        e.preventDefault();
        hour.focus();
        hour.value = hour.value.slice(0, -1);
    }
});

second.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && e.target.value.length === 0) {
        e.preventDefault();
        minute.focus();
        minute.value = minute.value.slice(0, -1);
    }
});

start.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace') {
        e.preventDefault();
        second.focus();
        second.value = second.value.slice(0, -1);
    }
});
