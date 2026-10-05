import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const examData = {
  biology: {
    name: "Biology",
    duration: 30,
    questions: [
      {
        question: "Which organelle is known as the powerhouse of the cell?",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
        answer: "Mitochondria",
      },
      {
        question: "What is the process by which green plants make their food?",
        options: ["Respiration", "Digestion", "Photosynthesis", "Transpiration"],
        answer: "Photosynthesis",
      },
      {
        question: "Which blood cells are mainly responsible for fighting infections?",
        options: ["Red blood cells", "White blood cells", "Platelets", "Plasma"],
        answer: "White blood cells",
      },
      {
        question: "What is the basic structural and functional unit of life?",
        options: ["Tissue", "Organ", "Cell", "System"],
        answer: "Cell",
      },
      {
        question: "Which organ pumps blood around the body?",
        options: ["Liver", "Lungs", "Kidney", "Heart"],
        answer: "Heart",
      },
      {
        question: "Which part of the plant absorbs water and mineral salts from the soil?",
        options: ["Leaf", "Stem", "Root", "Flower"],
        answer: "Root",
      },
      {
        question: "Which gas is released during photosynthesis?",
        options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
        answer: "Oxygen",
      },
      {
        question: "What is the largest organ in the human body?",
        options: ["Liver", "Heart", "Skin", "Lungs"],
        answer: "Skin",
      },
      {
        question: "Which organ is primarily responsible for filtering waste from the blood?",
        options: ["Heart", "Kidney", "Stomach", "Pancreas"],
        answer: "Kidney",
      },
      {
        question: "Which molecule carries genetic information?",
        options: ["ATP", "DNA", "Glucose", "Lipid"],
        answer: "DNA",
      },
      {
        question: "Which blood group is commonly called the universal donor?",
        options: ["A positive", "AB positive", "O negative", "B negative"],
        answer: "O negative",
      },
      {
        question: "Where does most absorption of digested nutrients occur?",
        options: ["Stomach", "Small intestine", "Large intestine", "Oesophagus"],
        answer: "Small intestine",
      },
      {
        question: "Which structure controls the activities of most cells?",
        options: ["Cell wall", "Nucleus", "Vacuole", "Cytoplasm"],
        answer: "Nucleus",
      },
      {
        question: "Which tissue transports water in plants?",
        options: ["Phloem", "Xylem", "Epidermis", "Cambium"],
        answer: "Xylem",
      },
      {
        question: "Which tissue transports manufactured food in plants?",
        options: ["Xylem", "Phloem", "Cortex", "Epidermis"],
        answer: "Phloem",
      },
      {
        question: "Which hormone helps regulate blood glucose levels?",
        options: ["Insulin", "Adrenaline", "Thyroxine", "Oestrogen"],
        answer: "Insulin",
      },
      {
        question: "Which chamber of the heart pumps oxygenated blood to the body?",
        options: ["Right atrium", "Right ventricle", "Left atrium", "Left ventricle"],
        answer: "Left ventricle",
      },
      {
        question: "Which organ is mainly responsible for gas exchange in humans?",
        options: ["Kidney", "Lungs", "Liver", "Heart"],
        answer: "Lungs",
      },
      {
        question: "What type of reproduction involves only one parent?",
        options: ["Sexual reproduction", "Asexual reproduction", "Fertilization", "Conjugation"],
        answer: "Asexual reproduction",
      },
      {
        question: "Which part of the eye controls the amount of light entering it?",
        options: ["Retina", "Lens", "Iris", "Cornea"],
        answer: "Iris",
      },
    ],
  },

  chemistry: {
    name: "Chemistry",
    duration: 40,
    questions: [
      {
        question: "What is the chemical symbol for sodium?",
        options: ["S", "So", "Na", "Sd"],
        answer: "Na",
      },
      {
        question: "What is the atomic number of oxygen?",
        options: ["6", "7", "8", "9"],
        answer: "8",
      },
      {
        question: "Which gas is most abundant in the Earth's atmosphere?",
        options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
        answer: "Nitrogen",
      },
      {
        question: "What is H₂O commonly known as?",
        options: ["Hydrogen peroxide", "Water", "Oxygen", "Hydrogen"],
        answer: "Water",
      },
      {
        question: "A substance with a pH below 7 is generally what?",
        options: ["Neutral", "Basic", "Acidic", "Salty"],
        answer: "Acidic",
      },
      {
        question: "What is the chemical symbol for potassium?",
        options: ["P", "Pt", "K", "Po"],
        answer: "K",
      },
      {
        question: "Which particle has a negative electrical charge?",
        options: ["Proton", "Neutron", "Electron", "Nucleus"],
        answer: "Electron",
      },
      {
        question: "Which particle has no electrical charge?",
        options: ["Proton", "Electron", "Neutron", "Ion"],
        answer: "Neutron",
      },
      {
        question: "What is the chemical formula for carbon dioxide?",
        options: ["CO", "CO₂", "C₂O", "C₂O₂"],
        answer: "CO₂",
      },
      {
        question: "Which element has the chemical symbol Fe?",
        options: ["Fluorine", "Iron", "Francium", "Fermium"],
        answer: "Iron",
      },
      {
        question: "What is the smallest unit of an element that retains its chemical properties?",
        options: ["Molecule", "Atom", "Compound", "Ion"],
        answer: "Atom",
      },
      {
        question: "Which of the following is a noble gas?",
        options: ["Chlorine", "Oxygen", "Neon", "Hydrogen"],
        answer: "Neon",
      },
      {
        question: "What is the valency of oxygen in most of its compounds?",
        options: ["1", "2", "3", "4"],
        answer: "2",
      },
      {
        question: "Which acid is present in vinegar?",
        options: ["Hydrochloric acid", "Sulfuric acid", "Acetic acid", "Nitric acid"],
        answer: "Acetic acid",
      },
      {
        question: "Which gas is required for combustion?",
        options: ["Nitrogen", "Oxygen", "Carbon dioxide", "Helium"],
        answer: "Oxygen",
      },
      {
        question: "What is the chemical symbol for gold?",
        options: ["Gd", "Go", "Au", "Ag"],
        answer: "Au",
      },
      {
        question: "Which of the following is a strong acid?",
        options: ["Hydrochloric acid", "Water", "Ammonia", "Sodium hydroxide"],
        answer: "Hydrochloric acid",
      },
      {
        question: "What is the formula of sodium chloride?",
        options: ["NaCl", "Na₂Cl", "NaCl₂", "NCl"],
        answer: "NaCl",
      },
      {
        question: "Which method is commonly used to separate an insoluble solid from a liquid?",
        options: ["Distillation", "Filtration", "Chromatography", "Sublimation"],
        answer: "Filtration",
      },
      {
        question: "Which process changes a liquid into a gas?",
        options: ["Freezing", "Condensation", "Vaporization", "Melting"],
        answer: "Vaporization",
      },
      {
        question: "Which process changes a gas into a liquid?",
        options: ["Condensation", "Evaporation", "Sublimation", "Melting"],
        answer: "Condensation",
      },
      {
        question: "Which element is represented by the symbol Cl?",
        options: ["Calcium", "Chlorine", "Carbon", "Cobalt"],
        answer: "Chlorine",
      },
      {
        question: "What is the approximate relative molecular mass of water?",
        options: ["16", "18", "20", "22"],
        answer: "18",
      },
      {
        question: "Which substance is a base?",
        options: ["Hydrochloric acid", "Sodium hydroxide", "Carbon dioxide", "Sulfuric acid"],
        answer: "Sodium hydroxide",
      },
      {
        question: "What is the pH of a neutral solution at room temperature?",
        options: ["0", "5", "7", "14"],
        answer: "7",
      },
      {
        question: "Which type of bond involves the sharing of electrons?",
        options: ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"],
        answer: "Covalent bond",
      },
      {
        question: "Which type of bond is formed by transfer of electrons?",
        options: ["Covalent bond", "Ionic bond", "Metallic bond", "Coordinate bond"],
        answer: "Ionic bond",
      },
      {
        question: "Which element is essential for the formation of haemoglobin?",
        options: ["Iron", "Calcium", "Sodium", "Potassium"],
        answer: "Iron",
      },
      {
        question: "What is the chemical formula for methane?",
        options: ["CH₄", "C₂H₆", "CH₃OH", "CO₂"],
        answer: "CH₄",
      },
      {
        question: "Which gas is produced when an acid reacts with a carbonate?",
        options: ["Oxygen", "Hydrogen", "Carbon dioxide", "Nitrogen"],
        answer: "Carbon dioxide",
      },
    ],
  },

  physics: {
    name: "Physics",
    duration: 35,
    questions: [
      {
        question: "What is the SI unit of force?",
        options: ["Joule", "Watt", "Newton", "Pascal"],
        answer: "Newton",
      },
      {
        question: "What is the approximate speed of light in vacuum?",
        options: [
          "3 × 10⁶ m/s",
          "3 × 10⁸ m/s",
          "3 × 10¹⁰ m/s",
          "3 × 10⁴ m/s",
        ],
        answer: "3 × 10⁸ m/s",
      },
      {
        question: "Which instrument is used to measure electric current?",
        options: ["Voltmeter", "Ammeter", "Barometer", "Thermometer"],
        answer: "Ammeter",
      },
      {
        question: "What is the SI unit of energy?",
        options: ["Newton", "Watt", "Joule", "Volt"],
        answer: "Joule",
      },
      {
        question: "Which force pulls objects toward the Earth?",
        options: ["Friction", "Magnetic force", "Gravity", "Tension"],
        answer: "Gravity",
      },
      {
        question: "What is the SI unit of electric current?",
        options: ["Volt", "Ohm", "Ampere", "Watt"],
        answer: "Ampere",
      },
      {
        question: "What is the SI unit of resistance?",
        options: ["Volt", "Ohm", "Ampere", "Joule"],
        answer: "Ohm",
      },
      {
        question: "Which device converts electrical energy into mechanical energy?",
        options: ["Generator", "Motor", "Transformer", "Battery"],
        answer: "Motor",
      },
      {
        question: "What is the rate of change of velocity called?",
        options: ["Speed", "Acceleration", "Momentum", "Force"],
        answer: "Acceleration",
      },
      {
        question: "What is the SI unit of power?",
        options: ["Joule", "Newton", "Watt", "Pascal"],
        answer: "Watt",
      },
      {
        question: "Which quantity has both magnitude and direction?",
        options: ["Scalar", "Vector", "Mass", "Distance"],
        answer: "Vector",
      },
      {
        question: "Which of these is a scalar quantity?",
        options: ["Velocity", "Force", "Speed", "Acceleration"],
        answer: "Speed",
      },
      {
        question: "What is the tendency of an object to resist a change in its motion?",
        options: ["Momentum", "Inertia", "Friction", "Pressure"],
        answer: "Inertia",
      },
      {
        question: "Which law states that every action has an equal and opposite reaction?",
        options: [
          "Newton's First Law",
          "Newton's Second Law",
          "Newton's Third Law",
          "Law of Conservation",
        ],
        answer: "Newton's Third Law",
      },
      {
        question: "What is the formula for density?",
        options: [
          "Mass × Volume",
          "Mass / Volume",
          "Volume / Mass",
          "Mass + Volume",
        ],
        answer: "Mass / Volume",
      },
      {
        question: "Which instrument measures atmospheric pressure?",
        options: ["Thermometer", "Barometer", "Ammeter", "Hydrometer"],
        answer: "Barometer",
      },
      {
        question: "What type of energy does a moving object possess?",
        options: ["Potential energy", "Kinetic energy", "Chemical energy", "Nuclear energy"],
        answer: "Kinetic energy",
      },
      {
        question: "What type of energy is stored in an object due to its position?",
        options: ["Kinetic energy", "Potential energy", "Sound energy", "Light energy"],
        answer: "Potential energy",
      },
      {
        question: "Which wave can travel through a vacuum?",
        options: ["Sound wave", "Water wave", "Light wave", "Seismic wave"],
        answer: "Light wave",
      },
      {
        question: "Sound cannot travel through which of the following?",
        options: ["Water", "Steel", "Air", "Vacuum"],
        answer: "Vacuum",
      },
      {
        question: "Which lens is used to correct short-sightedness?",
        options: ["Convex lens", "Concave lens", "Cylindrical lens", "Plane lens"],
        answer: "Concave lens",
      },
      {
        question: "Which lens is used to correct long-sightedness?",
        options: ["Concave lens", "Convex lens", "Plane lens", "Prism"],
        answer: "Convex lens",
      },
      {
        question: "What happens to the frequency of a wave when its wavelength decreases while speed remains constant?",
        options: ["It decreases", "It increases", "It becomes zero", "It remains unchanged"],
        answer: "It increases",
      },
      {
        question: "Which material is generally a good conductor of electricity?",
        options: ["Rubber", "Glass", "Copper", "Wood"],
        answer: "Copper",
      },
      {
        question: "What is the unit of frequency?",
        options: ["Newton", "Hertz", "Watt", "Joule"],
        answer: "Hertz",
      },
    ],
  },
};

function Exam() {
  const { examId } = useParams();
  const exam = examData[examId];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(
    exam ? exam.duration * 60 : 0
  );
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // TIMER
  useEffect(() => {
    if (!exam || submitted) return;

    if (timeLeft <= 0) {
      submitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((time) => time - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted, exam]);

  // FORMAT TIMER
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      secondsLeft
    ).padStart(2, "0")}`;
  };

  // SELECT ANSWER
  const selectAnswer = (answer) => {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion]: answer,
    }));
  };

  // NEXT
  const nextQuestion = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion((question) => question + 1);
    }
  };

  // PREVIOUS
  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((question) => question - 1);
    }
  };

  // SUBMIT
  const submitExam = () => {
    let finalScore = 0;

    exam.questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        finalScore++;
      }
    });

    const percentage = Math.round(
      (finalScore / exam.questions.length) * 100
    );

    setScore(finalScore);
    setSubmitted(true);
    setShowSubmitModal(false);

    const oldResults =
      JSON.parse(localStorage.getItem("examResults")) || [];

    const newResult = {
      subject: exam.name,
      examId: examId,
      score: finalScore,
      total: exam.questions.length,
      percentage: percentage,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    localStorage.setItem(
      "examResults",
      JSON.stringify([...oldResults, newResult])
    );
  };

  if (!exam) {
    return (
      <div className="page">
        <div className="instructions-card">
          <h1>Exam Not Found</h1>

          <p>
            The examination you are looking for does not exist.
          </p>

          <Link to="/exams" className="primary-button">
            Back to Exams
          </Link>
        </div>
      </div>
    );
  }

  // RESULT
  if (submitted) {
    const percentage = Math.round(
      (score / exam.questions.length) * 100
    );

    return (
      <div className="result-page">
        <div className="result-card">

          <div className="result-icon">🎉</div>

          <h1>Exam Completed!</h1>

          <p>
            You have successfully completed your{" "}
            <strong>{exam.name}</strong> examination.
          </p>

          <div className="score-display">
            <span>Your Score</span>

            <strong>
              {score} / {exam.questions.length}
            </strong>

            <b>{percentage}%</b>
          </div>

          <div className="result-actions">
            <Link
              to="/dashboard"
              className="primary-button"
            >
              Back to Dashboard
            </Link>

            <Link
              to="/results"
              className="secondary-button"
            >
              View Results
            </Link>
          </div>

        </div>
      </div>
    );
  }

  const question = exam.questions[currentQuestion];

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="exam-page">

      {/* HEADER */}

      <header className="exam-header">

        <div>
          <h1>{exam.name} Examination</h1>

          <p>
            Question {currentQuestion + 1} of{" "}
            {exam.questions.length}
          </p>
        </div>

        <div className="exam-timer">
          ⏱️ {formatTime(timeLeft)}
        </div>

      </header>


      {/* EXAM BODY */}

      <main className="exam-content">

        {/* QUESTION CARD */}

        <section className="question-card">

          <div className="question-top">
            <span>
              Question {currentQuestion + 1}
            </span>

            <span>
              {answeredCount} / {exam.questions.length} answered
            </span>
          </div>

          <h2>
            {question.question}
          </h2>


          {/* ANSWERS */}

          <div className="options">

            {question.options.map((option, index) => {

              const selected =
                answers[currentQuestion] === option;

              return (
                <button
                  key={index}
                  type="button"
                  className={`option ${
                    selected ? "selected" : ""
                  }`}
                  onClick={() => selectAnswer(option)}
                >

                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span className="option-text">
                    {option}
                  </span>

                </button>
              );
            })}

          </div>

        </section>


        {/* QUESTION NUMBERS */}

        <section className="question-navigation">

          <div className="navigation-header">

            <h3>Questions</h3>

            <span>
              {answeredCount} answered
            </span>

          </div>

          <div className="question-numbers">

            {exam.questions.map((_, index) => (

              <button
                key={index}
                type="button"
                onClick={() =>
                  setCurrentQuestion(index)
                }
                className={`
                  question-number-button
                  ${
                    currentQuestion === index
                      ? "current"
                      : ""
                  }
                  ${
                    answers[index]
                      ? "answered"
                      : ""
                  }
                `}
              >
                {index + 1}
              </button>

            ))}

          </div>

        </section>


        {/* CONTROLS */}

        <div className="exam-controls">

          <button
            type="button"
            className="secondary-button"
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
          >
            ← Previous
          </button>


          {currentQuestion ===
          exam.questions.length - 1 ? (

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                setShowSubmitModal(true)
              }
            >
              Submit Exam
            </button>

          ) : (

            <button
              type="button"
              className="primary-button"
              onClick={nextQuestion}
            >
              Next →
            </button>

          )}

        </div>

      </main>


      {/* SUBMIT CONFIRMATION */}

      {showSubmitModal && (

        <div className="modal-overlay">

          <div className="submit-modal">

            <h2>Submit Examination?</h2>

            <p>
              Are you sure you want to submit your{" "}
              {exam.name} examination?
            </p>

            <p>
              You have answered{" "}
              <strong>
                {answeredCount}
              </strong>{" "}
              out of{" "}
              <strong>
                {exam.questions.length}
              </strong>{" "}
              questions.
            </p>

            <div className="modal-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  setShowSubmitModal(false)
                }
              >
                Continue Exam
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={submitExam}
              >
                Yes, Submit
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Exam;