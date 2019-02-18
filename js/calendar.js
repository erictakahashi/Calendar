// Date Utilities
const currentDay 			= new Date(); // Format: "Mon Feb 18 2019 15:44:31 GMT-0300"
const currentMonth 			= currentDay.getMonth() + 1; // Number Format: 2
const currentMonthString 	= currentDay.toLocaleString("en-us", { month: "long" }); // String Format: "February"
const currentYear 			= currentDay.getFullYear(); // Number Format: 2019
const daysOfCurrentMonth 	= new Date(currentYear, currentMonth, 0).getDate(); // Number Format: 28

let firstDayOfCurrentMonth = new Date(currentDay.getFullYear(), currentDay.getMonth(), 1); // Format: "Fri Feb 01 2019 00:00:00 GMT-0200"
let firstWeekDayOfCurrentMonth = firstDayOfCurrentMonth.getDay(); // Number Format: 5 (weekday from 0 to 6)

let lastDayOfCurrentMonth = new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 0); // Format: "Thu Feb 28 2019 00:00:00 GMT-0300"
let lastWeekDayOfCurrentMonth = lastDayOfCurrentMonth.getDay(); // Number Format: 4 (weekday from 0 to 6)


// Set the current month and year in the calendar header
function setCurrentMonthAndYear () {
	document.getElementById("month").innerText = currentMonthString;
	document.getElementById("year").innerText = currentYear;
}
setCurrentMonthAndYear();


// Generates and returns the calendar array with empty slots and the days
// Empty slots are required to append the days in the right week day column in the calendar table.
function generateCalendarArray () {
	let calendar = [];
	const firstSlot = 0;
	let tempSlot = firstSlot;

	// While tempSlot is less than firstWeekDayOfCurrentMonth, push empty slots to the calendar array
	while (tempSlot < firstWeekDayOfCurrentMonth) {
		let slot = {
			slot: tempSlot
		};
		calendar.push(slot);
		tempSlot++;
	}
	// Append the days of the month in the calendar array
	for (let i = 1; i <= daysOfCurrentMonth; i++) {
		let slot = {
			slot: tempSlot,
			day: i
		};
		calendar.push(slot);
		tempSlot++;
	}
	// Append the remaining empty slots to complete a week
	while (calendar.length % 7 != 0) {
		let slot = {
			slot: tempSlot
		};
		calendar.push(slot);
		tempSlot++;
	}

	return calendar;
}

// Generates the calendar in the front end by appending the days cells in the calendar
function generateCalendar () {
	let calendar = generateCalendarArray();

	let weekDay = 0;
	let tableRow;
	for (let i = 0; i < calendar.length; i++) {
		// Create the "table row" element
		if (weekDay == 0) {
			tableRow = document.createElement("TR");
			document.getElementById("calendarTableBody").appendChild(tableRow);
		}
		// Append the "table cell" 
		let tableCell = document.createElement("TD");
		if (calendar[i].day) {
			let textnode = document.createTextNode(calendar[i].day);
			tableCell.appendChild(textnode);
		} else {
			tableCell.classList.add("empty-slot");
		}
		tableRow.appendChild(tableCell);

		// Determine the current week day
		weekDay = (weekDay == 6) ? 0 : weekDay + 1;
	}
}
generateCalendar();