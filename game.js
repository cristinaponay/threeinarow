window.onload = function () {

    let gameNode = document.querySelector('#theGame');

    // set the title
    document.title = "3-In-A-Row";
    let h1 = document.createElement('h1');
    h1.innerText = document.title;
    document.body.insertBefore(h1, gameNode);

    let colors = ['#f7f7f7', '#f1b6da', '#b8e186']; // state 0: light grey, state 1: pink, state 2: lime
    let images = ["", "url('egg1.png')", "url('egg3.png')"];
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
    // append table to theGame
    theGame.appendChild(table);

    let objective = document.createElement('p');
    objective.innerHTML = "<strong>Game Objective</strong>: Fill the grid with equal number of pink and green \
    squares on each row and column. A 3-in-a-row of the same color is not allowed.";
    // append instructions text to theGame
    theGame.appendChild(objective);

    let result = document.createElement('p');
    result.innerHTML = "Good luck!";
    // append result text to theGame
    theGame.appendChild(result);

    let button = document.createElement('button');
    button.innerHTML = "Check";

    let button2 = document.createElement('button');
    button2.innerHTML = "Reset";

    let btnGroup = document.createElement('div');
    btnGroup.className = "buttons";

    btnGroup.appendChild(button);
    btnGroup.appendChild(button2);

    let errorCheckGroup = document.createElement('div');
    errorCheckGroup.setAttribute("id", "errorCheck");

    let checkbox = document.createElement('input');
    checkbox.setAttribute("type", "checkbox");
    errorCheckGroup.appendChild(checkbox);

    let span = document.createElement('span');
    span.innerHTML = "Show mistakes when checking";
    errorCheckGroup.appendChild(span);

    // Easter special
    let easter = document.createElement('input');
    easter.setAttribute("type", "checkbox");
    errorCheckGroup.appendChild(easter);

    let span2 = document.createElement('span');
    span2.innerHTML = "<strong>Easter special!</strong>";
    errorCheckGroup.appendChild(span2);

    // append inner divs to theGame
    theGame.appendChild(btnGroup);
    theGame.appendChild(errorCheckGroup);


    // req-006 add innovative feature
    // sets the numbers of pink and green boxes
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
            table.rows[i + 1].cells[row_ctr.length].innerHTML = row_ctr[i];
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

    // finds 3-in-a-row or 3-in-a-column
    let find3InARow = () => {
        for (let i = 0; i < states.length; i++) {
            for (let j = 0; j < states[i].length; j++) {
                if (states[i][j] !== 0) {
                    if (j !== 0 && (states[i][j - 1] === states[i][j] && states[i][j] === states[i][j + 1])) {
                        console.log(states[i][j - 1] + " <-> " + states[i][j] + " <-> " + states[i][j + 1]);
                        return true;
                    }
                    if (i !== 0 && (i + 1) < states.length && (states[i - 1][j] === states[i][j] && states[i][j] === states[i + 1][j])) {
                        console.log(states[i - 1][j] + " <-> " + states[i][j] + " <-> " + states[i + 1][j]);
                        return true;
                    }
                }
            }
        }
        return false;
    };

    button2.onclick = () => {
        this.location.reload();
    };

    let fetchURL = 'https://www.mikecaines.com/3inarow/8x8a.php';
    // let fetchURL = 'https://www.mikecaines.com/3inarow/sample.json';
    // req-001 retrieval of the json starting data for the puzzle
    let fetchData = async () => {
        fetch(fetchURL)
            .then((response) => response.json())
            .then((myJson) => {

                let puzzle = myJson.rows;
                let x = 0, y = 0;
                let len = puzzle.length;
                
                // req-002 drawing and displaying of 3-in-a-row table with js 
                for (let i = 0; i <= len; i++) {
                    let tr = document.createElement('tr');
                    let temp = [];
                    
                    for (let j = 0; j <= len; j++) {
                        // create cell
                        let td = document.createElement('td');
                        x = i - 1;
                        y = j;

                        if (i === 0 || j === len) {
                            td.innerHTML = (i === 0 && j === len) ? "" : "1/1";
                            td.className = "counter";
                        }
                        else {
                            if (j < len) {
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

                            if (j < len) {
                                if (puzzle[x][y].canToggle) {
                                    let prop = window.getComputedStyle(td, null).getPropertyValue('background-color');
                                    td.style.backgroundColor = setBgColor(rgbToHex(prop));
                                    if(easter.checked) { // Easter special
                                        td.style.backgroundImage = images[state];
                                        td.style.backgroundSize = "contain";
                                    }
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

                // Easter special!
                easter.onchange = () => {
                    for (let i = 0; i < table.rows.length; i++) {
                        for (let j = 0; j < table.rows[i].cells.length; j++) {
                            // get correct state
                            x = i - 1;
                            y = j;
                            if (i === 0 || j === len) {
                                continue;
                            }
                            if (j < len) {
                                let corr = puzzle[x][y].correctState;
                                let curr = states[x][y];
                                let td = table.rows[i].cells[j];

                                if (!easter.checked) {
                                    td.style.backgroundImage = "";
                                }
                                else {
                                    td.style.backgroundImage = images[curr];
                                    td.style.backgroundSize = "contain";
                                }
                            }
                        }
                    }
                };

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

                            if (i === 0 || j === len) {
                                continue;
                            }
                            if (j < len) {
                                let corr = puzzle[x][y].correctState;
                                let curr = states[x][y];
                                let td = table.rows[i].cells[j];

                                td.innerHTML = "";
                                td.style.borderColor = "#f7f7f7";
                                if (easter.checked) {
                                    td.style.backgroundImage = images[curr];
                                }

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
                                            if (easter.checked) {
                                                td.innerHTML = "";
                                                td.style.backgroundImage = "url('bunny.png')";
                                            }
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