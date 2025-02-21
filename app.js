// Firebase-konfigurasjon (erstatt med din egen fra Firebase Console)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Firebase konfigurasjon
const firebaseConfig = {
    apiKey: "DIN_API_KEY",
    authDomain: "DITT_PROSJEKT.firebaseapp.com",
    projectId: "DITT_PROSJEKT_ID",
    storageBucket: "DITT_PROSJEKT.appspot.com",
    messagingSenderId: "DIN_MELDINGS_ID",
    appId: "DIN_APP_ID"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referanse til "students" samlingen
const studentCollection = collection(db, "students");

// ** Legg til student **
document.getElementById("addStudentForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const age = parseInt(document.getElementById("age").value);
    const course = document.getElementById("course").value;

    try {
        await addDoc(studentCollection, {
            name: name,
            age: age,
            course: course
        });
        alert("Student lagt til!");
        e.target.reset();
    } catch (error) {
        console.error("Feil ved lagring: ", error);
    }
});

// ** Les og vis studentene i sanntid **
onSnapshot(studentCollection, (snapshot) => {
    const studentList = document.getElementById("studentList");
    studentList.innerHTML = ""; // Tøm listen før oppdatering

    snapshot.forEach((doc) => {
        const student = doc.data();
        const li = document.createElement("li");
        li.innerHTML = `${student.name} (${student.age} år) - ${student.course}
        <button onclick="deleteStudent('${doc.id}')">🗑️ Slett</button>
        <button onclick="updateStudent('${doc.id}', '${student.name}', ${student.age}, '${student.course}')">✏️ Oppdater</button>`;

        studentList.appendChild(li);
    });
});

// ** Slett student **
window.deleteStudent = async (id) => {
    if (confirm("Er du sikker på at du vil slette denne studenten?")) {
        await deleteDoc(doc(db, "students", id));
        alert("Student slettet.");
    }
};

// ** Oppdater student **
window.updateStudent = async (id, name, age, course) => {
    const newName = prompt("Nytt navn:", name);
    const newAge = parseInt(prompt("Ny alder:", age));
    const newCourse = prompt("Nytt kurs:", course);

    if (newName && newAge && newCourse) {
        await updateDoc(doc(db, "students", id), {
            name: newName,
            age: newAge,
            course: newCourse
        });
        alert("Student oppdatert!");
    }
};
