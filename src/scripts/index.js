"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// const test:HTMLElement = 
var valor;
(function (valor) {
    valor[valor["NOTA"] = 0] = "NOTA";
    valor[valor["PORCENTAJE"] = 1] = "PORCENTAJE";
})(valor || (valor = {}));
var numQuizzes = 1;
var table = document.getElementById('table');
var form = document.getElementById('form');
var bttnAdd = document.getElementById('agg');
var bttnDel = document.getElementById('elim');
var bttnSubmit = document.getElementById('calcular');
var messageBox = document.getElementById('mensaje');
var bttnClose = document.getElementById('close');
var loader = document.getElementById('loader');
bttnAdd.addEventListener('click', function () {
    var row = table.insertRow();
    row.innerHTML = "\n<tr id=\"".concat(numQuizzes++, "\">\n<th scope=\"row\">\n            <input type=\"number\" name=\"nota\" step=\"0.01\" min='0' placeholder=\"Nota que sacaste\" />\n        </th>\n        <th>\n            <input required type=\"number\" name=\"porcentaje\" step=\"0.01\" min='0' placeholder=\"Porcentaje de la evaluacion\" />\n        </th>\n</tr>");
});
bttnDel.addEventListener('click', function () {
    if (numQuizzes > 1) {
        table.deleteRow(numQuizzes);
        numQuizzes--;
    }
});
bttnClose.addEventListener('click', function () {
    messageBox.style.display = "none";
});
// Iniciar con un estado vacío
//stack.push({ index: 0, currentSum: 0, currentCombination: [] });
//
//while (stack.length > 0) {
//  const { index, currentSum, currentCombination } = stack.pop()!;
//
//  // Si alcanzamos el target, agregamos la combinación al resultado
//  if (currentSum === target) {
//    results.push(currentCombination);
//    continue;
//  }
//
//  // Si el índice supera los límites o la suma excede el target, continuamos
//  if (index >= arrays.length || currentSum > target) {
//    continue;
//  }
//
//  // Iteramos sobre los elementos del subarreglo actual
//  for (const num of arrays[index]) {
//    stack.push({
//      index: index + 1,
//      currentSum: currentSum + num,
//      currentCombination: [...currentCombination, num],
//    });
//  }
//
//  // También consideramos no tomar ningún elemento del subarreglo actual
//  stack.push({
//    index: index + 1,
//    currentSum,
//    currentCombination,
//  });
//}
function findCombinationsIterative(arrays, target) {
    var results = [];
    var exit = false;
    var positions = new Array(arrays.length - 1);
    for (var i = 0; i < positions.length; i++) {
        positions[i] = 0;
    }
    while (!exit) {
        console.log("Positions: ", positions);
        var currentArr = [];
        var sum = 0;
        for (var i = 0; i < positions.length; i++) {
            currentArr.push(arrays[i][positions[i]]);
            sum += currentArr[i];
        }
        for (var _i = 0, _a = arrays[arrays.length - 1]; _i < _a.length; _i++) {
            var nota = _a[_i];
            if (nota + sum >= target) {
                results.push(__spreadArray(__spreadArray([], currentArr, true), [nota], false));
            }
        }
        console.log("currentArr:", currentArr, "currentSum:", sum);
        currentArr = [];
        exit = positions.every(function (pos) { return pos === arrays[0].length - 1; });
        for (var i = positions.length - 1; i > -1; i--) {
            if (positions[i] === arrays[0].length - 1) {
                positions[i] = 0;
            }
            else {
                positions[i] = positions[i] + 1;
                break;
            }
        }
    }
    debugger;
    return results;
}
function getSum(arr, target, notaMax) {
    console.log(arr);
    debugger;
    var combinaciones = [];
    if (arr.length === 1) {
        for (var i = 0; i <= notaMax; i++) {
            var nota = i * arr[0] / 100;
            if (nota < target)
                continue;
            combinaciones.push([nota]);
        }
        return combinaciones;
    }
    for (var j = 0; j < arr.length; j++) {
        combinaciones.push([]);
        for (var i = 0; i <= notaMax; i++) {
            combinaciones[j].push(i !== 0 ? (i * arr[j]) / 100 : 0);
        }
    }
    console.log("combinaciones:", combinaciones);
    debugger;
    return findCombinationsIterative(combinaciones, target);
}
function canPass(quizzes, result) {
    var notaMax = parseFloat(document.getElementById('nota_maxima').value);
    var notaMin = parseFloat(document.getElementById('nota_min_aprobatoria').value);
    var porEvaluar = [];
    var porcentaje = 0;
    var acumulado = 0.00;
    var pasa = false;
    quizzes.forEach(function (quiz) {
        if (!isNaN(quiz[valor.NOTA])) {
            acumulado += quiz[valor.NOTA] * quiz[valor.PORCENTAJE] / 100;
            pasa = acumulado >= notaMin;
            if (pasa)
                return;
        }
        else {
            porcentaje += quiz[valor.PORCENTAJE];
            porEvaluar.push(quiz[valor.PORCENTAJE]);
        }
    });
    if (porcentaje) {
        var tempResult = getSum(porEvaluar, notaMin - acumulado, notaMax);
        result.push.apply(result, tempResult);
        pasa = result.length > 0;
    }
    return pasa;
}
function getQuizzes(quizzes) {
    var foo = table.getElementsByTagName('tbody').item(0).getElementsByTagName('tr');
    for (var i = 0; i < foo.length; i++) {
        var inputs = foo[i].getElementsByTagName('input');
        var nota = inputs[0] ? parseFloat(inputs[0].value) : Number.NaN;
        var porcentaje = inputs[1] ? parseFloat(inputs[1].value) : Number.NaN;
        quizzes.push([nota, porcentaje]);
    }
}
function decorateMessageBox(isError) {
    var h2 = messageBox.firstElementChild;
    var gif = document.getElementById('gif');
    gif.src = !isError ? "media/succes/succes-1.gif" : "media/fail/fail-1.gif";
    console.log(gif.src, gif);
    debugger;
    h2.innerHTML = !isError ? "Puedes pasar!" : "Lo siento...";
    messageBox.style.display = "flex";
}
form.addEventListener('submit', function (event) {
    event.preventDefault();
    loader.style.display = "flex";
    var quizzes = [];
    getQuizzes(quizzes);
    var result = [];
    var tableDiv = document.createElement('div');
    tableDiv.id = "canPassTables";
    var actual = document.getElementById('canPassTables');
    if (actual)
        document.body.removeChild(actual);
    loader.style.display = "none";
    decorateMessageBox(!canPass(quizzes, result));
    for (var j = 0; j < result.length; j++) {
        var item = 0;
        var newTable = table.cloneNode(true);
        newTable.classList.add('table');
        var newTbody = newTable.getElementsByTagName('tbody')[0];
        var newRows = newTbody.getElementsByTagName('tr');
        for (var i = 0; i < newRows.length; i++) {
            var inputs = newRows[i].getElementsByTagName('input');
            if (!inputs[0].value) {
                inputs[0].value = String(Math.ceil(result[j][item] * 100 / parseFloat(inputs[valor.PORCENTAJE].value)));
                item++;
            }
            for (var k = 0; k < inputs.length; k++) {
                inputs[k].disabled = true;
            }
        }
        tableDiv.appendChild(newTable);
    }
    document.body.appendChild(tableDiv);
});
