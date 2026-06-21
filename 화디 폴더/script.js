// 현재 사용자가 보고 있는 테스트 페이지 번호 (1부터 시작해서 10까지 갑니다)
let currentPage = 1;
const totalPages = 10; // 3문항씩 총 10페이지 (30문항)

// HTML에서 제어할 버튼과 화면 요소들을 가져옵니다.
const pages = document.querySelectorAll(".page-group");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageIndicator = document.getElementById("page-indicator");

const testCard = document.getElementById("test-card");
const resultCard = document.getElementById("result-card");

const resultTypeText = document.getElementById("result-type-text");
const resultDescText = document.getElementById("result-desc-text");

// 결과도
const resultDatabase = {
  A: {
    type: "[도전적 실험가] 로그라이크 / 로그라이트 성향",
    desc: "실패해도 좌절하지 않고, 매판 새롭게 주어지는 랜덤 조건 속에서 나만의 기발한 아이디어로 위기를 돌파하는 게임이 잘 맞습니다.",
  },
  B: {
    type: "[지도 개척가] 메트로베니아 성향",
    desc: "복잡한 미로의 비밀을 풀고, 내 발로 세상을 하나씩 개척해 나가며 지도를 100% 밝히는 탐험 중심의 게임이 체질에 맞습니다.",
  },
  C: {
    type: "[몰입형 성장가] 정통 RPG 성향",
    desc: "내 캐릭터에 깊은 애착을 느끼며, 시간과 노력을 들인 만큼 정직하고 확실하게 강해지는 눈에 보이는 성장을 선호합니다.",
  },
  D: {
    type: "[실전형 승부사] AOS / MOBA 성향",
    desc: "혼자 하는 것보다 실제 사람들과 실시간으로 소통하고 호흡을 맞춰, 상대방을 실력과 피지컬로 찍어 누르는 경쟁을 즐깁니다.",
  },
  E: {
    type: "[전략적 스토리텔러] CRPG 성향",
    desc: "단순한 피지컬 싸움보다는 바둑처럼 깊이 생각하는 뇌지컬을 선호하며, 내 선택에 따라 세계의 운명이 정교하게 바뀌는 엄청난 자유도를 사랑합니다.",
  },
};

// 🔄 화면을 1페이지부터 10페이지까지 전환해주는 메인 함수입니다.
function updatePage() {
  // 1. 모든 페이지를 다 숨긴 뒤, 현재 페이지 번호에 맞는 화면만 보여줍니다.
  pages.forEach((page) => {
    page.classList.remove("active");
    if (parseInt(page.dataset.page) === currentPage) {
      page.classList.add("active");
    }
  });

  // 2. 하단에 "1 / 10" 처럼 페이지 번호를 업데이트합니다.
  pageIndicator.textContent = `${currentPage} / ${totalPages}`;

  // 3. 1페이지에서는 '이전' 버튼을 숨기고, 2페이지부터는 다시 보여줍니다.
  if (currentPage === 1) {
    prevBtn.style.visibility = "hidden";
  } else {
    prevBtn.style.visibility = "visible";
  }

  // 4. 마지막 10페이지에 도달하면 버튼 글자를 '결과 보기'로 바꿉니다.
  if (currentPage === totalPages) {
    nextBtn.textContent = "결과 보기 🎯";
  } else {
    nextBtn.textContent = "다음 →";
  }
}

// ✅ 현재 페이지에 있는 3개의 질문을 다 찍었는지 검사하는 함수입니다.
function checkCurrentPageAnswered() {
  const activePage = document.querySelector(".page-group.active");
  const radioContainers = activePage.querySelectorAll(".question-block");

  for (let container of radioContainers) {
    // 해당 문항 안에서 하나라도 체크가 되었는지 확인합니다.
    const checked = container.querySelector('input[type="radio"]:checked');
    if (!checked) {
      return false; // 하나라도 안 골랐다면 탈락(false)
    }
  }
  return true; // 모두 골랐다면 통과(true)
}

// ➡️ '다음' 버튼을 클릭했을 때 작동하는 코드입니다.
nextBtn.addEventListener("click", () => {
  // [체크리스트 확인] 만약 다 안 골랐다면 다음 장으로 못 넘어가게 막습니다.
  if (!checkCurrentPageAnswered()) {
    alert(
      "현재 화면에 있는 모든 문항에 답을 선택하셔야 다음으로 갈 수 있습니다!",
    );
    return;
  }

  // 10페이지 전까지는 페이지 번호를 올리며 다음 장으로 이동합니다.
  if (currentPage < totalPages) {
    currentPage++;
    updatePage();
    window.scrollTo(0, 0); // 화면을 맨 위로 부드럽게 올려줍니다.
  } else {
    // 10페이지에서 눌렀다면 점수를 계산해서 최종 결과 창을 띄웁니다.
    calculateAndShowResult();
  }
});

// ⬅️ '이전' 버튼을 클릭했을 때 작동하는 코드입니다.
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    updatePage();
    window.scrollTo(0, 0);
  }
});

// 🧮 유저가 고른 알파벳(A~E) 개수를 모아 결과를 정해주는 함수입니다.
function calculateAndShowResult() {
  const scores = { A: 0, B: 0, C: 0, D: 0, E: 0 };

  // 웹화면에서 사용자가 체크한 모든 라디오 버튼을 찾아서 개수를 셉니다.
  const checkedRadios = document.querySelectorAll(
    'input[type="radio"]:checked',
  );
  checkedRadios.forEach((radio) => {
    const val = radio.value; // 예: 'A' 또는 'B'
    if (scores[val] !== undefined) {
      scores[val]++;
    }
  });

  // 점수가 가장 높은 최고의 성향 알파벳을 찾아냅니다.
  let highestAlphabet = "A";
  let maxScore = -1;

  for (let key in scores) {
    if (scores[key] > maxScore) {
      maxScore = scores[key];
      highestAlphabet = key;
    }
  }

  // 기존 질문 박스는 숨기고, 결과 화면 박스를 화면에 나타냅니다.
  testCard.classList.add("hidden");
  resultCard.classList.remove("hidden");

  // 데이터베이스에서 해당 알파벳 성향의 이름과 설명을 찾아 화면에 적어줍니다.
  const finalResult = resultDatabase[highestAlphabet];
  resultTypeText.textContent = finalResult.type;
  resultDescText.textContent = finalResult.desc;

  window.scrollTo(0, 200);
}

// 🚀 웹페이지가 처음 켜졌을 때 1페이지 세팅을 작동시킵니다.
updatePage();
