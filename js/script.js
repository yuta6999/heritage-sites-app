// サンプルデータ（ワンファイルに凝縮！）
const heritageData = [
    { name: "ギザのピラミッド", tags: ["エジプト", "砂漠", "巨石建造物", "世界の七不思議", "紀元前"] },
    { name: "マチュ・ピチュ", tags: ["ペルー", "山岳地帯", "空中都市", "世界の七不思議", "インカ帝国"] },
    { name: "クスコの市街", tags: ["ペルー", "山岳地帯", "インカ帝国", "植民地時代"] },
    { name: "アンコール・ワット", tags: ["カンボジア", "ジャングル", "巨大寺院", "ヒンドゥー教", "仏教"] },
    { name: "モン・サン・ミシェル", tags: ["フランス", "修道院", "孤島", "キリスト教", "海"] },
    { name: "ベネチアとその干潟", tags: ["イタリア", "水の都", "運河", "海", "芸術"] },
    { name: "サグラダ・ファミリア", tags: ["スペイン", "巨大寺院", "ガウディ", "芸術", "建築美"] },
    { name: "ガルパゴス諸島", tags: ["エクアドル", "固有種", "火山島", "海", "進化論"] },
    { name: "屋久島", tags: ["日本", "大自然", "原生林", "巨木", "島"] },
    { name: "姫路城", tags: ["日本", "城郭", "建築美", "江戸時代", "国宝"] },
    { name: "自由の女神像", tags: ["アメリカ", "巨大建造物", "近代史", "島", "世界平和"] },
    { name: "タージ・マハル", tags: ["インド", "墓廟", "大理石", "建築美", "イスラム教"] }
];

let currentStep = 1;
const maxSteps = 10;
const tripLog = [];
let currentItem = null;

// 旅の開始・次の遺産へ
function nextTrip(selectedTag = null) {
    if (currentStep > maxSteps) {
        showResults();
        return;
    }

    let nextItem;
    if (selectedTag) {
        // タップされたタグを持つ遺産の中から、今と違うものをランダムに選ぶ
        const candidates = heritageData.filter(h => h.tags.includes(selectedTag) && h.name !== currentItem.name);
        nextItem = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : getRandomItem();
        tripLog.push({ name: currentItem.name, tag: selectedTag });
    } else {
        nextItem = getRandomItem();
    }

    currentItem = nextItem;
    document.getElementById("current-step").innerText = currentStep;
    document.getElementById("heritage-name").innerText = currentItem.name;

    // タグボタンの生成
    const tagsBox = document.getElementById("tags-box");
    tagsBox.innerHTML = "";
    currentItem.tags.forEach(tag => {
        const btn = document.createElement("button");
        btn.className = "tag-btn";
        btn.innerText = `#${tag}`;
        btn.onclick = () => {
            currentStep++;
            nextTrip(tag);
        };
        tagsBox.appendChild(btn);
    });
}

function getRandomItem() {
    return heritageData[Math.floor(Math.random() * heritageData.length)];
}

// 振り返り画面の表示
function showResults() {
    tripLog.push({ name: currentItem.name, tag: "終着地" }); // 最後の遺産を記録
    document.getElementById("trip-screen").classList.add("hidden");
    document.getElementById("result-screen").classList.remove("hidden");

    const historyBox = document.getElementById("history-box");
    historyBox.innerHTML = "";
    
    for (let i = 0; i < tripLog.length; i++) {
        const li = document.createElement("li");
        li.className = "history-item";
        if (i < tripLog.length - 1) {
            li.innerHTML = `👣 <b>${tripLog[i].name}</b> <span class="history-tag">#${tripLog[i].tag} ➔</span>`;
        } else {
            li.innerHTML = `📍 <b>${tripLog[i].name}</b> <span class="history-tag">[旅の終着地]</span>`;
        }
        historyBox.appendChild(li);
    }
}

// シェア機能（Web Share API ＋ クリップボードコピーのハイブリッド）
function shareTrip() {
    let text = "世界遺産を巡るハッシュタグの旅 #tagtrip を終えました。\n\n";
    tripLog.forEach((log, index) => {
        if(index < tripLog.length - 1) {
            text += `${index + 1}. ${log.name} (#${log.tag})\n`;
        } else {
            text += `${index + 1}. ${log.name} (終着地)\n`;
        }
    });
    
    if (navigator.share) {
        navigator.share({ title: 'tag trip 旅の記憶', text: text }).catch(console.error);
    } else {
        navigator.clipboard.writeText(text);
        alert("旅の記憶をクリップボードにコピーしました！SNS等に貼り付けてね。");
    }
}

// 初回起動
nextTrip();