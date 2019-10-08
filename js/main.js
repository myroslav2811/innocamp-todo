let CARDS = localStorage.cards ? JSON.parse(localStorage.getItem('cards')) : [];

const state = {
    edit: false,
    id: null
};

window.addEventListener('load', () => {
    document.querySelector('.show-modal').addEventListener('click', () => showModal('ADD_CARD'), false);
    document.querySelector('.close-modal').addEventListener('click', closeModalWindow, false);
    document.querySelector('.modal-window-container').addEventListener('click', closeModalWindow, false);
    document.querySelector('.cancel-button').addEventListener('click', closeModalWindow, false);
    document.querySelector('.submit').addEventListener('click', addCard, false);
    document.querySelector('.sort-cards').addEventListener('click', () => sortCards(CARDS), false);
    document.querySelector('.search-area').addEventListener('input', () => onSearchHandler(CARDS), false);
    showCards(CARDS);
}, false);

const onSearchHandler = cards => {
    let value = document.querySelector('.search-area').value;
    console.log(value);
    let filteredCards = cards.filter(item => item.name.toLowerCase().replace(/\s/g, "").includes(value.toLowerCase().replace(/\s/g, "")));
    showCards(filteredCards);
};

const closeModalWindow = event => {
    const modalContainer = document.querySelector('.modal-window-container');
    const cancelButton = document.querySelector('.cancel-button');
    const closeModal = document.querySelector('.close-modal');
    const target = event.target;

    if (target != modalContainer && target != cancelButton && target != closeModal) {
        event.preventDefault();
    } else {
        modalContainer.style.display = 'none';
        state.edit = false;
    }
    event.stopPropagation();
};

const showModal = (operation, id) => {
    let submitButton = document.querySelector('.submit');
    switch (operation) {
        case 'ADD_CARD':
            submitButton.innerHTML = 'Add';
            break;
        case 'EDIT_CARD':
            state.edit = true;
            state.id = id;
            let form = document.querySelector('#newCard');
            let card = CARDS.filter(item => item.id === id)[0];
            form.elements.cardName.value = card.name;
            form.elements.cardDescription.value = card.description;
            form.elements.cardPriority.value = card.priority;
            form.elements.cardDeadline.value = card.deadline;
            submitButton.innerHTML = 'Edit';
            break;
        default:
            console.log('unknown operation');
    }
    document.querySelector('.modal-window-container').style.display = 'block';
};

const addCard = () => {
    const name = document.querySelector('#name-field').value.trim();
    const nameField = document.querySelector('#name-field');
    const errorMessage = document.querySelector('.error-message');
    const reg = /\w/;
    if (!name || !reg.test(name)) {
        nameField.classList.add('input-error');
        errorMessage.style.display = 'block';
    } else {
        let form = document.querySelector('#newCard');
        let description = form.elements.cardDescription.value;
        let priority = form.elements.cardPriority.value;
        let deadline = form.elements.cardDeadline.value;
        let id = state.edit ? state.id : `f${(+new Date).toString(16)}`;
        description = description ? description : 'No description';
        deadline = deadline ? deadline : 'No deadline';
        const item = {
            id,
            name,
            description,
            priority,
            deadline,
            done: false
        };

        if (!state.edit) {
            CARDS.push(item);
        } else {
            CARDS = CARDS.map(card => card.id === item.id ? item : card);
        }
        state.edit = false;
        form.reset();
        document.querySelector('.modal-window-container').style.display = 'none';
        console.log(item);
        nameField.classList.remove('input-error');
        errorMessage.style.display = 'none';
    }
    localStorage.setItem('cards', JSON.stringify(CARDS));
    onSearchHandler(CARDS);
};

const deleteItem = id => {
    CARDS = CARDS.filter(item => item.id !== id);
    localStorage.setItem('cards', JSON.stringify(CARDS));
    onSearchHandler(CARDS);
};

const markItem = id => {
    CARDS = CARDS.map(card => {
        if (card.id === id) {
            card.done = !card.done;
        }
        return card;
    });
    localStorage.setItem('cards', JSON.stringify(CARDS));
    onSearchHandler(CARDS);
};

const showCards = items => {
    let ul = document.createElement('ul');
    let cardsContainer = document.querySelector('#cards-container');
    cardsContainer.innerHTML = '';
    items.forEach((card) => {
        let item = document.createElement('li');
        let name = document.createElement('h4');
        name.innerHTML = card.name;
        name.style.textDecoration = card.done ? 'line-through' : '';
        let description = document.createElement('p');
        description.innerHTML = `Description: ${card.description}`;
        description.style.textDecoration = card.done ? 'line-through' : '';
        let priority = document.createElement('p');
        priority.innerHTML = `Priority: ${card.priority}`;
        priority.style.textDecoration = card.done ? 'line-through' : '';
        let deadline = document.createElement('p');
        deadline.innerHTML = `Deadline: ${card.deadline}`;
        deadline.style.textDecoration = card.done ? 'line-through' : '';
        let deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Delete';
        deleteButton.addEventListener('click', () => deleteItem(card.id), false);
        let doneButton = document.createElement('button');
        doneButton.innerHTML = card.done ? 'Mark as undone' : 'Mark as done';
        doneButton.addEventListener('click', () => markItem(card.id), false);
        item.appendChild(name);
        item.appendChild(description);
        item.appendChild(priority);
        item.appendChild(deadline);
        item.appendChild(deleteButton);
        if (!card.done) {
            let editButton = document.createElement('button');
            editButton.innerHTML = 'Edit';
            editButton.addEventListener('click', () => showModal('EDIT_CARD', card.id), false);
            item.appendChild(editButton);
        }
        item.appendChild(doneButton);
        ul.appendChild(item);
    });
    cardsContainer.appendChild(ul);
};

const sortCards = cards => {
    cards.sort((a, b) => !!a.done - !!b.done);
    onSearchHandler(cards);
};

