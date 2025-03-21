// const test:HTMLElement = 
enum valor {
  NOTA,
  PORCENTAJE
}
let numQuizzes: number = 1;
let table = document.getElementById('table') as HTMLTableElement;

const bttnAdd = document.getElementById('agg') as HTMLButtonElement;
const bttnDel = document.getElementById('elim') as HTMLButtonElement;
const bttnSubmit = document.getElementById('calcular') as HTMLButtonElement;
const html = document.getElementById('html') as HTMLHtmlElement;
const messageBox = document.getElementById('mensaje') as HTMLTableSectionElement;
const bttnClose = document.getElementById('close') as HTMLButtonElement;


bttnAdd.addEventListener('click', () => {
  const row = table.insertRow();
  row.innerHTML = `
<tr id="${numQuizzes++}">
<th scope="row">
            <input type="number" name="nota" step="0.01" placeholder="Nota que sacaste"/>
        </th>
        <th>
            <input required type="number" name="porcentaje" step="0.01" placeholder="Porcentaje de la evaluacion"/>
        </th>
</tr>`;
});

bttnDel.addEventListener('click', () => {
  if (numQuizzes > 0) {
    table.deleteRow(numQuizzes);
    numQuizzes--;
  }
});

bttnClose.addEventListener('click', () => {
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
function findCombinationsIterative(arrays: number[][], target: number): number[][] {
  const results: number[][] = [];
  let exit = false;

  const positions: number[] = new Array(arrays.length - 1);
  for (let i = 0; i < positions.length; i++) {
    positions[i] = 0;
  }
  while (!exit) {

    console.log("Positions: ", positions);
    let currentArr: number[] = [];
    let sum = 0;
    for (let i = 0; i < positions.length; i++) {
      currentArr.push(arrays[i][positions[i]]);
      sum += currentArr[i];
    }
    for (const nota of arrays[arrays.length - 1]) {
      if (nota + sum >= target) {
        results.push([...currentArr, nota]);
      }
    }
    console.log("currentArr:", currentArr, "currentSum:", sum);
    currentArr = [];
    exit = positions.every(pos => pos === arrays[0].length - 1);

    for (let i = positions.length - 1; i > -1; i--) {

      if (positions[i] === arrays[0].length - 1) {
        positions[i] = 0;
      } else {
        positions[i] = positions[i] + 1;
        break;
      }

    }

  }

  debugger;
  return results;
}
function getSum(arr: Array<number>, target: number, notaMax: number): number[][] {
  console.log(arr);
  debugger;
  let combinaciones: Array<Array<number>> = [];
  if (arr.length === 1) {
    for (let i = 0; i <= notaMax; i++) {
      const nota = i * arr[0] / 100;
      if (nota < target)
        continue;
      combinaciones.push([nota]);
    }
    return combinaciones;
  }
  for (let j = 0; j < arr.length; j++) {
    combinaciones.push([]);
    for (let i = 0; i <= notaMax; i++) {
      combinaciones[j].push(i !== 0 ? (i * arr[j]) / 100 : 0);
    }
  }
  console.log("combinaciones:", combinaciones);
  debugger;
  return findCombinationsIterative(combinaciones, target);
}


function canPass(quizzes: Array<Array<number>>, result: number[][]): Boolean {

  const notaMax = parseFloat((document.getElementById('nota_maxima') as HTMLInputElement).value);
  const notaMin = parseFloat((document.getElementById('nota_min_aprobatoria') as HTMLInputElement).value);
  const porEvaluar: Array<number> = [];
  let porcentaje: number = 0;
  let acumulado: number = 0.00;
  let pasa: Boolean = false;
  quizzes.forEach((quiz) => {
    if (!isNaN(quiz[valor.NOTA])) {
      acumulado += quiz[valor.NOTA] * quiz[valor.PORCENTAJE] / 100;
      pasa = acumulado >= notaMin;
      if (pasa)
        return
    } else {
      porcentaje += quiz[valor.PORCENTAJE];
      porEvaluar.push(quiz[valor.PORCENTAJE]);
    }
  })
  if (porcentaje) {
    const tempResult = getSum(porEvaluar, notaMin - acumulado, notaMax);
    result.push(...tempResult);
    pasa = result.length > 0;

  }
  return pasa;
}


function getQuizzes(quizzes: Array<Array<number>>) {
  const foo = (table.getElementsByTagName('tbody').item(0) as HTMLTableSectionElement).getElementsByTagName('tr');
  for (let i = 0; i < foo.length; i++) {
    const inputs = foo[i].getElementsByTagName('input');
    const nota = inputs[0] ? parseFloat(inputs[0].value) : Number.NaN;
    const porcentaje = inputs[1] ? parseFloat(inputs[1].value) : Number.NaN;
    quizzes.push([nota, porcentaje]);
  }
}

bttnSubmit.addEventListener('click', () => {
  const tableDiv = document.createElement('div');
  tableDiv.id = "canPassTables";
  const actual = document.getElementById('canPassTables') as HTMLDivElement | null;
  if (actual)
    document.body.removeChild(actual);


  let quizzes: Array<Array<number>> = [];
  getQuizzes(quizzes);

  let result: number[][] = [];
  let h2 = messageBox.firstElementChild as HTMLHeadingElement;
  h2.innerHTML = canPass(quizzes, result) ? "Puedes pasar!" : "Lo siento...";
  messageBox.style.display = "flex";
  console.log(result);
  debugger;


  for (let j = 0; j < result.length; j++) {
    let item = 0;
    const newTable = table.cloneNode(true) as HTMLTableElement;
    newTable.classList.add('table');
    const newTbody = newTable.getElementsByTagName('tbody')[0];
    const newRows = newTbody.getElementsByTagName('tr');

    for (let i = 0; i < newRows.length; i++) {
      const inputs = newRows[i].getElementsByTagName('input');

      if (!inputs[0].value) {
        inputs[0].value = String(Math.ceil(result[j][item] * 100 / parseFloat(inputs[valor.PORCENTAJE].value)));
        item++;
      }
      for (let k = 0; k < inputs.length; k++) {
        inputs[k].disabled = true;
      }

    }
    tableDiv.appendChild(newTable);
  }
  document.body.appendChild(tableDiv);
});
