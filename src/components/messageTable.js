export function renderMessages(messages) {
    const tableBody = document.querySelector('#message-table tbody');

    messages.forEach((message) => {
        const row = document.createElement('tr');

        const fromCell = document.createElement('td');
        fromCell.textContent = message.from;

        const subjectCell = document.createElement('td');
        subjectCell.textContent =
            message.subject.length > 15 ? `${message.subject.slice(0, 15)}...` : message.subject;

        const dateCell = document.createElement('td');
        const date = new Date(message.received * 1000);
        const formattedDate = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')} ${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
        dateCell.textContent = formattedDate;

        row.appendChild(fromCell);
        row.appendChild(subjectCell);
        row.appendChild(dateCell);

        tableBody.prepend(row);
    });
}