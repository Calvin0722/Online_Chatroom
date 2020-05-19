const socket = io();
const rooms = document.getElementById('avaliable-rooms');

socket.emit('get-rooms');

socket.on('rooms', room_list => {
    rooms.innerHTML = `
        ${room_list.map(room => `<option value="${room}">`).join('')}
    `;
})