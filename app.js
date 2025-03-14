// Firebase-konfigurasjon (erstatt med din egen fra Firebase Console)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase konfigurasjon
const firebaseConfig = {
    apiKey: "AIzaSyDlaxIKizc4cL6dAc7nPjldoGisVhPAJyI",
    authDomain: "firestoreskole.firebaseapp.com",
    projectId: "firestoreskole",
    storageBucket: "firestoreskole.firebasestorage.app",
    messagingSenderId: "849041079247",
    appId: "1:849041079247:web:e02d300a8946c8916d30ba"
  };
  
// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referanse til "skoledb" samlingen
const studentCollection = collection(db, "skoledb");

// Håndter skjema
const form = document.getElementById("addStudentForm");
const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const courseInput = document.getElementById("course");
const submitButton = document.getElementById("submitButton");

let editingStudentId = null; // Lagrer ID for oppdatering

// Legg til eller oppdater elev 
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value;
    const age = parseInt(ageInput.value);
    const course = courseInput.value;

    try {
        if (editingStudentId) {
            // Oppdater eksisterende elev
            await updateDoc(doc(db, "skoledb", editingStudentId), {
                name: name,
                age: age,
                course: course
            });
            alert("Elev oppdatert!");
            editingStudentId = null; // Tilbakestill ID etter oppdatering
            submitButton.innerText = "Legg til elev"; // Endre knappetekst tilbake
        } else {
            // Legg til ny elev
            await addDoc(studentCollection, {
                name: name,
                age: age,
                course: course
            });
            alert("Elev lagt til!");
        }

        form.reset();
    } catch (error) {
        console.error("Feil ved lagring: ", error);
    }
});

// ** Les og vis elever i sanntid **
onSnapshot(studentCollection, (snapshot) => {
    const studentList = document.getElementById("studentList");
    studentList.innerHTML = ""; // Tøm listen før oppdatering

    snapshot.forEach((doc) => {
        const student = doc.data();
        const li = document.createElement("li");
        li.innerHTML = `${student.name} (${student.age} år) - ${student.course}
        <button onclick="deleteStudent('${doc.id}')">Slett</button>
        <button onclick="editStudent('${doc.id}', '${student.name}', ${student.age}, '${student.course}')"> Oppdater</button>`;

        studentList.appendChild(li);
    });
});

// ** Slett elev **
window.deleteStudent = async (id) => {
    if (confirm("Er du sikker på at du vil slette denne eleven?")) {
        await deleteDoc(doc(db, "skoledb", id));
        alert("Elev slettet.");
    }
};

// ** Fyll skjema for oppdatering **
window.editStudent = (id, name, age, course) => {
    nameInput.value = name;
    ageInput.value = age;
    courseInput.value = course;

    editingStudentId = id; // Lagre ID for oppdatering
    submitButton.innerText = "Oppdater elev"; // Endre knappetekst
};