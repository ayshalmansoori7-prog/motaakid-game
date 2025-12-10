// بيانات مبدئية
const categoriesList = [
  "أسئلة عامة","دولة الإمارات","طب","تاريخ","إعلام الدول",
  "أغاني عراقية","أغاني خليجية","أغاني مصرية","رؤساء الدول"
  // يمكن إضافة المزيد حتى 50 فئة
];

let player = {};
let selectedCategories = [];
let questions = [];
let currentQuestionIndex = 0;
let timerInterval;
let timeLeft = 60;
let surpriseUsed = 0;

// شاشة التسجيل
const registrationScreen = document.getElementById('registrationScreen');
const categoryScreen = document.getElementById('categoryScreen');
const questionScreen = document.getElementById('questionScreen');
const surpriseScreen = document.getElementById('surpriseScreen');
const resultScreen = document.getElementById('resultScreen');

const registerBtn = document.getElementById('registerBtn');
const startGameBtn = document.getElementById('startGameBtn');
const startSurpriseBtn = document.getElementById('startSurpriseBtn');
const timerEl = document.getElementById('timer');
const questionText = document.getElementById('questionText');
const answersDiv = document.getElementById('answers');
const categoriesDiv = document.getElementById('categories');
const finalScore = document.getElementById('finalScore');

// إنشاء فئات للاختيار
categoriesList.forEach(cat => {
  const div = document.createElement('div');
  div.classList.add('category');
  div.innerText = cat;
  div.onclick = () => {
    if(div.classList.contains('selected')){
      div.classList.remove('selected');
      selectedCategories = selectedCategories.filter(c => c !== cat);
    } else {
      if(selectedCategories.length < 6){
        div.classList.add('selected');
        selectedCategories.push(cat);
      } else {
        alert("يمكنك اختيار 6 فئات فقط");
      }
    }
  };
  categoriesDiv.appendChild(div);
});

// تسجيل اللاعب
registerBtn.onclick = () => {
  const name = document.getElementById('playerName').value;
  const phone = document.getElementById('playerPhone').value;
  if(!name || !phone){
    alert("أدخل الاسم ورقم الهاتف");
    return;
  }
  player = {name, phone, score: 0};
  registrationScreen.classList.add('hidden');
  categoryScreen.classList.remove('hidden');
};

// بدء اللعبة بعد اختيار الفئات
startGameBtn.onclick = () => {
  if(selectedCategories.length !== 6){
    alert("اختر 6 فئات فقط");
    return;
  }
  categoryScreen.classList.add('hidden');
  loadQuestions();
  showQuestion();
};

// تحميل الأسئلة (أمثلة)
function loadQuestions(){
  selectedCategories.forEach(cat => {
    for(let i=1;i<=4;i++){
      questions.push({
        category: cat,
        text: `${cat} - سؤال ${i}`,
        options: ["الفريق الأول","الفريق الثاني","لا أحد"],
        correct: "الفريق الأول", // مجرد مثال
        points: i*200
      });
    }
  });
  shuffleArray(questions);
}

// خلط الأسئلة
function shuffleArray(array){
  for(let i=array.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// عرض السؤال
function showQuestion(){
  if(currentQuestionIndex >= questions.length){
    showResult();
    return;
  }

  const q = questions[currentQuestionIndex];

  // احتمال السؤال المفاجئ
  if(surpriseUsed < 2 && Math.random() < 0.2){
    questionScreen.classList.add('hidden');
    surpriseScreen.classList.remove('hidden');
    return;
  }

  questionScreen.classList.remove('hidden');
  questionText.innerText = `${q.text} (نقاط: ${q.points})`;
  answersDiv.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.innerText = opt;
    btn.onclick = () => {
      player.score += (opt === q.correct ? q.points : 0);
      currentQuestionIndex++;
      clearInterval(timerInterval);
      timeLeft = 60;
      showQuestion();
    };
    answersDiv.appendChild(btn);
  });

  startTimer();
}

// المؤقت
function startTimer(){
  timerEl.classList.remove('red');
  timerEl.innerText = `الوقت: ${timeLeft}s`;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.innerText = `الوقت: ${timeLeft}s`;
    if(timeLeft <= 10){
      timerEl.classList.add('red');
    }
    if(timeLeft <= 0){
      clearInterval(timerInterval);
      currentQuestionIndex++;
      timeLeft = 60;
      showQuestion();
    }
  },1000);
}

// بدء السؤال المفاجئ
startSurpriseBtn.onclick = () => {
  surpriseScreen.classList.add('hidden');
  surpriseUsed++;
  const q = {
    text: "سؤال مفاجئ!",
    options: ["الفريق الأول","الفريق الثاني","لا أحد"],
    correct: "الفريق الأول",
    points: 400 // مضاعفة النقاط
  };
  questions.splice(currentQuestionIndex,0,q);
  showQuestion();
}

// عرض النتيجة
function showResult(){
  questionScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  finalScore.innerText = `النقاط الكلية: ${player.score}`;
}

