//Create references to HTML elements
let nameInput = document.getElementById('name-input');
let categorySelect = document.getElementById('category-select');
let addGuest = document.getElementById('add-guest');
let guestList = document.getElementById('guest-list');
let guestSummary = document.getElementById('guest-summary')

//Define the maximum number of guest allowed
const MAX_GUEST = 10;

//Function to update the guest count summary
function updateGuestSummary(){
    const totalGuests = guestList.children.length;
    let attendingGuests = 0;
    let notAttendingGuests = 0;

    //Iterate through each list item to count attending/not-attending
    Array.from(guestList.children).forEach(listItem => {
        if(listItem.classList.contains('attending')){
            attendingGuests++;
        } else if(listItem.classList.contains('not-attending')){
            notAttendingGuests++;
        }
    });

    guestSummary.innerHTML = `
    <p>Total Guests: <strong>${totalGuests}</strong></p>
    <p>Attending: <strong>${attendingGuests}</strong></p>
    <p>Not Attending: <strong>${notAttendingGuests}</strong></p>
    `;
}




//Function to add names to the guest list
function addNameToList(event){
event.preventDefault(); //Prevent default form submission behavior

    const name = nameInput.value.trim()//Get the input value and remove leading/trailing spaces
    const category = categorySelect.value;//Get the selected category

   
    if(name === "") {//Check if the input is empty
        alert("Please enter a name!")
        return;//Stop the function if no name is entered 
    }

    //Check if the guest list has reached its limit
    if (guestList.children.length >= MAX_GUEST){
        alert(`The guest list is full! You can only add up to ${MAX_GUEST} guests.`);
        return;//Stop the function if the guest list limit is reached
    }

    //Create a new list item
    const listItem = document.createElement('li');
    //Set initial RSVP status class to attending
    listItem.classList.add('attending');
    //Add category class to the list item for styling
    listItem.classList.add(`category-${category}`);

    //Add container for name and timestamp
    const infoContainer = document.createElement('div');
    infoContainer.className = 'guest-info';

    //Create a span for the name 
    const nameSpan = document.createElement('span');
    nameSpan.className = 'guest-name'//Add class for styling
    nameSpan.textContent = name;
    infoContainer.appendChild(nameSpan);//Append name to infoContainer

    //Display the time when the guest was added
    const timestamp = document.createElement('small');
    const now = new Date();
    timestamp.textContent = `Added: ${now.toLocaleTimeString()} - ${now.toLocaleDateString()}`;
    timestamp.className = 'timestamp'//Add class for styling
    infoContainer.appendChild(timestamp);//Append to infoContainer

    listItem.appendChild(infoContainer);//Append info container to list item

    //Create a Category Tag
    const categoryTag = document.createElement('span');
    categoryTag.textContent = category;//Initial text
    categoryTag.className = `category-tag category-tag-${category}`//Class for styling
    listItem.appendChild(categoryTag)//Append category tag to list item 


    //Create RSVP Toggle Button 
    const rsvpToggleButton = document.createElement('button');
    rsvpToggleButton.textContent = 'Mark Not Attending'//Initial text
    rsvpToggleButton.className = 'rsvp-toggle-btn' //Class for styling

    rsvpToggleButton.onclick = function(){
        //Toggle the 'attending' and 'not-attending' classes
        if(listItem.classList.contains('attending')) {
            listItem.classList.remove('attending');
            listItem.classList.add('not-attending')
            rsvpToggleButton.textContent='Mark Attending'
        } else {
            listItem.classList.remove('not-attending');
            listItem.classList.add('attending');
            rsvpToggleButton.textContent = 'Mark Not Attending';
        }

        updateGuestSummary();//Update summary after RSVP change
    };
    listItem.appendChild(rsvpToggleButton); //Add RSVP button to the list item

    //Create Edit Button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit-btn'; //Class for styling
    editButton.onclick = function() {
        if (editButton.textContent === 'Edit'){
            //Change to edit mode
            const currentName = nameSpan.textContent;
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = currentName;
            editInput.className = 'edit-name-input';//Add class for styling

            infoContainer.replaceChild(editInput, nameSpan);//Replace span with input
            editInput.focus();//Focus on the input field
            editButton.textContent = 'Save';
            editButton.classList.add('save-btn');//Add specific class for Save styling
        } else {
            //Change to save mode
            const editInput = infoContainer.querySelector('.edit-name-input');
            const newName = editInput.value.trim();

            if (newName === ""){
                alert("Name cannot be empty!")
                return
            }

            nameSpan.textContent = newName; //Update the name
            infoContainer.replaceChild(nameSpan, editInput); //Replace input with span
            editButton.textContent = 'Edit'
            editButton.classList.remove('save-btn');//Remove Save styling class
        }
    };
    listItem.appendChild(editButton);//Add edit button to the list item
       
     //Create a delete button for the list item
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-btn'; //Add a class for styling
    deleteButton.onclick = function(){
        guestList.removeChild(listItem);//Remove the parent li when clicked
        updateGuestSummary();//Update summary after deletion
    };
    listItem.appendChild(deleteButton);//Add delete button to the list item

    //Append the new list item to the unordered list
    guestList.appendChild(listItem)

    //Clear the input box
    nameInput.value = "";
    nameInput.focus(); //Keep focus on the input box
    
    
}

//Add an event listener to the buttone to call the addNameToList function when clicked
addGuest.addEventListener('click', addNameToList);

//Allow adding name by pressing Enter key after typing the guest name
nameInput.addEventListener('keypress',function(event){
    if(event.key === 'Enter'){
        event.preventDefault();
        addNameToList(event);
    }
});

//Initial summary update when the page loads
updateGuestSummary();