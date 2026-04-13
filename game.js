const scenes = {
  start: {
    text: "あなたは暗いダンジョンの入口に立っている。",
    choices: [
      { label: "中に入る", next: "hall" },
      { label: "帰る", next: "end_return" }
    ]
  },
  hall: {
    text: "薄暗い通路だ。前方に宝箱、右に階段がある。",
    choices: [
      { label: "宝箱を開ける", next: "chest" },
      { label: "階段を降りる", next: "stairs" }
    ]
  },
  chest: {
    text: "回復薬を手に入れた！",
    choices: [
      { label: "通路に戻る", next: "hall" }
    ]
  },
  stairs: {
    text: "スライムが現れた！",
    choices: [
      { label: "戦う", next: "win" },
      { label: "逃げる", next: "hall" }
    ]
  },
  win: {
    text: "スライムを倒した！ ダンジョン攻略成功！",
    choices: [
      { label: "最初から", next: "start" }
    ]
  },
  end_return: {
    text: "あなたは安全を優先して帰宅した。",
    choices: [
      { label: "最初から", next: "start" }
    ]
  }
};

let state = {
  current: "start"
};

const textEl = document.getElementById("text");
const choicesEl = document.getElementById("choices");
const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");

function render() {
  const scene = scenes[state.current];
  textEl.textContent = scene.text;
  choicesEl.innerHTML = "";

  scene.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.label;
    btn.onclick = () => {
      state.current = choice.next;
      render();
    };
    choicesEl.appendChild(btn);
  });
}

saveBtn.onclick = () => {
  localStorage.setItem("saveData", JSON.stringify(state));
  alert("セーブしました");
};

loadBtn.onclick = () => {
  const save = localStorage.getItem("saveData");
  if (save) {
    state = JSON.parse(save);
    render();
    alert("ロードしました");
  }
};

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}

render();
