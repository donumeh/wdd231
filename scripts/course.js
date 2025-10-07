const courses = [
  {
    subject: "CSE",
    number: 110,
    title: "Introduction to Programming",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.",
    technology: ["Python"],
    completed: true,
  },
  {
    subject: "WDD",
    number: 130,
    title: "Web Fundamentals",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands-on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.",
    technology: ["HTML", "CSS"],
    completed: true,
  },
  {
    subject: "CSE",
    number: 111,
    title: "Programming with Functions",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.",
    technology: ["Python"],
    completed: true,
  },
  {
    subject: "CSE",
    number: 210,
    title: "Programming with Classes",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.",
    technology: ["C#"],
    completed: true,
  },
  {
    subject: "WDD",
    number: 131,
    title: "Dynamic Web Fundamentals",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.",
    technology: ["HTML", "CSS", "JavaScript"],
    completed: true,
  },
  {
    subject: "WDD",
    number: 231,
    title: "Frontend Web Development I",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.",
    technology: ["HTML", "CSS", "JavaScript"],
    completed: false,
  },
];

const courseList = document.getElementById("courseList");
const totalCredits = document.getElementById("totalCredits");

const course_details = document.querySelector("#course-details");
const course_detail_close_button = document.querySelector(
  "#course-details-close",
);
const course_details_heading = document.querySelector("#course-details h2");
const course_details_paragraph = document.querySelector("#course-details p");

function displayCourses(coursesToDisplay) {
  if (!courseList || !totalCredits) {
    console.error("Required DOM elements not found");
    return;
  }

  courseList.innerHTML = "";
  let creditTotal = 0;

  if (!coursesToDisplay || coursesToDisplay.length === 0) {
    courseList.innerHTML =
      '<p class="no-courses">No courses found for the selected filter.</p>';
    totalCredits.textContent = "0";
    return;
  }

  coursesToDisplay.forEach((course) => {
    const courseCard = document.createElement("div");
    courseCard.classList.add("course");

    if (course.completed) {
      courseCard.classList.add("completed");
    }

    courseCard.innerHTML = `
            <h3>${course.subject} ${course.number}</h3>
            <p>${course.title}</p>
            <p class="credits">${course.credits} Credits</p>
        `;

    // adding modal to each course
    courseCard.addEventListener("click", (e) => {
      course_details.showModal();
      courses.map((course) => {
        if (
          e.target.children[0] !== undefined &&
          `${course.subject} ${course.number}` ==
            e.target.children[0].textContent
        ) {
          course_details_heading.textContent = course.title;
          course_details_paragraph.innerHTML = `
          <p><strong>Credits</strong>: ${course.credits}</p>
          <p><strong>Certificate</strong>: ${course.certificate}</p>
          <p>${course.description}</p>
          <p><strong>Technologies</strong>: ${course.technology.join(", ")}</p>`;
        }
      });
    });

    course_detail_close_button.addEventListener("click", () => {
      course_details.close();
      course_details_heading.textContent = "";
      course_details_paragraph.textContent = "";
    });

    courseList.appendChild(courseCard);
    creditTotal += course.credits;
  });

  totalCredits.textContent = creditTotal;
}

function filterAllCourses() {
  setActiveButton("allBtn");
  displayCourses(courses);
}

function filterCSECourses() {
  setActiveButton("cseBtn");
  const cseCourses = courses.filter((course) => course.subject === "CSE");
  displayCourses(cseCourses);
}

function filterWDDCourses() {
  setActiveButton("wddBtn");
  const wddCourses = courses.filter((course) => course.subject === "WDD");
  displayCourses(wddCourses);
}

function setActiveButton(activeButtonId) {
  const buttons = ["allBtn", "cseBtn", "wddBtn"];
  buttons.forEach((buttonId) => {
    const button = document.getElementById(buttonId);
    if (button) {
      if (buttonId === activeButtonId) {
        button.classList.add("active");
        button.setAttribute("aria-selected", "true");
      } else {
        button.classList.remove("active");
        button.setAttribute("aria-selected", "false");
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const allBtn = document.getElementById("allBtn");
  const cseBtn = document.getElementById("cseBtn");
  const wddBtn = document.getElementById("wddBtn");

  if (allBtn) allBtn.addEventListener("click", filterAllCourses);
  if (cseBtn) cseBtn.addEventListener("click", filterCSECourses);
  if (wddBtn) wddBtn.addEventListener("click", filterWDDCourses);

  setActiveButton("allBtn");
  displayCourses(courses);
});
