// Function to get the number of days in the current month.
function daysInMonth (month, year) {
	return new Date(year, month, 0).getDate();
}

let currentDay = new Date();
// console.log(currentDay);
let currentMonth = currentDay.getMonth() + 1;
// console.log(currentMonth);
let currentYear = currentDay.getFullYear();
// console.log(currentYear);

let daysOfCurrentMonth = daysInMonth(currentMonth, currentYear);
console.log(daysOfCurrentMonth);

let firstDayOfMonth = new Date(currentDay.getFullYear(), currentDay.getMonth(), 1);
let firstDayOfMonthWeek = firstDayOfMonth.getDay();
console.log(firstDayOfMonthWeek);
let lastDayOfMonth = new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 0);
let lastDayOfMonthWeek = lastDayOfMonth.getDay();
// console.log(lastDayOfMonth);


function setCurrentMonthAndYear () {
	const month = currentDay.toLocaleString("en-us", { month: "long" });
	document.getElementById("month").innerText = month;
	document.getElementById("year").innerText = currentYear;
}
setCurrentMonthAndYear();


function generateCalendarObj () {
	let calendar = [];
	const firstSlot = 0;
	let tempSlot = firstSlot;

	while (tempSlot < firstDayOfMonthWeek) {
		let slot = {
			slot: tempSlot
		};
		calendar.push(slot);
		tempSlot++;
	}

	for (let i = 1; i <= daysOfCurrentMonth; i++) {
		let slot = {
			slot: tempSlot,
			day: i
		};

		calendar.push(slot);
		tempSlot++;
	}

	while (calendar.length % 7 != 0) {
		let slot = {
			slot: tempSlot
		};
		calendar.push(slot);
		tempSlot++;
	}

	console.log(calendar);
	return calendar;
}

function generateCalendar () {
	let calendar = generateCalendarObj();

	let dayOfWeek = 0;
	let tableRow;
	for (let i = 0; i < calendar.length; i++) {
		if (dayOfWeek == 0) {
			tableRow = document.createElement("TR");
			document.getElementById("calendarTableBody").appendChild(tableRow);
		}

		let tableCell = document.createElement("TD");
		if (calendar[i].day) {
			let textnode = document.createTextNode(calendar[i].day);
			tableCell.appendChild(textnode);
		} else {
			tableCell.classList.add("empty-slot");
		}
		tableRow.appendChild(tableCell);

		dayOfWeek = (dayOfWeek == 6) ? 0 : dayOfWeek + 1;


		// let calendarSlot = document.createElement("LI");
		// if (calendar[i].day) {
		// 	let textnode = document.createTextNode(calendar[i].day);
		// 	calendarSlot.appendChild(textnode);
		// }
		// document.getElementById("days").appendChild(calendarSlot);
	}
}

generateCalendar();