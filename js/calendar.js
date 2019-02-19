// Date Utilities
const currentDay 			= new Date(); // Format: "Mon Feb 18 2019 15:44:31 GMT-0300"
	currentDay.setHours(0, 0, 0, 0); // Set hours of current day to zero
const currentMonth 			= currentDay.getMonth(); // Number Format: 2
const currentMonthString 	= currentDay.toLocaleString("en-us", { month: "long" }); // String Format: "February"
const currentYear 			= currentDay.getFullYear(); // Number Format: 2019
const daysOfCurrentMonth 	= new Date(currentYear, (currentMonth + 1), 0).getDate(); // Number Format: 28

let firstDayOfCurrentMonth = new Date(currentDay.getFullYear(), currentDay.getMonth(), 1); // Format: "Fri Feb 01 2019 00:00:00 GMT-0200"
let firstWeekDayOfCurrentMonth = firstDayOfCurrentMonth.getDay(); // Number Format: 5 (weekday from 0 to 6)

let lastDayOfCurrentMonth = new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 0); // Format: "Thu Feb 28 2019 00:00:00 GMT-0300"
let lastWeekDayOfCurrentMonth = lastDayOfCurrentMonth.getDay(); // Number Format: 4 (weekday from 0 to 6)

// Hold the current appointment
let currentAppointment = {};


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
			let dayNode = document.createElement("DIV");
			dayNode.innerText = calendar[i].day;
			dayNode.classList.add("day-label");
			tableCell.appendChild(dayNode);

			// Check if there's an existing appointment and append it in the calendar
			let existingAppointment = dayExistingAppointment(calendar[i].day);
			if (existingAppointment) {
				let appointmentNode = document.createElement("DIV");
				appointmentNode.innerText = existingAppointment.title;
				appointmentNode.classList.add("appointment");
				tableCell.appendChild(appointmentNode);
			}

			let dayDate = new Date(currentYear, currentMonth, calendar[i].day);
			if (dayDate < currentDay) {
				tableCell.classList.add("not-selectable");
			} else {
				tableCell.setAttribute("data-day", calendar[i].day);
				tableCell.addEventListener('click', addOrEditAppointment);
			}
		} else {
			tableCell.classList.add("not-selectable");
		}
		tableRow.appendChild(tableCell);

		// Determine the current week day
		weekDay = (weekDay == 6) ? 0 : weekDay + 1;
	}
}
generateCalendar();

// Return existing appointment stored locally
function dayExistingAppointment (day) {
	return existingAppointment = JSON.parse(localStorage.getItem(day));
}

// Add or Edit and Appointment
function addOrEditAppointment (event) {
	event.preventDefault();

	let tableCell = event.currentTarget;
	let selectedDay = +tableCell.getAttribute("data-day");

	let existingAppointment = JSON.parse(localStorage.getItem(selectedDay));
	if (existingAppointment) {
		editAppointment(existingAppointment);
	} else {
		addAppointment(selectedDay);
	}
}

function addAppointment (selectedDay) {
	setAppointmentForm(selectedDay, "", "", true);
	document.getElementById("deleteBtn").setAttribute("disabled", true);
}

function editAppointment (appointment) {
	setAppointmentForm(appointment.day, appointment.title, appointment.description, false);
	document.getElementById("deleteBtn").removeAttribute("disabled");
}

function setAppointmentForm (day, title, description) {
	document.getElementById("appointmentForm").style.display = "block";
	document.getElementById("appointmentForm").setAttribute("data-day", day);
	document.getElementById("formTitle").innerText = "Day " + day;
	document.getElementById("titleField").value = title;
	document.getElementById("descriptionField").value = description;
}

function saveAppointment () {
	currentAppointment.day = document.getElementById("appointmentForm").getAttribute("data-day");
	currentAppointment.title = document.getElementById("titleField").value;
	currentAppointment.description = document.getElementById("descriptionField").value;

	localStorage.setItem(currentAppointment.day, JSON.stringify(currentAppointment));

	// Check if the appointment already exists in the calendar
	let appointmentNode = document.querySelector("td[data-day='" + currentAppointment.day + "'] .appointment");
	if (appointmentNode) {
		appointmentNode.innerText = currentAppointment.title;
	} else {
		let newAppointmentNode = document.createElement("DIV");
		newAppointmentNode.innerText = currentAppointment.title;
		newAppointmentNode.classList.add("appointment");
		document.querySelector("td[data-day='" + currentAppointment.day + "']").appendChild(newAppointmentNode);
	}

	document.getElementById("appointmentForm").style.display = "none";
}

function deleteAppointment () {
	let day = document.getElementById("appointmentForm").getAttribute("data-day");
	localStorage.removeItem(day);

	// Remove appointment node from the calendar
	let appointmentNode = document.querySelector("td[data-day='" + currentAppointment.day + "'] .appointment");
	let tableCell = document.querySelector("td[data-day='" + currentAppointment.day + "']");
	if (appointmentNode && tableCell) tableCell.removeChild(appointmentNode);

	document.getElementById("appointmentForm").style.display = "none";
}