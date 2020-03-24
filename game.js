window.onload = function () {

    let gameNode = document.querySelector('#theGame');

    // set the title
    document.title = "3-In-A-Row";
    let h1 = document.createElement('h1');
    h1.innerText = document.title;
    document.body.insertBefore(h1, gameNode);

    let colors = ['#f7f7f7', '#f1b6da', '#b8e186']; // state 0: light grey, state 1: pink, state 2: lime
    let state = 0;
    let states = [];

    let setBgColor = (color) => {
        let index = colors.indexOf(color);
        index = index === 2 ? 0 : index + 1;
        state = index;  // set state
        return colors[index];
    };

    // rgb to hex converter
    // src: http://wowmotty.blogspot.com/2009/06/convert-jquery-rgb-output-to-hex-color.html
    let rgbToHex = (color) => {
        var rgb = color.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
        return (rgb && rgb.length === 4) ? "#" +
            ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : orig;
    };

    let table = document.createElement('table');
    let innerDiv = document.createElement('div');
    // append table to inner div
    innerDiv.appendChild(table);

    let result = document.createElement('p');
    result.innerHTML = " ";
    // append result text to inner div
    innerDiv.appendChild(result);

    let button = document.createElement('button');
    button.innerHTML = "Check";

    let checking = document.createElement('div');
    checking.setAttribute("id", "errorCheck");

    let checkbox = document.createElement('input');
    checkbox.setAttribute("type", "checkbox");
    checking.appendChild(checkbox);

    let span = document.createElement('span');
    span.innerHTML = "Show mistakes when checking";
    checking.appendChild(span);

    innerDiv.appendChild(button);
    innerDiv.appendChild(checking);

    // append inner div to #theGame
    gameNode.appendChild(innerDiv);

    // req-006 add innovative feature
    let setState = () => {
        // show row states
        let row_ctr = states.map((row) => {
            let state1 = row.reduce((total, col) => {
                if (col === 1) {
                    total++;
                }
                return total;
            }, 0);
            // this.console.log(state1);

            let state2 = row.reduce((total, col) => {
                if (col === 2) {
                    total++;
                }
                return total;
            }, 0);
            return state1 + "/" + state2;
        });

        for (let i = 0; i < row_ctr.length; i++) {
            table.rows[i + 1].cells[6].innerHTML = row_ctr[i];
        }

        // show column states
        let col_ctr = [];
        for (let i in states) {
            let state1 = states.reduce((total, row) => {
                if (row[i] === 1) {
                    total++;
                }
                return total;
            }, 0);

            let state2 = states.reduce((total, row) => {
                if (row[i] === 2) {
                    total++;
                }
                return total;
            }, 0);

            col_ctr.push(state1 + "/" + state2);
        }

        for (let i = 0; i < col_ctr.length; i++) {
            table.rows[0].cells[i].innerHTML = col_ctr[i];
        }
    };

    // finds 3-in-a-row
    let find3InARow = () => {
        for (let i in states) {
            for (let j in states[i]) {
                if (states[i][j] !== 0) {
                    if (j != 0 && (states[i][j - 1] === states[i][j] && states[i][j] === states[i][j + 1])) {
                        console.log(states[i][j - 1] + " <-> " + states[i][j] + " <-> " + states[i][j + 1]);
                        return true;
                    }
                }
            }
        }
        return false;
    };


    // req-001 retrieval of the json starting data for the puzzle
    let fetchData = async () => {
        fetch('https://www.mikecaines.com/3inarow/sample.json')
            .then((response) => response.json())
            .then((myJson) => {

                let puzzle = myJson.rows;
                let x = 0, y = 0;

                // req-002 drawing and displaying of 3-in-a-row table with js 
                for (let i = 0; i < 7; i++) {
                    let tr = document.createElement('tr');
                    let temp = [];

                    for (let j = 0; j < 7; j++) {
                        // create cell
                        let td = document.createElement('td');
                        x = i - 1;
                        y = j;

                        if (i === 0 || j === 6) {
                            td.innerHTML = (i === 0 && j === 6) ? "" : "1/1";
                            td.className = "counter";
                        }
                        else {
                            if (j < 6) {
                                // set initial state
                                td.style.backgroundColor = colors[puzzle[x][y].currentState];
                                temp.push(puzzle[x][y].currentState);
                            }

                        }

                        // add to row
                        tr.appendChild(td);
                        // req-003 changing of square colors with mouse clicks
                        td.onclick = function () {
                            x = i - 1;
                            y = j;

                            if (j < 6) {
                                if (puzzle[x][y].canToggle) {
                                    let prop = window.getComputedStyle(td, null).getPropertyValue('background-color');
                                    td.style.backgroundColor = setBgColor(rgbToHex(prop));
                                    states[x][y] = state;
                                    setState();
                                    td.innerHTML = "";
                                    td.style.borderColor = "#f7f7f7";
                                }
                            }
                        };
                    }

                    if (temp.length > 0) {
                        states.push(temp);
                    }

                    // append row to table
                    table.appendChild(tr);
                }
                setState();

                // req-004 3-in-a-row puzzle status checking
                button.onclick = function () {
                    // are we done?
                    let done = states.every((row) => row.every((col) => col !== 0));
                    let isChecked = checkbox.checked;
                    let foundX = false;

                    if (find3InARow()) { alert("You have a 3-in-a-row!"); }

                    for (let i = 0; i < table.rows.length; i++) {

                        for (let j = 0; j < table.rows[i].cells.length; j++) {
                            // get correct state
                            x = i - 1;
                            y = j;

                            if (i === 0 || j === 6) {
                                continue;
                            }
                            if (j < 6) {
                                let corr = puzzle[x][y].correctState;
                                let curr = states[x][y];
                                let td = table.rows[i].cells[j];

                                td.innerHTML = "";
                                td.style.borderColor = "#f7f7f7";

                                if (puzzle[x][y].canToggle) {
                                    if (curr !== corr && curr !== 0) {
                                        result.innerHTML = "Something is wrong";
                                        result.className = "wrong";
                                        foundX = true;

                                        // req-005 error display checkbox
                                        if (isChecked) {
                                            td.innerHTML = "x";
                                            td.className = "error";
                                            td.style.borderColor = "red";
                                        }
                                    }
                                    else if (curr === corr && !foundX) {

                                        if (done) {
                                            result.innerHTML = "You did it!";
                                            result.className = "done";
                                        }
                                        else {
                                            result.innerHTML = "So far so good!";
                                            result.className = "correct";
                                        }
                                    }
                                }
                            }   //  if (puzzle[i][j].canToggle)
                        }   // for (let j = 0...
                    }   // for (let i = 0...
                };  // button.onclick

            });
    };
    fetchData();


}