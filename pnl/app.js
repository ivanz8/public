// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyACgDK_O--WV74-Qq4e63VA1gtEFkthatA",
    authDomain: "amaz-4e4ef.firebaseapp.com",
    databaseURL: "https://amaz-4e4ef-default-rtdb.firebaseio.com",
    projectId: "amaz-4e4ef",
    storageBucket: "amaz-4e4ef.appspot.com",
    messagingSenderId: "469490831055",
    appId: "1:469490831055:web:9f9a007ee9aab7803671ba"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, set, get } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

console.log("Firebase initialized");

let currentYear, currentMonth;

document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    updateCalendar();

    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });

    // Test write operation
    set(ref(database, 'test'), 'Hello, Firebase!')
        .then(() => console.log("Test write successful"))
        .catch((error) => console.error("Test write failed:", error));
});

function updateCalendar() {
    console.log(`Updating calendar for ${currentMonth + 1}/${currentYear}`);
    const monthYear = document.getElementById('monthYear');
    const datesContainer = document.querySelector('.dates');
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    monthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    datesContainer.innerHTML = '';

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    console.log(`First day: ${firstDay}, Days in month: ${daysInMonth}`);

    for (let i = 0; i < firstDay; i++) {
        datesContainer.appendChild(document.createElement('div'));
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dateElement = document.createElement('div');
        dateElement.classList.add('date');
        
        const dateNumber = document.createElement('div');
        dateNumber.classList.add('date-number');
        dateNumber.textContent = i;
        dateElement.appendChild(dateNumber);

        const pnlDisplay = document.createElement('div');
        pnlDisplay.classList.add('pnldisplay');
        pnlDisplay.id = `pnl-${currentYear}-${currentMonth + 1}-${i}`;
        dateElement.appendChild(pnlDisplay);

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = `imageInput-${currentYear}-${currentMonth + 1}-${i}`;
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        dateElement.appendChild(fileInput);

        const imagePreview = document.createElement('div');
        imagePreview.classList.add('image-preview');
        imagePreview.id = `imagePreview-${currentYear}-${currentMonth + 1}-${i}`;
        dateElement.appendChild(imagePreview);

        dateElement.addEventListener('click', () => addPnl(i));
        datesContainer.appendChild(dateElement);

        loadPnl(i);
    }

    updateMonthlyStats();
}

let currentDay;
let currentImageData = null;

function addPnl(day) {
    currentDay = day;
    currentImageData = null;
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
    document.getElementById('modalDate').textContent = dateKey;
    document.getElementById('pnlInput').value = '';
    document.getElementById('imageInput').value = '';
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('pasteArea').textContent = 'Click here to paste image';
    document.getElementById('pnlModal').style.display = 'block';
}

document.querySelector('.close').onclick = function() {
    document.getElementById('pnlModal').style.display = 'none';
}

document.getElementById('imageInput').onchange = function(event) {
    handleImageInput(event.target.files[0]);
}

document.getElementById('pasteArea').addEventListener('paste', function(event) {
    event.preventDefault();
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (let item of items) {
        if (item.type.indexOf('image') === 0) {
            const blob = item.getAsFile();
            handleImageInput(blob);
            break;
        }
    }
});

function handleImageInput(file) {
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentImageData = e.target.result;
            document.getElementById('imagePreview').innerHTML = `<img src="${currentImageData}" alt="Preview">`;
            document.getElementById('pasteArea').textContent = 'Image added';
        }
        reader.readAsDataURL(file);
    }
}

document.getElementById('savePnl').onclick = function() {
    const pnl = parseFloat(document.getElementById('pnlInput').value);
    const dateKey = `${currentYear}-${currentMonth + 1}-${currentDay}`;

    if (isNaN(pnl)) {
        alert("Please enter a valid number for P&L.");
        return;
    }

    const data = { pnl: pnl };
    if (currentImageData) {
        data.imageData = currentImageData;
    }

    set(ref(database, `tradingPnl/${dateKey}`), data)
    .then(() => {
        console.log(`Data saved successfully for ${dateKey}`);
        loadPnl(currentDay);
        updateMonthlyStats();
        document.getElementById('pnlModal').style.display = 'none';
    })
    .catch((error) => {
        console.error(`Error saving data for ${dateKey}:`, error);
        alert(`Failed to save data: ${error.message}`);
    });
}

function loadPnl(day) {
    const pnlDisplay = document.getElementById(`pnl-${currentYear}-${currentMonth + 1}-${day}`);
    const imagePreview = document.getElementById(`imagePreview-${currentYear}-${currentMonth + 1}-${day}`);
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;

    get(ref(database, `tradingPnl/${dateKey}`))
        .then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                const pnl = parseFloat(data.pnl);
                const color = pnl >= 0 ? 'green' : 'red';
                pnlDisplay.textContent = `$${pnl.toFixed(2)}`;
                pnlDisplay.style.color = color;

                if (data.imageData) {
                    imagePreview.innerHTML = `
                        <img src="${data.imageData}" alt="Trade Screenshot" class="thumbnail">
                        <div class="attachment-icon">📎</div>
                        <div class="hover-preview">
                            <img src="${data.imageData}" alt="Trade Screenshot">
                        </div>
                    `;
                    imagePreview.onclick = () => openImageViewer(data.imageData, dateKey);
                } else {
                    imagePreview.innerHTML = '';
                }
            } else {
                pnlDisplay.textContent = '';
                pnlDisplay.style.color = 'black';
                imagePreview.innerHTML = '';
            }
        })
        .catch((error) => {
            console.error(`Error loading data for ${dateKey}:`, error);
            pnlDisplay.textContent = `Error`;
            pnlDisplay.style.color = 'red';
            imagePreview.innerHTML = '';
        });
}

function openImageViewer(imageData, dateKey) {
    const viewer = document.createElement('div');
    viewer.className = 'image-viewer';
    viewer.innerHTML = `
        <div class="image-viewer-content">
            <img src="${imageData}" alt="Trade Screenshot">
            <div class="viewer-controls">
                <button class="close-viewer">Close</button>
                <button class="delete-image">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(viewer);

    // Add event listeners
    viewer.querySelector('.close-viewer').addEventListener('click', closeImageViewer);
    viewer.querySelector('.delete-image').addEventListener('click', () => deleteImage(dateKey));
    viewer.addEventListener('click', (e) => {
        if (e.target === viewer) {
            closeImageViewer();
        }
    });
}

function deleteImage(dateKey) {
    if (confirm("Are you sure you want to delete this image?")) {
        get(ref(database, `tradingPnl/${dateKey}`))
            .then((snapshot) => {
                const data = snapshot.val();
                if (data) {
                    // Remove the imageData but keep the PNL
                    delete data.imageData;
                    set(ref(database, `tradingPnl/${dateKey}`), data)
                        .then(() => {
                            console.log(`Image deleted successfully for ${dateKey}`);
                            closeImageViewer();
                            loadPnl(parseInt(dateKey.split('-')[2])); // Reload the cell
                        })
                        .catch((error) => {
                            console.error(`Error deleting image for ${dateKey}:`, error);
                            alert(`Failed to delete image: ${error.message}`);
                        });
                }
            })
            .catch((error) => {
                console.error(`Error fetching data for ${dateKey}:`, error);
                alert(`Failed to fetch data: ${error.message}`);
            });
    }
}

function closeImageViewer() {
    const viewer = document.querySelector('.image-viewer');
    if (viewer) {
        viewer.remove();
    }
}

function updateMonthlyStats() {
    const startDate = `${currentYear}-${currentMonth + 1}-1`;
    const endDate = `${currentYear}-${currentMonth + 1}-31`;

    get(ref(database, 'tradingPnl'))
        .then((snapshot) => {
            let totalPnl = 0;
            let daysTradedCount = 0;
            let tradedPnlTotal = 0;

            snapshot.forEach((childSnapshot) => {
                const key = childSnapshot.key;
                if (key >= startDate && key <= endDate) {
                    const pnl = parseFloat(childSnapshot.val());
                    if (!isNaN(pnl)) {
                        totalPnl += pnl;
                        daysTradedCount++;
                        if (pnl !== 0) {
                            tradedPnlTotal += pnl;
                        }
                    }
                }
            });

            const avgPnl = daysTradedCount > 0 ? totalPnl / daysTradedCount : 0;
            const tradedAvgPnl = daysTradedCount > 0 ? tradedPnlTotal / daysTradedCount : 0;

            document.getElementById('daysTradedCount').textContent = daysTradedCount;
            document.getElementById('avgPnl').textContent = `$${avgPnl.toFixed(2)}`;
            document.getElementById('totalPnl').textContent = `$${totalPnl.toFixed(2)}`;
            document.getElementById('tradedAvgPnl').textContent = `$${tradedAvgPnl.toFixed(2)}`;
        })
        .catch((error) => {
            console.error("Error calculating monthly stats:", error);
        });
}