hideBoth();

function hideBoth() {
    document.getElementById("outputButton").style.visibility = "hidden";
}
var A = [];    //New Array (input)
var std = 0;    //number of students
var NArray = [];   //new array as an output array

function generateList() {
    inputDisplay();
    seatingArrangement();
    document.getElementById("outputButton").style.visibility = "visible";
}

class Student {      //A class of student
    constructor(rolno, sec, room, seat) {
        this.RollNo = rolno;
        this.Section = sec;
        this.Room = room;
        this.Seat = seat;
    }
    Data() {
        return " RollNo: " + this.RollNo + " Section: " + this.Section;
    }
}

//rading data from file
function handleFiles(files) {
    // Check for the various File API support.
    if (window.FileReader) {
        // FileReader are supported.
        getAsText(files[0]);
    } else {
        alert('FileReader are not supported in this browser.');
    }
    document.getElementById("generate").style.visibility = "visible";
}

function getAsText(fileToRead) {
    var reader = new FileReader();
    // Handle errors load
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
    // Read file into memory as UTF-8      
    reader.readAsText(fileToRead);
}

function loadHandler(event) {
    var csv = event.target.result;
    processData(csv);
}


function findIn(A, a) { //funciton to find an element in an array
    for (var f = 0; f < A.length; f++) {
        if (a == A[f][0].Section)
            return f;
    }
    return false;
}
function processData(csv) { //main process of file reading
    var allTextLines = csv.split(/\r\n|\n/);
    // console.log("Number of line: " + allTextLines[0] + allTextLines.length);
    var i = -1;
    var tmp = "", d = 0;
    while (allTextLines.length - 1) {
        stdOb = new Student();
        // console.log("Array: " + A[i] + " i: " + i);
        tmp = allTextLines.shift().split(',');
        stdOb.RollNo = tmp[0], stdOb.Section = tmp[1];
        // console.log("tmp1: " + tmp[1]);
        if ((d = findIn(A, tmp[1])) !== false) {    //it will also work good for if sections are not in sequence-wise
            A[d].push(stdOb);
            continue;
        }
        else {
            i++;
            A[i] = [];
        }
        A[i].push(stdOb);
    }
}

function errorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
        alert("Can't read file !");
    }
}


function DisplayArray2(A) { //function to display the input 2d-array
    str = "";
    for (var i = 0; i < A.length; i++) {
        for (var j = 0; j < A[i].length; j++) {
            str += A[i][j].RollNo + " - ";
        }
    }
    return str;
}

function inputDisplay() {
    //Displaying the Array and their elements
    document.getElementById("inputDisplay").innerHTML = "Number of Sections: " + A.length;
    var table = document.createElement("table");
    for (var s = 0; s < A.length; s++) {
        std += A[s].length;
        var row = table.insertRow(-1);
        var cell = row.insertCell(-1);
        cell.appendChild(document.createTextNode("Students of section " + A[s][0].Section + " = " + A[s].length));
    }
    var row = table.insertRow(-1);
    var cell = row.insertCell(-1);
    cell.appendChild(document.createTextNode("Total Number of studetns: " + std));
    document.getElementById("inputDisplay").appendChild(table);
}

function seatingArrangement() {
    var leng = len = A.length;  //copying the length of array: number of sections
    var fin = true;
    var finish = 0; //if 1 then allot them as it is, if 2 allot them with spaces
    for (var i = 1; i <= 10; i++) { //to store nothing in i-10 and i-1 indices
        NArray[-i] = new Student("", "");
    }
    var i = 0;                  //variable to count the number of values pushed into new array
    var room = 1, seat = 1;
    while (leng > 0) {
        flag = false;
        //popping from input array and pushing in output array according to the condition
        for (var j = 0; j < len; j++) {
            if (A[j].length > 0 //length must me greater than 0
                && (A[j][0].Section) !== (NArray[i - 10].Section) //comparing row-wise(left-right)
                && (((NArray[i - 1].Section) !== (A[j][0].Section)) //comparing front-back
                    || i % 10 == 0)) //except if one is at last and next one is to start of the next colum   //except
            {
                NArray.push(A[j].shift());
                NArray[i].Room = room;
                NArray[i].Seat = seat;
                i++;    //number of values pushed into new array
                if (i % 50 == 0) {
                    room++;
                    seat = 1;
                }
                else {
                    seat++;
                }
                flag = true;    //flag will remain false if nothing is pushed into new array
            }
        }
        //calculating total length after every main iteration: after taking from each of the sub array element.
        var count = 0;
        for (a = 0; a < len; a++) {
            if (A[a].length == 0) continue;
            count++;
        }
        leng = count;//updating the new length of array: number of sections left

        if (flag == false) {
            //ask to the user how to allot the seats
            console.log("flag is false");
            if (fin == true) {
                finish = window.prompt("Last " + (std - i) + " students are overlapping..!" +
                    "\nEnter number \n1(As it is) 0r 2(with Spaces): ");  //if 1 then allot them as it is, if 2 allot them with spaces
                fin = false;
            }

            if (finish == 1) {
                while (i < std) {
                    for (r = 0; r < len; r++) {
                        console.log("i: " + i + "and r:" + r + " std: " + std + " len: " + len);
                        if (A[r].length > 0) {
                            console.log("this: " + A[r][0].Section);
                            NArray.push(A[r].shift());
                            NArray[i].Room = room;
                            NArray[i].Seat = seat;
                            i++;    //number of values pushed into new array
                            if (i % 50 == 0) {
                                room++;
                                seat = 1;
                            }
                            else {
                                seat++;
                            }
                            //to make the r in the same section when student is at the last of the column
                            if (i % 10 == 0) r--;   //students of same section on in last of the column and next at the front of next column
                        }
                    }
                }
            }
            else if (finish == 2) {
                flag = true;
                stOb = new Student("SPACE", "");
                NArray.push(stOb);   //X is Supposed to be space
                NArray[i].Room = room;
                NArray[i].Seat = seat;
                i++;    //number of values pushed into new array
                if (i % 50 == 0) {
                    room++;
                    seat = 1;
                }
                else {
                    seat++;
                }
            }
        }
    }//ends the main while (outer) loop
    //Displaying the results
    document.getElementById("outputDisplay").innerHTML = "Number of seats allocated: " + i + "<br>";
}

function roomWise() {
    var tabel = document.getElementById("outputTable");
    // var i = 0, ArrLen = NArray.length;
    var j = 0;
    for (var room = 0; room < Math.ceil(NArray.length / 50); room++) {
        var row = tabel.insertRow();
        var cell = row.insertCell();
        cell.innerHTML = "Room#" + (room + 1) + ": ";
        var row = tabel.insertRow();
        for (var colmn = 1; colmn <= 5; colmn++) {
            var cell = row.insertCell();
            cell.innerHTML = "Column#" + colmn + ": ";
        }
        var row = tabel.insertRow();
        for (var head = 0; head < 5; head++) {
            var cell = row.insertCell();
            cell.innerHTML = "|Registration# | Section | Seat|";
        }
        var rooms = [];
        for (var r = 0; r < 10; r++) {  //created a list of 10 rows(for 10 seats in each column)
            rooms[r] = tabel.insertRow();
        }
        for (var c = 0; c < 10 && j < NArray.length; c++) {
            var cell = rooms[c].insertCell();
            cell.innerHTML = NArray[j].RollNo + "__|__" + NArray[j].Section + "__|__" + NArray[j].Seat;
            if (c == 9) //to go to the first row to add next cell
                c = -1;
            j++;
            if (j % 50 == 0) break;
        }
    }
}


//to download file -----------------------------------------------------------------
function exportTableToCSV(filename) {
    var csv = [];
    var rows = document.getElementById("outputTable").querySelectorAll("table tr");
    // var rows = document.querySelectorAll("table tr");

    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");

        for (var j = 0; j < cols.length; j++)
            row.push(cols[j].innerText);

        csv.push(row.join(","));
    }

    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
}

function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV file
    csvFile = new Blob([csv], { type: "text/csv" });

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();
}
//downloading file ends-------------------------------------------------------------------------------
