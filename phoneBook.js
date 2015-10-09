'use strict';

var phoneBook = []; //list of dictionary

/*
   Функция добавления записи в телефонную книгу.
   На вход может прийти что угодно, будьте осторожны.
*/
module.exports.add = function add(name, phone, email) {
    if (!(isCorrectPhone(phone) && isCorrectEmail(email))) {
        return false;
    }
    phone = getClearPhone(phone);
    var user = {
        name: name,
        phone: phone,
        email: email
    };
    phoneBook.push(user);
    return true;
};

function getClearPhone(phone) {
    var re = /\d+/g;
    return phone.match(re).join('');
}

function isCorrectPhone(phone) {
    var bracketRe = /^\+?\d{1,2}\s*\(\d{3}\)\s*\d{3}(\s*|\-?)\d(\s*|\-?)\d{3}$/;
    var re = /^(\+?\d{1,2})?\s*\d{3}\s*\d{3}(\s*|\-?)\d(\s*|\-?)\d{3}$/;
    return re.test(phone) || bracketRe.test(phone);
}

function isCorrectEmail(email) {
    var re = /^\w+[@]{1}[-(\w|а-я|А-Я)]+[\.\w|а-я|А-Я]+$/i;
    return re.test(email);
}

/*
   Функция поиска записи в телефонную книгу.
   Поиск ведется по всем полям.
*/
module.exports.find = function find(query) {
    query = query ? query : '';
    var foundResults = findUserAndIndex(query);
    foundResults.forEach(function(userAndIndex, count, foundResults) {
        var user = userAndIndex[0];
        console.log(user.name + ', ' + getPhoneToShow(user.phone) + ', ' + user.email);
    });
};

function findUserAndIndex(query) {
    var foundResults = [];
    phoneBook.forEach(function(user, count, phoneBook) {
        var indexName = user.name.toLowerCase().indexOf(query.toLowerCase());
        var indexPhone = user.phone.indexOf(query);
        var indexEmail = user.email.toLowerCase().indexOf(query.toLowerCase());
        if (!query || indexName != -1 || indexPhone != -1 || indexEmail != -1)
            foundResults.push([user, count]);
    });
    return foundResults;
}

function getPhoneToShow(phone) {
    var newPhone = '';
    var phoneLen = phone.length;
    for (var i = phoneLen - 1; i >= 0; i--) {
        newPhone += phone[i];
        switch(i) {
            case phoneLen - 3:
            case phoneLen - 4:
                newPhone += '-';
                break;
            case phoneLen - 7:
                newPhone += ' )';
                break;
            case phoneLen - 10:
                newPhone += '( ';
                break;
        }
    };
    if (phoneLen == 10) {
        newPhone += '7';
    };
    newPhone += '+';
    return newPhone.split("").reverse().join("");
}

/*
   Функция удаления записи в телефонной книге.
*/
module.exports.remove = function remove(query) {
    query = query ? query : '';
    var foundResults = findUserAndIndex(query);
    foundResults.forEach(function(userAndIndex, count, foundResults) {
        phoneBook.splice(userAndIndex[1], 1);
    });
    console.log('Удалено ' + foundResults.length + ' объект(а/ов)');
};

/*
   Функция импорта записей из файла (задача со звёздочкой!).
*/
module.exports.export = function importFromCsv(filename) {
    var data = require('fs').readFileSync(filename, 'utf-8');
    var lines = data.split('\n');
    var countOfUsers = 0;
    lines.forEach(function(line, count, lines) {
        var user = line.split(';');
        var isRightData = module.exports.add(user[0], user[1], user[2]);
        if (isRightData) {
            countOfUsers++;
        }
    });
    console.log('Добавлено записей: ' + countOfUsers);
};

/*
   Функция вывода всех телефонов в виде ASCII (задача со звёздочкой!).
*/
module.exports.showTable = function showTable() {
    var output = [];
    var len = 25;
    output.push(getOutputString('Имя', len) + 
            getOutputString('Телефон', len) +
            getOutputString('E-mail', len) + '│');
    phoneBook.forEach(function(user, count, phoneBook) {
        output.push(getOutputString(user.name, len) + 
            getOutputString(getPhoneToShow(user.phone), len) +
            getOutputString(user.email, len) + '│');
    });
    var outputLen = output.length;
    for (var i = 1; i < outputLen * 2 + 2; i++) {
        if (i == 1 || i == 3 || i == outputLen * 2 + 1) {
            console.log(getLines(i, len));
        }
        else if (i % 2 == 0) {
            console.log(output[i / 2 - 1]);
        }
    };
    
};

function getOutputString(str, len) {
    var space = '';
    for (var i = 0; i < len - str.length - 1; i++) {
            space += ' ';
    }
    return '│ ' + str + space;
}

function getLines(number, len) {
    var line = '';
    switch (number) {
        case 1:
            line += getLine(line, '┌', '┬', '┐', len);
            break;
        case 3:
            line += getLine(line, '├', '┼', '┤', len);
            break;
        default:
            line += getLine(line, '└', '┴', '┘', len);
            break;
    }
    return line;
}

function getLine(line, first, middle, last, len) {
    line += first;
    for (var k = 0; k < 3; k++) {
        for (var j = 0; j < len; j++) {
             line += '─';
        }
        if (k != 2) {
            line += middle;
        }
    }
    line += last;
    return line;
}